# Stage 1: Builder
FROM node:18-alpine AS builder
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PNPM_STORE_DIR=/root/.local/share/pnpm/store/v3

# Install pnpm globally
RUN npm install -g pnpm

WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Remove any existing node_modules
RUN rm -rf node_modules

# Install dependencies including devDependencies
RUN pnpm install --frozen-lockfile --store-dir $PNPM_STORE_DIR

# Install @nestjs/cli as a dev dependency
RUN pnpm add -D @nestjs/cli --store-dir $PNPM_STORE_DIR

# Copy the rest of the project files
COPY . .

# Build the application
WORKDIR /app/apps/payever-invoicer
RUN pnpm run build

# Production stage
FROM node:18-alpine
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PNPM_STORE_DIR=/root/.local/share/pnpm/store/v3

# Install pnpm globally
RUN npm install -g pnpm

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile --store-dir $PNPM_STORE_DIR

# Copy built application from the builder stage
COPY --from=builder /app/apps/payever-invoicer/dist ./apps/payever-invoicer/dist

# Switch to non-root user
USER appuser

# Labels
LABEL maintainer="Vahid <Wanocop@gmail.com>"
LABEL description="Payever Invoicer Service"
LABEL version="1.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/health || exit 1

# Set working directory
WORKDIR /app/apps/payever-invoicer

# Start the application
CMD ["node", "dist/main"]