FROM node:20.12.2


# Upgrade NPM
RUN npm install -g npm@10.5.2

# Install prerequisites
RUN apt-get update
RUN apt-get install -y \
    lsb-release \
    curl

# Install TypeScript
RUN npm install -g typescript@5.4.5
