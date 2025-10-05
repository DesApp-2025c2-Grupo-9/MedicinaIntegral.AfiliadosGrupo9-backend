import { Schema, model } from "mongoose";
import { IPrestadorDocument } from "../interfaces/IPrestador";

const prestadorSchema = new Schema<IPrestadorDocument>(
  {
    nombre: { type: String, required: true },
    especialidad: { type: [String], required: true },
    lugarAtencion: { type: [String], required: true },
  },
  { timestamps: true }
);

export default model<IPrestadorDocument>("Prestador", prestadorSchema, "Prestadores");
