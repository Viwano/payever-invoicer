FROM node:18-alpine AS builder

# Install pnpm and nest CLI globally
RUN npm install -g pnpm
RUN npm install -g @nestjs/cli
# Set the pnpm store directory explicitly
RUN pnpm config set store-dir /root/.local/share/pnpm/store/v3

WORKDIR /app

# Copy the entire project first to ensure tsconfig and other necessary files are available
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/report-consumer
RUN pnpm run build

FROM node:18-alpine
# Install pnpm and nest CLI globally
RUN npm install -g pnpm
RUN npm install -g @nestjs/cli

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist

RUN pnpm install --production --filter=report-consumer

CMD ["node", "dist/main"]