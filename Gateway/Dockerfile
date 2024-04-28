# Use a Node.js image with TypeScript pre-installed
FROM node:latest as build-stage
# Set the working directory
WORKDIR /usr/src/app
# Copy package.json and package-lock.json (if available)
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of your app's source code
COPY . .
# Build your TypeScript application
RUN npm run build
# Use a smaller base image for the production stage
FROM node:alpine
# Set the working directory for the production stage
WORKDIR /usr/src/app
# Copy package.json and package-lock.json (if available)
COPY package*.json ./
# Install only production dependencies
RUN npm install --only=production
# Copy the built application from the build stage
COPY --from=build-stage /usr/src/app/dist ./dist
# Expose the port the app runs on
EXPOSE 3000
# Define the command to run your app
CMD ["node", "dist/src/app.js"]



# Development stage
FROM node:latest as dev
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]