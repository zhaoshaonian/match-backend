FROM nginx
ADD nginx.conf /usr/local/nginx/conf/nginx.conf
ADD dist /usr/local/nginx/html
RUN chown nginx:nginx -R /usr/local/nginx/html
EXPOSE 80
ENTRYPOINT [ "nginx", "-g", "daemon off;"]
