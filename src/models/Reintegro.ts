import { Schema, Document, model } from "mongoose";
import IReintegro from "../interfaces/IReintegro";
import { FormaPago } from "../enums/FormaPago";
import { EstadoTramite } from "../enums/EstadoTramite";

interface IReintegroDocument extends IReintegro, Document {}

const reintegroSchema = new Schema<IReintegroDocument>(
  {
    paraAfiliado: {
      type: String,
      required: true,
    },
    fechaDePrestacion: {
      type: Date,
      required: true,
    },
    medico: {
      type: String,
      required: true,
    },
    especialidad: {
      type: String,
      required: true,
    },
    lugarDeAtencion: {
      type: String,
      required: true,
    },
    factura: {
      type: {
        fecha: {
          type: Date,
          required: true,
        },
        cuit: {
          type: String,
          required: true,
        },
        valorTotal: {
          type: Number,
          required: true,
        },
        personaAFacturar: {
          type: String,
          required: true,
        },
      },
      required: true,
    },
    formaDePago: {
      type: String,
      enum: Object.values(FormaPago),
      required: true,
    },
    cbu: {
      type: String,
      required: function () {
        return this.formaDePago === FormaPago.TRANSFERENCIA;
      },
    },
    observaciones: String,
    estado: {
      type: String,
      enum: Object.values(EstadoTramite),
      required: true,
      default: EstadoTramite.PENDIENTE,
    },
  },
  { timestamps: true }
);

/* const reintegroSchema = new Schema<IReintegroDocument>(
  {
    nroAfiliado: {
      type: String,
      required: true,
      ref: 'Afiliado' // referencia al  Afiliado que lo solicita
    },
    fechaPrestacion: { type: Date, required: true },

    medico: { type: String, required: true },
    especialidad: { type: String, required: true },
    lugarAtencion: { type: String, required: true },
    factura: {
      fecha: { type: Date, required: true },
      cuit: {
        type: String,
        required: function () {
          //requerido solo para transferencia
          return this.formaPago === FormaDePago.TRANSFERENCIA;
        }
      },
      valorTotal: { type: Number, required: true },
      personaAFacturar: {
        //ver si lo vamos a relacionar con un afiliado o no
        type: Schema.Types.String,
        ref: 'Afiliado',
        required: true
      }
    },
    formaPago: {
      type: String,
      enum: Object.values(FormaDePago),
      default: FormaDePago.TRANSFERENCIA
    },
    observaciones: { type: String },
    estado: {
      type: String,
      enum: Object.values(EstadoTramite),
      default: EstadoTramite.PENDIENTE
    }
  },
  { timestamps: true }
); */

export default model<IReintegroDocument>("Reintegro", reintegroSchema);
