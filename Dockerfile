# Use a imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm ci --only=production

# Copia o código do servidor
COPY server.js ./

# Expõe a porta que o Cloud Run irá usar
EXPOSE 8080

# Define a variável de ambiente PORT
ENV PORT=8080

# Comando para iniciar o servidor
CMD ["node", "server.js"]
