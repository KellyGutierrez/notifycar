# Dockerfile for NotifyCar (Next.js) application
# ---------------------------------------------------
# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install pnpm (fast package manager)
RUN apk add --no-cache openssl
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
FROM node:20-alpine AS runner
WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

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
CMD sh -c "pnpm exec prisma migrate deploy && pnpm start"
