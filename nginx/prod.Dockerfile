# Build the frontend app
FROM node:alpine as build
WORKDIR /usr/src/app
COPY ./app .
RUN yarn
RUN yarn build


# Build the nginx image
FROM nginx
COPY --from=build /usr/src/app/build /usr/share/nginx/build
COPY ./nginx/prod.default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
