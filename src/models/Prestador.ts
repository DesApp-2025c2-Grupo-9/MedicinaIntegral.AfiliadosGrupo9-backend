import { Schema, model, Document } from "mongoose";

export interface IPrestador extends Document {
  nombre: string;
  especialidad: string[]; //puede tener varias especialidades
  lugarAtencion: string[]; //puede atender en varios lugares
}

const prestadorSchema = new Schema<IPrestador>(
  {
    nombre: { type: String, required: true },
    especialidad: { type: [String], required: true },
    lugarAtencion: { type: [String], required: true },
  },
  { timestamps: true }
);

export default model<IPrestador>("Prestador", prestadorSchema);
