FROM node:22-bookworm-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --omit=dev

# Copy application source code
COPY . .

# Ensure data directory exists and assign permissions to non-root user (UID 1000)
RUN mkdir -p /app/data /app/.data && chown -R 1000:1000 /app

# Switch to non-root user required by Hugging Face Spaces
USER 1000

# Set Hugging Face default port
ENV PORT=7860
EXPOSE 7860

# Start Express & SQLite server
CMD ["npm", "start"]
