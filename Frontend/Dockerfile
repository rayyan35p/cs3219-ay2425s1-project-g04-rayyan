# Use an official Node.js image as a base image
FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the React app
RUN npm run build
# Use a lightweight web server to serve static files
FROM nginx:alpine
# Copy build files to NGINX's default public folder
COPY --from=build /app/build /usr/share/nginx/html
# Expose port 8080 for Cloud Run
EXPOSE 8080
# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
