import { Schema, model } from "mongoose";
import { IPrestadorDocument } from "../interfaces/IPrestador";
import { Especialidad } from "../enums/Especialidad";
import { Localidad } from "../enums/Localidad";

const LugarAtencionSchema = new Schema(
  {
    nombre: { type: String, default: "" },
    localidad: { type: String, enum: Object.values(Localidad), required: true },
    calle: { type: String, required: true },
    numero: { type: String, required: true },
    telefono: { type: String, required: true },
  },
  { _id: false }
);

// Esquema principal del prestador
const PrestadorSchema = new Schema<IPrestadorDocument>(
  {
    nombre: { type: String, required: true },
    especialidad: {
      type: String,
      //enum: Object.values(Especialidad), Se cambió este enum por que solo sea String y requerido. La obtención de las especialidades ahora viene por un mapeo de los prestadores.
      required: true,
    },
    lugarAtencion: { type: LugarAtencionSchema, required: true }, // solo 1 lugar
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

/*import { Schema, model } from "mongoose";
import { IPrestadorDocument } from "../interfaces/IPrestador";
//falta cambiar localidad y especialidad por enum
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
);*/
