import { Schema, model, Types } from "mongoose";
import { EstadoTramite } from "../enums/EstadoTramite";
import  IAutorizacion  from '../interfaces/IAutorizacion';

export interface IAutorizacionDocument extends Omit<IAutorizacion, 'id'>, Document {
  _id: Types.ObjectId;
}

const autorizacionSchema = new Schema<IAutorizacionDocument>(
  {
    nroAfiliado: {
      type: String,
      required: true,
      ref: "Afiliado",
    },

    fechaSolicitud: { type: Date, required: true, default: Date.now },
    practica: { type: String, required: true },
    especialidad: { type: String, required: true },
    medicoSolicitante: { type: String, required: true },
    lugarAtencion: { type: String, required: true },
    diagnostico: { type: String },
    observaciones: { type: String },
    diasDeInternacion: { type: Number, required: true },
    estado: {
      type: String,
      enum: Object.values(EstadoTramite),
      default: EstadoTramite.PENDIENTE,
    },
  },
  { timestamps: true }
);

export default model<IAutorizacionDocument>(
  "Autorizacion",
  autorizacionSchema,
  "Autorizaciones"
);
