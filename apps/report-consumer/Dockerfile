# Stage 1: Build the application
FROM node:18-alpine AS builder

# Install pnpm and nest CLI globally
RUN npm install -g pnpm @nestjs/cli

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY apps/report-consumer ./apps/report-consumer

WORKDIR /app/apps/report-consumer
# Build the application
RUN pnpm run build

# Stage 2: Create the production image
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

WORKDIR /app/apps/report-consumer
# Install only production dependencies using pnpm
RUN pnpm install --production --filter=report-consumer

# Copy the built application from the builder stage
COPY --from=builder /app/apps/report-consumer/dist ./dist

# Command to run the application
CMD ["node", "dist/main"]