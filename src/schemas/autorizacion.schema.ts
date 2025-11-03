import { z } from "zod";
import { estadoTramiteSchema } from "../schemas/estados.autorizacion.schema";

//validacion para observaciones

const observacionSchema = z.object({
    idEmisor: z.string().regex(/^[0-9a-fA-F]{24}$/),
    rolEmisor: z.string(),
    descripcion: z.string().optional(),
    fecha: z.date().optional(),
});



//validacion de autorizacion

export const autorizacionSchema = z.object ({
    idAfiliado: z.string().regex(/^[0-9a-fA-F]{24}$/),
    fechaSolicitud: z.date(),
    practica: z.any().refine(val => typeof val === 'string', {
    message: 'Debe ser un texto',
    }),
    especialidad: z.string(),
    medicoSolicitante: z.string(),
    lugarAtencion: z.string(),
    observaciones: z.string().optional(),
    diasDeInternacion: z.number().int().nonnegative(),
});