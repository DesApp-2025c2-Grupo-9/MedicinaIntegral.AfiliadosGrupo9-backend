import { z } from "zod";
import {EstadoTramite } from "../enums/EstadoTramite";
import { Especialidad } from "../enums/Especialidad";
import { FormaPago } from "../enums/FormaPago";

//validacion para observaciones

export const observacionSchema = z.object({
  descripcion: z.string().min(1, "La descripción es obligatoria");
  fecha: z.date().optional(),
  rolEmisor: z.string().optional(),
  idEmisor: z.string().optional(),
});


// Validación para factura
export const facturaSchema = z.object({
  fecha: z.coerce.date({ invalid_type_error: "Fecha inválida" }),
  cuit: z.string().regex(/^\d{11}$/, "CUIT inválido (debe tener 11 dígitos)"),
  valorTotal: z.number().min(1, "El valor debe ser mayor a 0"),
  personaAFacturar: z.string().min(1, "Debe indicar a quién se factura"),
});


// Validación para reintegro
export const reintegroSchema = z.object({
  paraAfiliado: z.string().min(1, "El nombre del afiliado es obligatorio"),
  fechaDePrestacion: z.coerce.date({ invalid_type_error: "Fecha inválida" }),
  especialidad: z.nativeEnum(Especialidad, {
    errorMap: () => ({ message: "Especialidad inválida" }),
  }),
  medico: z.string().min(1, "El nombre del médico es obligatorio"),
  lugarDeAtencion: z.string().min(1, "El lugar de atención es obligatorio"),
  factura: facturaSchema,
  formaDePago: z.nativeEnum(FormaPago, {
    errorMap: () => ({ message: "Forma de pago inválida" }),
  }),
  cbu: z.string().optional().refine((val, ctx) => {
    const formaPago = ctx.parent.formaDePago;
    if (formaPago === "transferencia" && (!val || val.length < 22)) {
      return false;
    }
    return true;
  }, {
    message: "El CBU es obligatorio y debe tener al menos 22 caracteres si la forma de pago es transferencia",
  }),
  observaciones: z.array(observacionSchema).optional(),
  estado: z.nativeEnum(EstadoTramite, {
    errorMap: () => ({ message: "Estado inválido" }),
  }),
  idAfiliado: z.string().min(1, "El ID del afiliado es obligatorio"),
  fechaBaja: z.date().optional(),
  nroGestion: z.number().int().min(1, "El número de gestión debe ser mayor a 0"),
});

