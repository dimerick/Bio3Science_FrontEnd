# Establecer la imagen base
FROM nginx:latest

# Eliminar los archivos de configuración existentes de Nginx
RUN rm -rf /etc/nginx/conf.d/*

# Copiar los archivos de la aplicación Angular al directorio de trabajo de Nginx
COPY dist/bio3science /usr/share/nginx/html

# Copiar el archivo de configuración personalizado de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80 para acceder a la aplicación
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

