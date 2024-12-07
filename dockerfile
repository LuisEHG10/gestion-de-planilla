# Usar la imagen base de Node.js
FROM node:20

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios para instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar el resto de los archivos al contenedor
COPY . .

# Construir la aplicación
RUN npm run build

# Exponer el puerto de la aplicación (asegúrate de que sea el correcto)
EXPOSE 3000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]
