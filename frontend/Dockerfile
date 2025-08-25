# Use Node 22.18.0
FROM node:22.18.0

# Set working directory
WORKDIR /app

# Install dependencies first
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Run Vite dev server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
