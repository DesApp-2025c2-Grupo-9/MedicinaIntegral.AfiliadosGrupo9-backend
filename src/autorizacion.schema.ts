import { z } from "zod";
import { EstadoTramite } from "../enums/EstadoTramite";

//validacion para una observacion

export const observacionSchema = z.object({
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  fecha: z.date().optional(),
  rolEmisor: z.string().optional(),
  idEmisor: z.string().optional(),
}); //chequear

//validacion para una autorizacion

export const autorizacionSchema = z.object({
  idAfiliado: z.string().min(1, "El id del afiliado es obligatorio"),
  paraAfiliado: z.string().min(1, "El nombre del afiliado es obligatorio"),
  nroAfilado: z.string().optional(), //chequear
  fechaSolicitud: z.string().optional(),
  practica: z.string().min(1, "La práctica es obligatoria"),
  especialidad: z.string().min(1, "La especialidad es obligatoria"),
  medicoSolicitante: z.string().min(1, "El médico solicitante es obligatorio"),
  lugarAtencion: z.string().min(1, "El lugar de atención es obligatorio"),
  diagnostico: z.string().optional(),
  observaciones: z.array(observacionShema).optional(),
  diasDeInternacion: z.number().min(0, "Debe ser un número positivo"),
  estado: z.nativeEnum(EstadoTramite), //chequear 
  fechaBaja: z.date().optional(),
});
