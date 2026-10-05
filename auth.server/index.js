import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { SignJWT, createRemoteJWKSet, exportJWK, importPKCS8, jwtVerify } from "jose";
import { createHash, createPublicKey, randomBytes } from "crypto";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const port = Number.parseInt(process.env.PORT || "5000", 10);
const publicBaseUrl = (process.env.AUTH_PUBLIC_URL || `http://localhost:${port}`).replace(/\/$/, "");
const issuer = (process.env.AUTH_ISSUER || publicBaseUrl).replace(/\/$/, "");
const googleRedirectUri = process.env.GOOGLE_REDIRECT_URI || `${publicBaseUrl}/google/callback`;
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const keyId = process.env.AUTH_KEY_ID || "hospital-auth-key-1";
const privateKeyPath = process.env.AUTH_JWT_PRIVATE_KEY_PATH || path.join(__dirname, "private_key.pem");
const cookieSecure = process.env.NODE_ENV === "production";

const defaultRedirectUris = ["http://127.0.0.1:5501/", "http://localhost:5173/", "http://127.0.0.1:5173/"];
const frontendRedirectUris = (process.env.FRONTEND_REDIRECT_URIS || defaultRedirectUris.join(","))
  .split(",").map((uri) => uri.trim()).filter(Boolean);
const allowedOrigins = new Set(frontendRedirectUris.map((uri) => new URL(uri).origin));
const allowedScopes = new Set(["profile", "api.read"]);
const clients = new Map([["hospital-frontend", { redirectUris: frontendRedirectUris }]]);
const authorizationCodes = new Map();
const refreshTokens = new Map();
const sessions = new Map();
const googleLogins = new Map();
const privateKeyPem = readFileSync(privateKeyPath, "utf8");
const googleJwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

