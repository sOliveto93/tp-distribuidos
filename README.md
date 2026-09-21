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
### Swagger / OpenAPI

La API REST cuenta con documentación mediante 
Swagger UI. 
Disponible en:
```text
http://localhost:8080/swagger-ui/index.html
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
### Esquema con GraphiQL
Se encuentra habilitado para consultar y explorar el esquema GraphQL.

Disponible en:
```text
http://localhost:4000/graphql
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


## Autenticación y seguridad

La autenticación del sistema se implementa mediante JWT (JSON Web Token).

El login se realiza mediante el backend REST:
```
POST /api/auth/login
```
El servidor valida las credenciales y genera un JWT firmado mediante HS256.

El token contiene, entre otros datos:
```
sub: email del usuario

role: rol del usuario

iat: fecha de emisión

exp: fecha de expiración
```
Las operaciones protegidas reciben el token mediante el header HTTP:

Authorization: Bearer <token>

### REST

En el backend Spring Boot, un JwtAuthenticationFilter intercepta las requests y verifica el JWT.

Si el token es válido, se crea la autenticación correspondiente y se almacena en el SecurityContext.

La autorización de las rutas se configura mediante Spring Security.

### GraphQL

El backend GraphQL utiliza el mismo secreto y algoritmo HS256 para validar los JWT generados por el backend REST.

Un middleware de Express:

Obtiene el header Authorization.

Extrae el JWT.

Verifica su firma y validez.

Obtiene el email y rol del usuario.

Inyecta la información del usuario en el contexto de GraphQL.

Los resolvers utilizan esta información para determinar si el usuario está autorizado a ejecutar una operación.

Por ejemplo, el reporte de asistencia requiere rol CURADOR o ADMINISTRADOR.

### Roles

El sistema contempla los siguientes roles:
```
VISITANTE

CURADOR

ADMINISTRADOR
```
Los usuarios registrados mediante /api/auth/register reciben inicialmente el rol VISITANTE.


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
