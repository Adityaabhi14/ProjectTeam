import { jwtVerify, createRemoteJWKSet } from "jose";

const AUTH_SERVER = "http://localhost:5000";

const JWKS = createRemoteJWKSet(
    new URL(AUTH_SERVER + "/.well-known/jwks.json")
);

export async function authMiddleware(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Authorization required"
        });
    }

    const parts = authHeader.split(" ");

    if (parts[0] !== "Bearer") {
        return res.status(401).json({
            error: "Bearer token required"
        });
    }

    const token = parts[1];

    try {

        const { payload } = await jwtVerify(token, JWKS, {
            issuer: AUTH_SERVER
        });

        req.user = payload;

        next();

    } catch (error) {

        return res.status(401).json({
            error: "Invalid or expired token"
        });

    }
}
