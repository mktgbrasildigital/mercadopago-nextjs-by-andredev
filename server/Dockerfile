FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production --legacy-peer-deps || npm install --production
COPY server.js ./
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]
