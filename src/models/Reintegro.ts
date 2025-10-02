import { Schema, model, Document } from "mongoose";
import { EstadoTramite } from "../enums/EstadoTramite";

export interface IReintegro extends Document {
  afiliadoId: Schema.Types.ObjectId; // clave foránea a Afiliado
  fechaPrestacion: Date;
  integranteCredencial: string;
  medicoId: string;
  especialidad: string;
  lugarAtencion: string;
  factura: {
    fecha: Date;
    CUIT: string;
    valorTotal: number;
    personaAFacturar: string;
  };
  formaPago: string;
  observaciones?: string;
  estado: EstadoTramite;
}

const reintegroSchema = new Schema<IReintegro>(
  {
    afiliadoId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Afiliado", // referencia al modelo Afiliado
    },
    fechaPrestacion: { type: Date, required: true },
    integranteCredencial: { type: String, required: true },
    medicoId: { type: String, required: true },
    especialidad: { type: String, required: true },
    lugarAtencion: { type: String, required: true },
    factura: {
      fecha: { type: Date, required: true },
      CUIT: { type: String, required: true },
      valorTotal: { type: Number, required: true },
      personaAFacturar: { type: String, required: true },
    },
    formaPago: { type: String, required: true },
    observaciones: { type: String },
    estado: {
      type: String,
      enum: Object.values(EstadoTramite),
      default: EstadoTramite.PENDIENTE,
    },
  },
  { timestamps: true }
);

export default model<IReintegro>("Reintegro", reintegroSchema);
