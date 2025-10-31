import { z } from "zod";
import { EstadoTramite } from "../enums/EstadoTramite";

//validacion para una observacion
export const observacionSchema = z.object({
  descripcion: z.string().min81, "La descripción es obligatoria"),
  fecha: z.date().optional(),
  rolEmisor: z.string().optional(),
  rolEmisor: z.string().optional(),
  idEmisor: z.string().optional(),
  });

//validacion para una receta
export const recetaSchema = z.object({
  nroAfilidado: z.string().min(1, "El número de afiliado es obligatorio"),
  paraAfilidado: z.string().min(1, "El nombre del afiliado es obligatorio"),
  medicamento: z.string().min(1, "El medicamento es obligatorio).max(50),
  cantidad: z.number().min(1, "Debe ser al menos 1").max(10, "Máximo 10 unidades"),
  presentacion: z.string().min(1, "La presentación es obligatoria").max(50),
  observaciones: z.array(observacionSchema).optional(),
  estado: z.nativeEnum(EstadoTramite, {  //chequear
    errorMap: () => ({ message: "Estado inválido" }),
  }),
  idAfiliado: z.string().min(1, "El ID del afiliado es obligatorio"),
  fechaBaja: z.date().optional(),
});

                              
