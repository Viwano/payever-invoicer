FROM node:18-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy root configuration files
COPY pnpm-*.yaml ./
COPY package.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./

# Copy the specific app's source
COPY ./apps/report-consumer ./apps/report-consumer

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm run build -w @app/report-consumer

FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

CMD ["node", "dist/apps/report-consumer/main.js"]