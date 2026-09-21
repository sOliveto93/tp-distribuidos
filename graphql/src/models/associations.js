import Usuario from "./usuario.js";
import Artista from "./artista.js";
import Obra from "./obra.js";
import Comentario from "./comentario.js";
import Evento from "./evento.js";
import FiltrosFavoritos from "./filtrosFavoritos.js";

// Artista -> Obras
Artista.hasMany(Obra, {
    foreignKey: "id_artista",
    as: "obras"
});

Obra.belongsTo(Artista, {
    foreignKey: "id_artista",
    as: "artista"
});

// Usuario -> Comentarios
Usuario.hasMany(Comentario, {
    foreignKey: "id_usuario"
    ,as: "comentarios"
});

Comentario.belongsTo(Usuario, {
    foreignKey: "id_usuario",
    as: "usuario"
});

// Obra -> Comentarios
Obra.hasMany(Comentario, {
    foreignKey: "id_obra",
    as: "comentarios"
});

Comentario.belongsTo(Obra, {
    foreignKey: "id_obra",
    as: "obra"
});

// Usuario -> Filtros favoritos
Usuario.hasMany(FiltrosFavoritos, {
    foreignKey: "id_usuario"
});

FiltrosFavoritos.belongsTo(Usuario, {
    foreignKey: "id_usuario"
});

// Usuario -> Eventos
Usuario.belongsToMany(Evento, {
    through: "evento_usuario",
    foreignKey: "id_usuario",
    otherKey: "id_evento"
});

Evento.belongsToMany(Usuario, {
    through: "evento_usuario",
    foreignKey: "id_evento",
    otherKey: "id_usuario"
});

// Obra -> Eventos
Obra.belongsToMany(Evento, {
    through: "evento_obra",
    foreignKey: "id_obra",
    otherKey: "id_evento"
});

Evento.belongsToMany(Obra, {
    through: "evento_obra",
    foreignKey: "id_evento",
    otherKey: "id_obra"
});

// Evento -> Curador
Usuario.hasMany(Evento, {
    foreignKey: "id_curador"
});

Evento.belongsTo(Usuario, {
    foreignKey: "id_curador",
    as: "curador"
});

export {
    Usuario,
    Artista,
    Obra,
    Comentario,
    Evento,
    FiltrosFavoritos
};