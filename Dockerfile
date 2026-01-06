FROM node:20-alpine

WORKDIR /app

# Copy the standalone output from local build
COPY .next/standalone ./
COPY .next/static ./.next/static
COPY public ./public

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

# Start the application
CMD ["node", "server.js"]
