# Stage 1: Build the React application
FROM node:latest as build-stage

# Set the working directory
WORKDIR /app


# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the project files into the docker image
COPY . .

# Build the application
RUN npm run build

# Stage 2: Serve the application from Nginx
FROM nginx:stable-alpine as production-stage

# Copy the build output to replace the default nginx contents
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 to the outside once the container has launched
EXPOSE 80

# Start Nginx and keep it running in the foreground
CMD ["nginx", "-g", "daemon off;"]
