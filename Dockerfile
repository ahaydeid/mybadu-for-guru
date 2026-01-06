FROM node:20-alpine

WORKDIR /app

# Copy the standalone output
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

# Expose port
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]
