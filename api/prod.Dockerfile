# pull the Node.js Docker image
FROM node:alpine

# create the directory inside the container
WORKDIR /usr/src/app

RUN apk add --update python3 make g++ 

# # copy the package.json files from local machine to the workdir in container
COPY package*.json ./

# # copy the generated modules and all other files to the container
COPY . .

# # run npm install in our local machine
RUN npm install

# our app is running on port 5000 within the container, so need to expose it
EXPOSE 8080

# the command that starts our app
CMD ["npm", "run", "run-prod"]


