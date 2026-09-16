import { generarReporteAsistencia, listarTiposEvento} from "../service/reporteService.js";
export const reportesResolvers = {
  reporteAsistencia: async ({ filtros }, context) => {

    // if (context.usuario.rol !== 'CURADOR' && context.usuario.rol !== 'ADMINISTRADOR') throw new Error("No autorizado");

    const reporte = await generarReporteAsistencia(filtros, context.db);

    return reporte;
  },
  obtenerTiposEvento: async (_, context) => {
    return await listarTiposEvento(context.db);
  }
};