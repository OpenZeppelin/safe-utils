# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package.json and package-lock.json first
COPY app/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY app/ ./

# Build the Next.js app
RUN npm run build

# Runtime stage
FROM node:20-slim AS runner

WORKDIR /app

# Copy built app from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.js ./

# Install production dependencies only
RUN npm install --production

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]