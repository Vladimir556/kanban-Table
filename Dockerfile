FROM node:14.19
WORKDIR /app/client
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]