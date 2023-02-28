FROM nginx
COPY prod.default.conf /etc/nginx/conf.d/default.conf
COPY build/ /usr/share/nginx/build/
