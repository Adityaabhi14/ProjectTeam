import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import {randomBytes, createHash}  from "crypto";
import {SignJwt,exportJWT,importPCKS8} from "jose";

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const clients = new Map();
const authorizationCodes = new Map();
const refreshTokens = new Map();

clients.set("demo-client", {
  client_id: "demo-client",
  redirectUris: ["http://localhost:4000/callback"]
});

const PRiVATE_KEY_PEM = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDA6Z1g5+7x8V3F
...
-----END PRIVATE KEY-----`;

const ISSUER = "http://localhost:3000";
const KEY_ID = "demo-key-1";

function base64url(input) {
  return input.toString('base64').replace(/\+/g,"-").replace(/\//g,"=").replace(/=+$/g,"");
}

function sha256baseurl(str) {
  const hash = createHash("sha256").update(str).digest();
  return base64url(hash);
}

function generateCode() {
return base64url(randomBytes(32));
}
