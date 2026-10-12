# ==============================================================================
# Node.js + Express Backend Dockerfile (Multi-stage build)
# ==============================================================================

# Stage 1: Build TypeScript source code
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    PORT=5000

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy compiled JavaScript output
COPY --from=builder /app/dist ./dist

# Create uploads and logs directories
RUN mkdir -p uploads logs

EXPOSE 5000

CMD ["node", "dist/server.js"]
