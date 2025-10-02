import { Schema, model, Document } from "mongoose";

export interface IAfiliado extends Document {
  afiliadoId: string; // Ej: "0000001-01"
  grupoFamiliar: string; // Ej: "0000001"
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  tipoDocumento: "dni" | "pasaporte" | "ci";
  nroDocumento: string;
  email: string;
  telefono?: string;
  direccion?: string;
  parentesco: "Titular" | "Cónyuge" | "Hijo" | "Otro";
  password: string;
  fechaAlta: Date;
  estado: "Activo" | "Inactivo";
  situacionTerapeutica: string;
  planMedico: "100" | "200" | "300" | "400";
  cbu?: string;
}

const afiliadoSchema = new Schema<IAfiliado>(
  {
    afiliadoId: { type: String, required: true, unique: true },
    grupoFamiliar: { type: String, required: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    tipoDocumento: {
      type: String,
      enum: ["dni", "pasaporte", "ci"],
      required: true,
    },
    nroDocumento: { type: String, required: true, unique: true },
    fechaNacimiento: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    direccion: { type: String },
    parentesco: {
      type: String,
      enum: ["Titular", "Cónyuge", "Hijo", "Otro"],
      required: true,
    },
    password: { type: String, required: true },
    fechaAlta: { type: Date, default: Date.now },
    estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo",
    },
    situacionTerapeutica: {
      type: String,
      required: true,
      default: "Sin enfermedades preexistentes",
    },
    planMedico: {
      type: String,
      enum: ["100", "200", "300", "400"],
      required: true,
    },
    cbu: { type: String },
  },
  {
    timestamps: true,
  }
);

const Afiliado = model<IAfiliado>("Afiliado", afiliadoSchema);

export default Afiliado;
