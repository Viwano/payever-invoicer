# First Dockerfile (payever-invoicer)
FROM node:18-alpine AS builder
# Add build arguments for better flexibility
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Install pnpm and nest CLI globally
RUN npm install -g pnpm @nestjs/cli

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/payever-invoicer ./apps/payever-invoicer
WORKDIR /app/apps/payever-invoicer
# Build
RUN pnpm run build

# Production stage
FROM node:18-alpine
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Install pnpm and curl for healthcheck
RUN npm install -g pnpm && \
    apk add --no-cache curl

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

WORKDIR /app/apps/payever-invoicer
# Install production dependencies
RUN pnpm install --production --filter=payever-invoicer

# Copy built application
COPY --from=builder --chown=appuser:appgroup /app/apps/payever-invoicer/dist ./dist

# Set user
USER appuser

# Add metadata
LABEL maintainer="Vahid <Wanocop@gmail.com>"
LABEL description="Payever Invoicer Service"
LABEL version="1.0"

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "dist/main"]