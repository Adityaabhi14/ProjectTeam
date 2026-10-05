# ===================================================
# CarePoint Hospital Management System - Backend Production Dockerfile
# Base Image: Node.js 20 LTS Alpine (Lightweight & Secure)
# ===================================================
FROM node:20-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Create app directory
WORKDIR /app

# Copy root dependency manifests
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy backend source files and static assets
COPY backend/ ./backend/
COPY index.html style.css script.js favicon.svg icons.svg ./
COPY assets/ ./assets/

# Set production environment defaults
ENV NODE_ENV=production
ENV PORT=5000

# Expose backend REST API port
EXPOSE 5000

# Container healthcheck
HEALTHCHECK --interval=15s --timeout=5s --start-period=15s --retries=5 \
  CMD wget -qO- http://localhost:5000/api/health | grep -q 'online' || exit 1

# Start the Node.js Express server
CMD ["node", "backend/server.js"]
