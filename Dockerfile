FROM minizinc/minizinc

# Update apt cache
RUN apt update

# Install curl ( required for nodejs setup )
RUN apt install curl -y


# Install node ( project dependency )
RUN curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/node_setup_18.x.sh \
 && bash /tmp/node_setup_18.x.sh \
 && apt install -y nodejs 

# Set home directory
WORKDIR /var/project

# Setup project
COPY . .

# Install npm dependencies
RUN npm i

# Run server
ENTRYPOINT node server.js


