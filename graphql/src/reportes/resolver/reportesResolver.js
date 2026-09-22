import { generarReporteAsistencia, listarTiposEvento} from "../service/reporteService.js";
export const reportesResolvers = {
  reporteAsistencia: async ({ filtros }, context) => {
    if (!context.user) {
        throw new Error("No autenticado");
    }

    if (
        context.user.rol !== "CURADOR" &&
        context.user.rol !== "ADMINISTRADOR"
    ) {
        throw new Error("No tiene permisos para consultar reportes");
    }
    const reporte = await generarReporteAsistencia(filtros, context.db);

    return reporte;
  },
  obtenerTiposEvento: async (_, context) => {
    return await listarTiposEvento(context.db);
  }
};