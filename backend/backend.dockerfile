
# This Dockerfile sets up the environment for a Node.js application

# Use the official Node.js 20 image from Docker Hub
FROM node:20

# Set the working directory to /app
WORKDIR /app

# Copy both package.json and package-lock.json to /app
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the "prisma" directory to /app/prisma
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the project to /app
COPY . .

# Inform Docker that the container listens on port 4000
EXPOSE 4000

# Command to run when the container starts
CMD ["npm", "start"]
