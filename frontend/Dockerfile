# ===================================================
# CarePoint Hospital Management System - Frontend Dockerfile
# Multi-stage build with Node.js builder + Nginx Alpine runner
# ===================================================

# ── Stage 1: Build React/TypeScript Application ────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy full frontend source code
COPY . .

# Build production distribution package
RUN npm run build

# ── Stage 2: Serve with Nginx Alpine ───────────────
FROM nginx:alpine

# Copy custom Nginx configuration with reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy production bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose web server port
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

# Launch Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
