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

# Copy package manifests and prisma schema
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma

# Accept build arguments for public variables
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY

# Install dependencies
RUN pnpm install

# Copy the rest of the source code
COPY . .

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
COPY --from=builder /app/src/generated ./src/generated

# Install only production dependencies
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile || pnpm install --prod

# Expose the port Next.js runs on
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the application with automated DB sync and seeding
CMD sh -c "npx prisma db push --accept-data-loss && node scripts/rebuild-master.js && ./node_modules/.bin/next start -H 0.0.0.0"
