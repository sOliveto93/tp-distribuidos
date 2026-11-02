# Museo Virtual Interactivo

## Tecnologías utilizadas

```text
Componente

Tecnología

Backend REST

Java 17+, Spring Boot, Maven

Backend GraphQL

Node.js, Express, GraphQL

Servicio gRPC

Go

Gateway gRPC

Node.js

Mensajería

Apache Kafka

Coordinación de Kafka

Zookeeper

Productor Kafka

Python

Consumidor Kafka

Node.js

Frontend

React, TypeScript, Vite

Base de datos

MySQL 8

Contenedores
```
## Docker y Docker Compose

``` text
Para ejecutar el sistema completo

Docker.

Docker Compose (plugin docker compose).
```
No es necesario instalar Java, Maven, Node.js, Go o Python en el equipo anfitrión para ejecutar todos los servicios mediante Docker.


## Para desarrollo local
```
Java 17 o superior.

Maven.

Node.js 20 o superior.

npm.

Go.

Python 3.

Docker y Docker Compose.
```


## Arquitectura del sistema

El sistema está dividido en servicios independientes, cada uno responsable de una funcionalidad específica.
```
                         ┌──────────────────┐
                         │     FRONTEND     │
                         │  React + Vite    │
                         └────────┬─────────┘
                                  │
                 ┌────────────────┼─────────────────┐
                 │                │                 │
                 ▼                ▼                 ▼
          ┌────────────┐  ┌────────────┐    ┌────────────┐
          │  REST API  │  │  GraphQL   │    │  Gateway   │
          │ Spring Boot│  │   Node.js   │    │   Node.js  │
          └─────┬──────┘  └─────┬──────┘    └─────┬──────┘
                │               │                 │
                │               │                 ▼
                │               │           ┌───────────┐
                │               │           │ gRPC Go   │
                │               │           └─────┬─────┘
                │               │                 │
                └───────────────┴─────────────────┘
                                │
                                ▼
                         ┌────────────┐
                         │   MySQL    │
                         └────────────┘

                 Flujo de eventos y notificaciones

                         ┌────────────┐
                         │   MySQL    │
                         │ Outbox     │
                         └─────┬──────┘
                               │
                               ▼
                         ┌────────────┐
                         │  Productor │
                         │  Python    │
                         └─────┬──────┘
                               │
                               ▼
                         ┌────────────┐
                         │   Kafka    │
                         └─────┬──────┘
                               │
                               ▼
                         ┌────────────┐
                         │ Consumidor │
                         │  Node.js   │
                         └─────┬──────┘
                               │
                         ┌─────┴──────┐
                         ▼            ▼
                    Persistencia  WebSocket
                    notificaciones
```

### Responsabilidades de los servicios

REST: API principal desarrollada con Spring Boot. Gestiona las operaciones correspondientes a los recursos del sistema y la autenticación.

GraphQL: permite consultar y operar sobre los datos mediante un esquema GraphQL.

gRPC: servicio desarrollado en Go que expone operaciones mediante comunicación gRPC.

Gateway: expone una interfaz HTTP para acceder a las funcionalidades del servicio gRPC.

Productor Kafka: consulta periódicamente la tabla Outbox de MySQL y publica los eventos pendientes en Kafka.

Kafka: intermediario de mensajería que permite desacoplar la generación de eventos de su procesamiento.

Consumidor Kafka: recibe los eventos, procesa las notificaciones y las distribuye a los usuarios mediante WebSocket. También permite consultar las notificaciones persistidas.

Frontend: interfaz de usuario desarrollada con React y TypeScript.

MySQL: almacenamiento persistente compartido por los servicios que lo requieren.


## Estructura del proyecto
```
museo/
├── docker-compose.yml
├── init.sql
├── data.sql
│
├── rest/
│   ├── Dockerfile
│   └── src/
│
├── graphql/
│   ├── Dockerfile
│   └── ...
│
├── grpc/
│   ├── server/
│   │   ├── Dockerfile
│   │   └── ...
│   └── gateway/
│       ├── Dockerfile
│       └── ...
│
├── kafka/
│   ├── producer/
│   │   ├── Dockerfile
│   │   └── ...
│   └── consumer/
│       ├── Dockerfile
│       └── ...
│
└── front/
    ├── Dockerfile
    └── ...


```

Cada servicio dispone de su propio Dockerfile, mientras que Docker Compose coordina la construcción, configuración, redes y ejecución de los contenedores.

## Despliegue completo con Docker

La forma recomendada de ejecutar el sistema es mediante Docker Compose.

 Clonar el repositorio
```
git clone <URL_DEL_REPOSITORIO>
cd museo
```
## Construir e iniciar todos los servicios

Desde la raíz del proyecto ejecutar:
```
docker compose up --build -d
```
Comprobar el estado de los contenedores
```
docker compose ps
```
Para consultar los registros de todos los servicios:
```
docker compose logs -f
```
Para consultar los registros de un servicio específico:
```
docker compose logs -f rest
docker compose logs -f producer
docker compose logs -f consumer
```

Comprobar el estado de los contenedores
```
docker compose ps
```
Para consultar los registros de todos los servicios:
```
docker compose logs -f
```
Para consultar los registros de un servicio específico:
```
docker compose logs -f rest
docker compose logs -f producer
docker compose logs -f consumer
```
## Acceso a los servicios
```
Servicio

Dirección

Frontend

http://localhost:5173

REST API

http://localhost:8080

Swagger UI

http://localhost:8080/swagger-ui/index.html

GraphQL

http://localhost:4000/graphql

Gateway gRPC

http://localhost:3000

Consumidor / WebSocket

Puerto 3100
```


### Swagger / OpenAPI

La API REST cuenta con documentación mediante 
Swagger UI. 
Disponible en:
```text
http://localhost:8080/swagger-ui/index.html
```

### Esquema con GraphiQL
Se encuentra habilitado para consultar y explorar el esquema GraphQL.

Disponible en:
```text
http://localhost:4000/graphql
```

## Backend Kafka
```text
Ingresar a `kafka/consumer`:

cd kafka/consumer

Instalar dependencias:

npm install

Ejecutar consumidor:

node index.js

En otra terminal ingresar a `kafka/producer`:
cd kafka/producer

Crear y activar entorno virtual:
python -m venv venv
.\venv\Scripts\activate
source venv/bin/activate <-- linux

Instalar dependencias:
pip install -r requirements.txt

Ejecutar productor:
python producer.py
```
## Backend gRPC
```text
Ingresar a `grpc/server`:

cd grpc/server

Instalar dependencias:

go mod tidy

Ejecutar:

go run .

En otra terminal ingresar a `grpc/gateway`:

cd grpc/gateway

Instalar dependencias:

npm install

Ejecutar:

npm start

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

### Usuarios de prueba
```text 
admin@admin.com
admin

curador@curador.com
curador

------- visitantes  ---------- 

martin@gmail.com 
martin

ana@gmail.com
ana

carlos@carlos.com
carlos
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

