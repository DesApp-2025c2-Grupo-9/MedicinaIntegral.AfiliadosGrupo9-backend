import { z } from "zod";

export const observacionRecetaSchema = z.object({
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  fecha: z.date().optional(),
  rolEmisor: z.string().optional(),
  idEmisor: z.string().optional(),
});

export const recetaSchema = z.object({
  nroAfiliado: z
    .string()
    .regex(
      /^\d{6}-\d{2}$/,
      "El número de afiliado debe tener el formato 000001-02"
    ),
  paraAfiliado: z.string().min(1, "El nombre del afiliado es obligatorio"),
  idAfiliado: z.string().min(1, "El id del afiliado es obligatorio"),
  medicamento: z
    .string()
    .min(4, "El nombre del medicamento debe tener al menos 4 caracteres"),
  cantidad: z.number().positive("La cantidad debe ser positiva"),
  presentacion: z
    .string()
    .min(3, "La presentación debe tener al menos 3 caracteres")
    .regex(/^[^0-9]*$/, "La presentación no debe contener números"),
  observaciones: z.array(observacionRecetaSchema).optional(),
  estado: z.enum([
    "pendiente",
    "aceptado",
    "rechazado",
    "observado",
    "en analisis",
  ]),
  fechaBaja: z.date().optional(),
});
