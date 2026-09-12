-- museo.artistas definition

CREATE TABLE `artistas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `biografia` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- museo.usuarios definition

CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasenia` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `rol` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- museo.eventos definition

CREATE TABLE `eventos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) NOT NULL,
  `descripcion` text,
  `fecha_hora` datetime NOT NULL,
  `duracion` int NOT NULL,
  `tipo` varchar(100) NOT NULL,
  `cupo_max` int NOT NULL,
  `id_curador` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `eventos_usuarios_FK` (`id_curador`),
  CONSTRAINT `eventos_usuarios_FK` FOREIGN KEY (`id_curador`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- museo.evento_usuario definition

CREATE TABLE `evento_usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_evento` int NOT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `eventos_usuarios_usuarios_FK` (`id_usuario`),
  KEY `eventos_usuarios_eventos_FK` (`id_evento`),
  CONSTRAINT `eventos_usuarios_eventos_FK` FOREIGN KEY (`id_evento`) REFERENCES `eventos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `eventos_usuarios_usuarios_FK` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- museo.filtros_favoritos definition

CREATE TABLE `filtros_favoritos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(100) DEFAULT NULL,
  `configuracion_filtros` json NOT NULL,
  `id_usuario` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `filtros_favoritos_usuarios_FK` (`id_usuario`),
  CONSTRAINT `filtros_favoritos_usuarios_FK` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- museo.obras definition

CREATE TABLE `obras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titulo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `descripcion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `anio_creacion` date NOT NULL,
  `epoca` varchar(100) NOT NULL,
  `tecnica` varchar(100) NOT NULL,
  `ubicacion` varchar(100) NOT NULL,
  `disponible` tinyint(1) NOT NULL,
  `imagen_url` varchar(250) NOT NULL,
  `dimensiones` varchar(100) NOT NULL,
  `id_artista` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `obra_artistas_FK` (`id_artista`),
  CONSTRAINT `obra_artistas_FK` FOREIGN KEY (`id_artista`) REFERENCES `artistas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- museo.comentarios definition

CREATE TABLE `comentarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `texto` text NOT NULL,
  `id_usuario` int NOT NULL,
  `id_obra` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `comentarios_usuarios_FK` (`id_usuario`),
  KEY `comentarios_obra_FK` (`id_obra`),
  CONSTRAINT `comentarios_obra_FK` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comentarios_usuarios_FK` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- museo.evento_obra definition

CREATE TABLE `evento_obra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_obra` int NOT NULL,
  `id_evento` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `evento_obra_eventos_FK` (`id_evento`),
  KEY `evento_obra_obra_FK` (`id_obra`),
  CONSTRAINT `evento_obra_eventos_FK` FOREIGN KEY (`id_evento`) REFERENCES `eventos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `evento_obra_obra_FK` FOREIGN KEY (`id_obra`) REFERENCES `obras` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;