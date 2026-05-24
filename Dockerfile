# 1. Usamos una imagen oficial de Node.js estable y ligera
FROM node:20-alpine

# 2. Creamos y nos situamos en la carpeta de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiamos los archivos de dependencias primero (para aprovechar la caché de Docker)
COPY package*.json ./

# 4. Instalamos las dependencias de producción (evitamos instalar nodemon en el contenedor)
RUN npm install --omit=dev

# 5. Copiamos el resto del código de la aplicación al contenedor
COPY . .

# 6. Exponemos el puerto en el que corre tu app de Express
EXPOSE 3000

# 7. Comando para arrancar la aplicación en producción
CMD ["node", "app.js"]