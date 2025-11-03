import { EstadoTramite } from "../enums/EstadoTramite";
import { z } from "zod";

export const estadoTramiteSchema = z.enum([
  EstadoTramite.PENDIENTE,
  EstadoTramite.ACEPTADO,
  EstadoTramite.RECHAZADO,
  EstadoTramite.EN_ANALISIS,
  EstadoTramite.OBSERVADO
]);