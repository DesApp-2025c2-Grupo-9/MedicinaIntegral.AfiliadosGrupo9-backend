import { Schema, model } from "mongoose";
import { IPrestadorDocument } from "../interfaces/IPrestador";

const LugarAtencionSchema = new Schema(
  {
    nombre: { type: String, required: true },
    localidad: { type: String, required: true },
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    telefono: { type: String, required: true },
  },
  { _id: false } // evita generar _id para cada lugarAtencion
);

const PrestadorSchema = new Schema<IPrestadorDocument>(
  {
    nombre: { type: String, required: true },
    especialidad: [{ type: String, required: true }],
    lugarAtencion: [LugarAtencionSchema],
  },
  { timestamps: true }
);

export const Prestador = model<IPrestadorDocument>(
  "Prestador",
  PrestadorSchema
);
export default model<IPrestadorDocument>(
  "Prestador",
  PrestadorSchema,
  "Prestadores"
);
