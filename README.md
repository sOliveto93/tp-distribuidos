# Museo Virtual Interactivo

## Requisitos

- Java 17+
- Maven
- Node.js 20+
- npm
- Docker / Docker Compose

## Estructura
```text
museo/
├── rest/          # Backend REST - Spring Boot
├── graphql/       # Backend GraphQL - Node.js + Express
├── front/         # Frontend React
├── init.sql
├── data.sql
└── docker-compose.yml
```
## Base de datos

La base de datos MySQL se ejecuta mediante Docker.

### Levantar MySQL

docker compose up

Configuración(a modo de ejemplo):

- Host: localhost
- Puerto: 3307
- Base de datos: museo
- Usuario: root
- Contraseña: root

Los scripts `init.sql` y `data.sql` se ejecutan al inicializar la base de datos.


## Backend REST
```text
Ingresar a `rest/`:

cd rest

Ejecutar:

./mvnw clean install -DskipTests <-- comando necesario por si hay problemas con las dependencias y los test

./mvnw spring-boot:run

o click derecho 'RUN' o metodo que utilice su ide para ejecutar

Disponible en:

http://localhost:8080
```
## Backend GraphQL
```text
Ingresar a `graphql/`:

cd graphql

Instalar dependencias:

npm install

Ejecutar en desarrollo:

npm run dev

Disponible en:

http://localhost:4000
```
## Frontend
```text
Ingresar a `front/`:

cd front

Instalar dependencias:

npm install

Ejecutar:

npm run dev

Disponible en:

http://localhost:5173
```
## Desarrollo

Durante el desarrollo se recomienda ejecutar MySQL mediante Docker y los demás servicios localmente:
```text
Docker:
- MySQL → 3307

Local:
- Spring Boot → 8080
- GraphQL → 4000
- React/Vite → 5173
```
Esto permite modificar el código sin reconstruir las imágenes Docker.

## Docker

Actualmente Docker se utiliza únicamente para ejecutar MySQL.

Para levantar la base de datos:

```bash
docker compose up
```
Para detener el contenedor:
```
docker compose down
```
Más adelante se dockerizarán todos los servicios. Actualmente cada servicio cuenta con un Dockerfile preparado para esa futura implementación.



### Reinicializar la base de datos

Si se desea eliminar la base de datos actual y volver a crear el esquema con los datos de prueba:

```bash
docker compose down -v
docker compose up
```
Esto elimina el volumen de MySQL, por lo que init.sql y data.sql se ejecutan nuevamente.
