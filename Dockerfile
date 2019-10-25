FROM node:carbon
COPY . /sjzq-backend
WORKDIR /sjzq-backend
RUN npm install pm2 -g
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["pm2-runtime","start", "./start.json"]
