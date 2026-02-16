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

# Accept build arguments for public variables
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY

# Install dependencies
RUN pnpm install

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
COPY --from=builder /app/scripts ./scripts

# Install only production dependencies
RUN npm install -g pnpm && pnpm install --prod && pnpm exec prisma generate

# Expose the port Next.js runs on
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application with automated DB sync and seeding - FORCED
CMD sh -c "npx prisma db push --accept-data-loss && node scripts/seed-emergencies.js && node scripts/migrate-templates.js && node scripts/seed-corporate.js && pnpm start"
