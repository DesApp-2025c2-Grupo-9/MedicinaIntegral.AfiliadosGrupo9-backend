import { Schema, model, Document } from "mongoose";
import { EstadoTramite } from "../enums/EstadoTramite";

export interface ISolicitudReceta extends Document {
  afiliadoId: Schema.Types.ObjectId; // clave foránea a Afiliado
  integranteCredencial: string;
  medicamento: string;
  cantidad: number;
  presentacion: string;
  observaciones?: string;
  estado: EstadoTramite;
}

const solicitudRecetaSchema = new Schema<ISolicitudReceta>(
  {
    afiliadoId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Afiliado", // referencia al modelo Afiliado
    },
    integranteCredencial: { type: String, required: true },
    medicamento: { type: String, required: true },
    cantidad: { type: Number, required: true },
    presentacion: { type: String, required: true },
    observaciones: { type: String },
    estado: {
      type: String,
      enum: Object.values(EstadoTramite),
      default: EstadoTramite.PENDIENTE,
    },
  },
  { timestamps: true }
);

export default model<ISolicitudReceta>(
  "SolicitudReceta",
  solicitudRecetaSchema
);
