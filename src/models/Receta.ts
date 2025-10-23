import { Schema, model, Types } from "mongoose";
import { EstadoTramite } from "../enums/EstadoTramite";
import { IReceta } from "../interfaces/IReceta";

export interface IRecetaDocument extends Omit<IReceta, "id">, Document {
  _id: Types.ObjectId;
}

const recetaSchema = new Schema<IRecetaDocument>(
  {
    nroAfiliado: {
      type: String,
      required: true,
      //ref: "Afiliado",
    },

    medicamento: { type: String, required: true },
    cantidad: { type: Number, required: true },
    presentacion: { type: String, required: true },
    observaciones: {
      type: [
        {
          emisor: { type: Schema.Types.ObjectId, ref: "Afiliado" },
          descripcion: { type: String },
          fecha: { type: Date, default: Date.now },
        },
        {
          emisor: { type: Schema.Types.ObjectId, ref: "Prestador" },
          descripcion: { type: String },
          fecha: { type: Date, default: Date.now },
        },
      ],
    },
    estado: {
      type: String,
      enum: Object.values(EstadoTramite),
      default: EstadoTramite.PENDIENTE,
    },
    idAfiliado: {
      type: Schema.Types.ObjectId,
      ref: "Afiliado",
      //required: true,
    },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model<IRecetaDocument>("Receta", recetaSchema);
