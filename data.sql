USE museo;

-- =========================================================
-- ARTISTAS
-- =========================================================

INSERT INTO artistas (id, nombre, biografia) VALUES
(1, 'Vincent van Gogh', 'Pintor neerlandés del postimpresionismo.'),
(2, 'Leonardo da Vinci', 'Artista e inventor italiano del Renacimiento.'),
(3, 'Pablo Picasso', 'Pintor y escultor español, figura central del cubismo.'),
(4, 'Claude Monet', 'Pintor francés fundador del impresionismo.');


-- =========================================================
-- USUARIOS
-- =========================================================

INSERT INTO usuarios (id, nombre, email, contrasenia, rol) VALUES
(1, 'Sebastian Oliveto', 'sebas@museo.com', '123456', 'ADMINISTRADOR'),
(2, 'Laura Gomez', 'laura@museo.com', '123456', 'CURADOR'),
(3, 'Martin Perez', 'martin@gmail.com', '123456', 'VISITANTE'),
(4, 'Ana Rodriguez', 'ana@gmail.com', '123456', 'VISITANTE'),
(5, 'Carlos Fernandez', 'carlos@gmail.com', '123456', 'VISITANTE');


-- =========================================================
-- OBRAS
-- =========================================================

INSERT INTO obras
(id, titulo, descripcion, anio_creacion, epoca, tecnica, ubicacion, disponible, imagen_url, dimensiones, id_artista)
VALUES
(1, 'La noche estrellada',
 'Paisaje nocturno pintado desde la ventana del asilo de Saint-Remy.',
 '1889-06-01',
 'Postimpresionismo',
 'Óleo sobre lienzo',
 'Sala 1',
 1,
 'https://example.com/noche-estrellada.jpg',
 '73.7 x 92.1 cm',
 1),

(2, 'La Gioconda',
 'Retrato de Lisa Gherardini realizado durante el Renacimiento.',
 '1503-01-01',
 'Renacimiento',
 'Óleo sobre tabla',
 'Sala 2',
 1,
 'https://example.com/gioconda.jpg',
 '77 x 53 cm',
 2),

(3, 'La última cena',
 'Pintura mural que representa la última cena de Jesús con sus apóstoles.',
 '1498-01-01',
 'Renacimiento',
 'Temple y óleo sobre yeso',
 'Sala 2',
 0,
 'https://example.com/ultima-cena.jpg',
 '460 x 880 cm',
 2),

(4, 'Guernica',
 'Obra que representa los horrores de la guerra y el bombardeo de Guernica.',
 '1937-01-01',
 'Cubismo',
 'Óleo sobre lienzo',
 'Sala 3',
 1,
 'https://example.com/guernica.jpg',
 '349 x 777 cm',
 3),

(5, 'Impresión, sol naciente',
 'Obra que dio nombre al movimiento impresionista.',
 '1872-01-01',
 'Impresionismo',
 'Óleo sobre lienzo',
 'Sala 4',
 1,
 'https://example.com/impresion-sol.jpg',
 '48 x 63 cm',
 4),

(6, 'Los girasoles',
 'Serie de pinturas de girasoles realizada durante el período de Arlés.',
 '1888-01-01',
 'Postimpresionismo',
 'Óleo sobre lienzo',
 'Sala 1',
 1,
 'https://example.com/girasoles.jpg',
 '92 x 73 cm',
 1);


-- =========================================================
-- EVENTOS
-- =========================================================

INSERT INTO eventos
(id, titulo, descripcion, fecha_hora, duracion, tipo, cupo_max, id_curador)
VALUES
(1,
 'Recorrido por el Renacimiento',
 'Visita guiada por las principales obras del Renacimiento.',
 '2026-09-20 15:00:00',
 90,
 'VISITA_GUIADA',
 30,
 2),

(2,
 'Introducción al Impresionismo',
 'Charla introductoria sobre el movimiento impresionista.',
 '2026-09-25 18:00:00',
 60,
 'CHARLA',
 50,
 2),

(3,
 'Arte y guerra',
 'Análisis de obras relacionadas con conflictos bélicos.',
 '2026-10-05 16:00:00',
 120,
 'EXPOSICION',
 40,
 2);


-- =========================================================
-- EVENTO_OBRA
-- =========================================================

INSERT INTO evento_obra (id, id_evento, id_obra) VALUES
(1, 1, 2),
(2, 1, 3),
(3, 2, 5),
(4, 3, 4),
(5, 3, 1);


-- =========================================================
-- EVENTO_USUARIO
-- =========================================================

INSERT INTO evento_usuario (id, id_evento, id_usuario) VALUES
(1, 1, 3),
(2, 1, 4),
(3, 1, 5),
(4, 2, 3),
(5, 2, 4),
(6, 3, 5);


-- =========================================================
-- COMENTARIOS
-- =========================================================

INSERT INTO comentarios
(id, fecha, texto, id_usuario, id_obra)
VALUES
(1, '2026-09-10', 'Una de mis obras favoritas.', 3, 1),
(2, '2026-09-10', 'La técnica utilizada es impresionante.', 4, 1),
(3, '2026-09-11', 'Una obra fundamental del Renacimiento.', 3, 2),
(4, '2026-09-11', 'El tamaño de esta obra es impresionante.', 5, 4),
(5, '2026-09-11', 'Me encanta el uso de la luz.', 4, 5),
(6, '2026-09-11', 'Muy interesante la historia detrás de esta pintura.', 3, 6);


-- =========================================================
-- FILTROS FAVORITOS
-- =========================================================

INSERT INTO filtros_favoritos
(id, nombre, descripcion, configuracion_filtros, id_usuario)
VALUES
(1,
 'Renacimiento',
 'Obras del Renacimiento',
 '{"epoca":"Renacimiento"}',
 3),

(2,
 'Obras disponibles',
 'Obras actualmente disponibles',
 '{"disponible":true}',
 3),

(3,
 'Impresionismo',
 'Obras relacionadas con el impresionismo',
 '{"epoca":"Impresionismo","tecnica":"Óleo sobre lienzo"}',
 4),

(4,
 'Postimpresionismo',
 'Obras de Van Gogh',
 '{"artista":"Vincent van Gogh","epoca":"Postimpresionismo"}',
 5);