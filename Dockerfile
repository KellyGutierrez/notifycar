# Dockerfile for NotifyCar (Next.js) application
# ---------------------------------------------------
# Build stage
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Install openssl and required tools
RUN apt-get update -y && apt-get install -y openssl ca-certificates

# Install pnpm (fast package manager)
RUN npm install -g pnpm

# Copy package manifests
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Generate Prisma Client
RUN pnpm exec prisma generate

# Build the Next.js application
RUN pnpm run build

# Production stage
FROM node:20-slim AS runner
WORKDIR /app

# Install OpenSSL for Prisma in production
RUN apt-get update -y && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/prisma ./prisma

# Install only production dependencies
RUN npm install -g pnpm && pnpm install --prod --frozen-lockfile

# Expose the port Next.js runs on
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application
CMD sh -c "pnpm exec prisma db push && pnpm start"
