
# Etapa de compilación
FROM golang:1.27.2-alpine AS build

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o server .

# Etapa de ejecución
FROM alpine:3.22

WORKDIR /app

COPY --from=build /app/server .

EXPOSE 50051

ENTRYPOINT ["./server"]
