# React app image
FROM node:lts-alpine AS build

WORKDIR /app

# Copy only package files to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the React application
RUN npm run build

# Nginx to serve the built application
FROM nginx:1.21-alpine AS prod

# Copy built application from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy custom nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 8080
EXPOSE 8080:80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
