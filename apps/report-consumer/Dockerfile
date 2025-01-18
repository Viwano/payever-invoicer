# Stage 1: Build the application
FROM node:18-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
COPY apps/report-consumer/package.json ./apps/report-consumer/package.json

# Install dependencies using pnpm
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY apps/report-consumer ./apps/report-consumer

# Build the application
RUN pnpm run build --filter=report-consumer

# Stage 2: Create the production image
FROM node:18-alpine

# Install pnpm
RUN npm install -g pnpm

# Set the working directory
WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./
COPY apps/report-consumer/package.json ./apps/report-consumer/package.json

# Install only production dependencies using pnpm
RUN pnpm install --production --filter=report-consumer

# Copy the built application from the builder stage
COPY --from=builder /app/apps/report-consumer/dist ./dist

# Command to run the application
CMD ["node", "dist/main"]