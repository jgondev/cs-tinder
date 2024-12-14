# Usa la imagen base oficial de Node.js
FROM node:18

# Define el directorio de trabajo
WORKDIR /app

# Copia los archivos necesarios
COPY package*.json ./
RUN npm install

# Copia el resto del código al contenedor
COPY . .

# Exponer el puerto (8080 en tu caso)
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["node", "index.js"]
