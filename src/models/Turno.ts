import { Schema, model, Document } from "mongoose";

export interface ITurno extends Document {
  afiliadoId: Schema.Types.ObjectId; // referencia al Afiliado
  prestadorId: Schema.Types.ObjectId; // referencia al Prestador
  especialidad: string;
  lugarAtencion: string;
  fechaTurno: Date;
  estado: "disponible" | "reservado" | "cancelado" | "asistido" | "noAsistido";
}

const turnoSchema = new Schema<ITurno>(
  {
    afiliadoId: {
      type: Schema.Types.ObjectId,
      ref: "Afiliado",
      required: true,
    },
    prestadorId: {
      type: Schema.Types.ObjectId,
      ref: "Prestador",
      required: true,
    },
    especialidad: { type: String, required: true },
    lugarAtencion: { type: String, required: true },
    fechaTurno: { type: Date, required: true },
    estado: {
      type: String,
      enum: ["disponible", "reservado", "cancelado", "asistido", "noAsistido"],
      default: "disponible",
    },
  },
  { timestamps: true }
);

export default model<ITurno>("Turno", turnoSchema);
