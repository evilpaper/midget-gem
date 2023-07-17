FROM node:latest

# Define our working directory in the container.
WORKDIR /app

# Copy whole project to the app directory.
COPY . /app

# Install required dependencies.
RUN npm install

# Expose the port in which application should run.
EXPOSE 8000

# Finally run the execution command.
CMD node ./build/server.js