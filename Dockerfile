# Use official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the frontend
RUN npm run build

# Expose the port
EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]