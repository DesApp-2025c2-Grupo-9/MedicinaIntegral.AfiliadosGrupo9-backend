import { Schema, model, Document } from "mongoose";
import { EstadoTramite } from "./EstadoTramite";

export interface IAutorizacion extends Document {
  afiliadoId: Schema.Types.ObjectId; // referencia al Afiliado
  integranteCredencial: string; // número de credencial del integrante del que se pide
  fechaSolicitud: Date;
  practica: string;
  especialidad: string;
  medicoSolicitante: string;
  lugarAtencion: string;
  diagnostico?: string;
  observaciones?: string;
  estado: EstadoTramite;
}

const autorizacionSchema = new Schema<IAutorizacion>(
  {
    afiliadoId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Afiliado",
    },
    integranteCredencial: { type: String, required: true },
    fechaSolicitud: { type: Date, required: true, default: Date.now },
    practica: { type: String, required: true },
    especialidad: { type: String, required: true },
    medicoSolicitante: { type: String, required: true },
    lugarAtencion: { type: String, required: true },
    diagnostico: { type: String },
    observaciones: { type: String },
    estado: {
      type: String,
      enum: Object.values(EstadoTramite),
      default: EstadoTramite.PENDIENTE,
    },
  },
  { timestamps: true }
);

export default model<IAutorizacion>("Autorizacion", autorizacionSchema);