app.use((req, res, next) => {
  const origin = req.get("origin");
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

function base64url(value) {
  return Buffer.from(value).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function randomToken() { return base64url(randomBytes(32)); }
function sha256Base64url(value) { return base64url(createHash("sha256").update(value).digest()); }

function removeExpiredRecords() {
  const now = Date.now();
  for (const [code, record] of authorizationCodes) if (record.expiresAt <= now) authorizationCodes.delete(code);
  for (const [token, record] of refreshTokens) if (record.expiresAt <= now) refreshTokens.delete(token);
  for (const [sessionId, record] of sessions) if (record.expiresAt <= now) sessions.delete(sessionId);
  for (const [state, record] of googleLogins) if (record.expiresAt <= now) googleLogins.delete(state);
}

function hasGoogleConfiguration() { return Boolean(googleClientId && googleClientSecret); }

function getAuthorizationRequest(query) {
  const { response_type: responseType, client_id: clientId, redirect_uri: redirectUri, scope = "", state,
    code_challenge: codeChallenge, code_challenge_method: codeChallengeMethod } = query;
  const client = clients.get(clientId);
  if (!client) throw new Error("Unknown client_id.");
  if (!client.redirectUris.includes(redirectUri)) throw new Error("Invalid redirect_uri.");
  if (responseType !== "code") throw new Error("Only response_type=code is supported.");
  if (!codeChallenge || codeChallengeMethod !== "S256") throw new Error("PKCE with code_challenge_method=S256 is required.");
  const scopes = scope.split(" ").filter(Boolean);
  if (scopes.some((item) => !allowedScopes.has(item))) throw new Error("One or more requested scopes are not allowed.");
  return { clientId, redirectUri, scope: scopes.join(" "), state: typeof state === "string" ? state : "", codeChallenge };
}

function authorizationQuery(request) {
  const query = new URLSearchParams({ response_type: "code", client_id: request.clientId, redirect_uri: request.redirectUri,
    scope: request.scope, code_challenge: request.codeChallenge, code_challenge_method: "S256" });
  if (request.state) query.set("state", request.state);
  return query;
}

function setSession(res, user) {
  const sessionId = randomToken();
  sessions.set(sessionId, { user, expiresAt: Date.now() + 8 * 60 * 60 * 1000 });
  res.cookie("auth_session", sessionId, { httpOnly: true, sameSite: "lax", secure: cookieSecure,
    maxAge: 8 * 60 * 60 * 1000, path: "/" });
}

async function createAccessToken(user, clientId, scope) {
  const privateKey = await importPKCS8(privateKeyPem, "RS256");
  return new SignJWT({ scope, name: user.name, email: user.email, email_verified: user.emailVerified,
    picture: user.picture, provider: "google" })
    .setProtectedHeader({ alg: "RS256", kid: keyId, typ: "JWT" }).setIssuer(issuer).setAudience(clientId)
    .setSubject(user.sub).setIssuedAt().setExpirationTime("15m").sign(privateKey);
}

function issueRefreshToken(user, clientId, scope) {
  const refreshToken = randomToken();
  refreshTokens.set(refreshToken, { user, clientId, scope, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  return refreshToken;
}

async function exchangeGoogleCode(code, expectedNonce) {
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: googleClientId, client_secret: googleClientSecret,
      redirect_uri: googleRedirectUri, grant_type: "authorization_code" }),
  });
  if (!tokenResponse.ok) throw new Error("Google rejected the authorization code.");
  const tokens = await tokenResponse.json();
  if (!tokens.id_token) throw new Error("Google did not return an ID token.");
  const { payload } = await jwtVerify(tokens.id_token, googleJwks, {
    audience: googleClientId, issuer: ["https://accounts.google.com", "accounts.google.com"],
  });
  if (payload.nonce !== expectedNonce) throw new Error("Google login nonce did not match.");
  if (!payload.sub || !payload.email) throw new Error("Google did not provide the required user profile.");
  return { sub: payload.sub, name: payload.name || payload.email, email: payload.email,
    emailVerified: payload.email_verified === true, picture: typeof payload.picture === "string" ? payload.picture : undefined };
}

app.get("/health", (_req, res) => res.json({ ok: true, googleConfigured: hasGoogleConfiguration(), issuer }));

app.get("/authorize", (req, res) => {
  removeExpiredRecords();
  let request;
  try { request = getAuthorizationRequest(req.query); } catch (error) { return res.status(400).send(error.message); }
  const session = sessions.get(req.cookies.auth_session);
  if (!session) return res.redirect(`/login?${authorizationQuery(request).toString()}`);
  const code = randomToken();
  authorizationCodes.set(code, { ...request, user: session.user, expiresAt: Date.now() + 3 * 60 * 1000 });
  const redirect = new URL(request.redirectUri);
  redirect.searchParams.set("code", code);
  if (request.state) redirect.searchParams.set("state", request.state);
  return res.redirect(redirect.toString());
});

app.get("/login", (req, res) => {
  if (!hasGoogleConfiguration()) return res.status(503).send("Google sign-in is not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET.");
  let request;
  try { request = getAuthorizationRequest(req.query); } catch (error) { return res.status(400).send(error.message); }
  const state = randomToken();
  const nonce = randomToken();
  googleLogins.set(state, { request, nonce, expiresAt: Date.now() + 10 * 60 * 1000 });
  res.cookie("google_oauth_state", state, { httpOnly: true, sameSite: "lax", secure: cookieSecure,
    maxAge: 10 * 60 * 1000, path: "/google" });
  const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleUrl.search = new URLSearchParams({ client_id: googleClientId, redirect_uri: googleRedirectUri,
    response_type: "code", scope: "openid email profile", state, nonce }).toString();
  return res.redirect(googleUrl.toString());
});

app.get("/google/callback", async (req, res) => {
  removeExpiredRecords();
  const { code, state, error } = req.query;
  const login = typeof state === "string" ? googleLogins.get(state) : undefined;
  const receivedState = req.cookies.google_oauth_state;
  res.clearCookie("google_oauth_state", { path: "/google", secure: cookieSecure, sameSite: "lax" });
  if (typeof state === "string") googleLogins.delete(state);
  if (error) return res.status(401).send("Google sign-in was cancelled or denied.");
  if (!login || state !== receivedState || typeof code !== "string") return res.status(400).send("Invalid or expired Google sign-in request.");
  try {
    const user = await exchangeGoogleCode(code, login.nonce);
    setSession(res, user);
    return res.redirect(`${publicBaseUrl}/authorize?${authorizationQuery(login.request).toString()}`);
  } catch (error) {
    console.error("Google sign-in failed:", error.message);
    return res.status(401).send("Unable to complete Google sign-in. Please try again.");
  }
});

app.post("/token", async (req, res) => {
  removeExpiredRecords();
  if (req.body.grant_type === "authorization_code") {
    const { code, redirect_uri: redirectUri, client_id: clientId, code_verifier: codeVerifier } = req.body;
    const record = authorizationCodes.get(code);
    if (!record || record.expiresAt <= Date.now()) {
      if (record) authorizationCodes.delete(code);
      return res.status(400).json({ error: "invalid_grant" });
    }
    if (record.clientId !== clientId || record.redirectUri !== redirectUri || typeof codeVerifier !== "string") {
      return res.status(400).json({ error: "invalid_grant", error_description: "Client or redirect URI mismatch." });
    }
    if (sha256Base64url(codeVerifier) !== record.codeChallenge) {
      return res.status(400).json({ error: "invalid_grant", error_description: "PKCE verification failed." });
    }
    authorizationCodes.delete(code);
    const accessToken = await createAccessToken(record.user, record.clientId, record.scope);
    const refreshToken = issueRefreshToken(record.user, record.clientId, record.scope);
    return res.json({ access_token: accessToken, token_type: "Bearer", expires_in: 900, refresh_token: refreshToken, scope: record.scope });
  }
  if (req.body.grant_type === "refresh_token") {
    const { refresh_token: refreshToken, client_id: clientId } = req.body;
    const record = refreshTokens.get(refreshToken);
    if (!record || record.expiresAt <= Date.now() || record.clientId !== clientId) {
      if (record) refreshTokens.delete(refreshToken);
      return res.status(400).json({ error: "invalid_grant" });
    }
    refreshTokens.delete(refreshToken);
    const accessToken = await createAccessToken(record.user, record.clientId, record.scope);
    const newRefreshToken = issueRefreshToken(record.user, record.clientId, record.scope);
    return res.json({ access_token: accessToken, token_type: "Bearer", expires_in: 900, refresh_token: newRefreshToken, scope: record.scope });
  }
  return res.status(400).json({ error: "unsupported_grant_type" });
});

app.post("/logout", (req, res) => {
  const sessionId = req.cookies.auth_session;
  if (sessionId) sessions.delete(sessionId);
  res.clearCookie("auth_session", { path: "/", secure: cookieSecure, sameSite: "lax" });
  return res.status(204).end();
});

app.get("/.well-known/jwks.json", async (_req, res) => {
  const publicKey = createPublicKey(privateKeyPem);
  const jwk = await exportJWK(publicKey);
  jwk.use = "sig";
  jwk.alg = "RS256";
  jwk.kid = keyId;
  return res.json({ keys: [jwk] });
});

app.listen(port, () => {
  console.log(`Hospital auth server listening on ${publicBaseUrl}`);
  console.log(`Google sign-in configured: ${hasGoogleConfiguration() ? "yes" : "no"}`);
});
