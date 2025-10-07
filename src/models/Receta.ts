import { Schema, model } from "mongoose";
import { EstadoTramite } from "../enums/EstadoTramite";
import { IRecetaDocument } from "../interfaces/IReceta";

const recetaSchema = new Schema<IRecetaDocument>(
  {
    nroAfiliado: {
      type: String,
      required: true,
      ref: "Afiliado", // referencia al modelo Afiliado
    },

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

export default model<IRecetaDocument>("Receta", recetaSchema);
