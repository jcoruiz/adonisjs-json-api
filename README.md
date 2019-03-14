# API

API 

## Instalación

Instalar Docker

  Mac  
    https://docs.docker.com/docker-for-mac/install/  
  Windows  
    https://docs.docker.com/docker-for-windows/install/  
  Ubuntu  
    https://docs.docker.com/install/linux/docker-ce/ubuntu/  

Clonar repositorios

```bash
git clone https://gitlab.com/borbotones/api.git && git clone https://gitlab.com/borbotones/client.git && git clone https://gitlab.com/borbotones/assets.git
```

## Crear docker-compose.yml
El archivo debe crearse en la raiz donde quedaron los 3 repositorios y se veria algo asi  
-api  
-assets  
-cliente  
-docker-compose.yml  
```yml
version: "3"

services:
  db:
    image: mysql:5.7.24
    command: --default-authentication-plugin=mysql_native_password
    restart: always
    ports:
     - "33066:3306"
    environment:
      MYSQL_ROOT_PASSWORD: Qwerty123
  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080
  api:
    build: ./api
    ports:
     - "3330:3333"
    volumes:
     - ./api:/app
    depends_on:
     - db
    command: bash -c "npm install && adonis serve --dev"
  assets:
    build: ./assets
    ports:
     - "3335:3335"
    volumes:
     - ./assets:/usr/src/app
    command: bash -c "npm install && adonis serve --dev"
  front:
    build: ./client
    ports:
      - "3000:3000"
    volumes:
     - ./client:/usr/src/app
    command: bash -c "npm install && npm rebuild node-sass && npm run dev"
```
## Env

   Tanto para "api" como para "assets" crear el archivo .env en base al codigo existente en .env.example  
   
## Ejecutar docker compose

```bash
docker-compose build && docker-compose up
```
Esto se va a tomar un poco de tiempo por qué tiene que crear y descargar imagenes. Luego solo tenemos que ejecutar docker-compose up para que corra el proyecto.

## API Ejemplo
    http://localhost:3330/kk/V1/core/person

## Base de datos
La base de datos se encuentra en localhost:33066 user:"root" password:"Qwerty123"  
De igual manera podemos ingresar a la BD mediante http://localhost:8080 con las credenciales señaladas arriba

Si es primera vez que ejecutas el proyecto debes ejecutar lo siguiente para crear la BD app:
```bash
./api/database/_model/restore.sh 127.0.0.1 33066 root Qwerty123
```
 
## Aplicacion Web
La aplicación web se ejecuta en http://localhost:3000 y los assets en http://localhost:3335

## Documentación
Para generar la documentación ejecuta lo siguiente y ir al index.html de la carpeta documentation
```bash
grunt jsdoc
```