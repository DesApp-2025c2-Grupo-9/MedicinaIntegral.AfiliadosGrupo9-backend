import { Schema, model } from "mongoose";
import { ITurnoDocument } from "../interfaces/ITurno";
import { EstadoTurno } from "../enums/EstadoTurno";

const turnoSchema = new Schema<ITurnoDocument>(
  {
    idAfiliado: {
      type: Schema.Types.ObjectId,
      ref: "Afiliado",
      required: false,
    },
    nroAfiliado: { type: String, required: false },
    prestador: {
      type: Schema.Types.ObjectId,
      ref: "Prestador",
      required: true,
    },
    especialidad: { type: String, required: true },
    lugarAtencion: { type: String, required: true },
    telefono: { type: Number, required: true },
    fechaTurno: { type: Date, required: true },
    estado: {
      type: String,
      enum: EstadoTurno,
      default: EstadoTurno.DISPONIBLE,
    },
  },
  { timestamps: true }
);

export default model<ITurnoDocument>("Turno", turnoSchema);
