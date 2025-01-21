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
COPY ./apps/payever-invoicer ./apps/payever-invoicer

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm run build -w @app/payever-invoicer

# Verify the build output
RUN ls -lR /app/dist

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

RUN corepack enable && corepack prepare pnpm@latest --activate

EXPOSE 3000

CMD ["node", "dist/src/main.js"]