
# A Dockerfile is a textfile containing instructions needed
# to assemble the application into a container image.
# Each instructions creates a layer in the image.


# Defines a base for your image. Most images are based on other images.
# In our case the base is latest version of Node.js
FROM node:latest

# Set ENV veriable
# ENV NODE_ENV=production

# Define our working directory to be used for the container by 
# following instructions like COPY, RUN etc. 
WORKDIR /app

# Copy the necessy packages. Syntax COPY <from> <to>
# Most likely don't need this step since we copy whole app 
# including package.json in the next instruction.
# COPY ["package.json", "package-lock.json*", "./"]

# Copy whole project to the app directory.
COPY . /app

# Executes any commands in a new layer on top of the current image 
# and commits the result. In our case we install required 
# dependencies in our WORKDIR.
RUN npm install

# Expose the port in which application should run.
EXPOSE 8080

# Lets you define the default program that is run once you start the 
# container based on this image. Each Dockerfile only has one CMD.
# In out case, we finally start the node application
CMD node ./build/server.js