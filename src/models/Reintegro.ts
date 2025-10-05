import { Schema, model } from "mongoose";
import { IReintegroDocument } from "../interfaces/IReintegro";
import { EstadoTramite } from "../enums/EstadoTramite";
import { FormaPago } from "../enums/FormaPago";

const reintegroSchema = new Schema<IReintegroDocument>(
  {
    nroAfiliado: {
      type: String,
      required: true,
      ref: "Afiliado", // referencia al  Afiliado que lo solicita
    },
    fechaPrestacion: { type: String, required: true },

    medico: { type: String, required: true },
    especialidad: { type: String, required: true },
    lugarAtencion: { type: String, required: true },
    factura: {
      fecha: { type: String, required: true },
      cuit: {
        type: String,
        required: function () {
          //requerido solo para transferencia
          return this.formaPago === FormaPago.TRANSFERENCIA;
        },
      },
      valorTotal: { type: Number, required: true },
      personaAFacturar: {
        //ver si lo vamos a relacionar con un afiliado o no
        type: Schema.Types.String,
        ref: "Afiliado",
        required: true,
      },
    },
    formaPago: {
      type: String,
      enum: Object.values(FormaPago),
      default: FormaPago.TRANSFERENCIA,
    },
    observaciones: { type: String },
    estado: {
      type: String,
      enum: Object.values(EstadoTramite),
      default: EstadoTramite.PENDIENTE,
    },
  },
  { timestamps: true }
);

export default model<IReintegroDocument>("Reintegro", reintegroSchema);
