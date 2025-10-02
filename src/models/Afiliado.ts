import { Schema, model, Document } from "mongoose";
import { RolAfiliado } from "../enums/RolAfiliado";

//falta terminar de implementar la logica del rol- con enum y permisos
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
  rol: RolAfiliado;
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
    rol: {
      type: String,
      enum: Object.values(RolAfiliado),
      default: RolAfiliado.TITULAR,
    },
  },

  {
    timestamps: true,
  }
);

//para poder asignar rol al afiliado antes de guardarlo
//ver si lo ponemos en
afiliadoSchema.pre("save", function (next) {
  const afiliado = this as IAfiliado;

  // Calcular edad
  const hoy = new Date();
  let edad = hoy.getFullYear() - afiliado.fechaNacimiento.getFullYear();
  const m = hoy.getMonth() - afiliado.fechaNacimiento.getMonth();
  if (
    m < 0 ||
    (m === 0 && hoy.getDate() < afiliado.fechaNacimiento.getDate())
  ) {
    edad--;
  }

  // Asignar rol según parentesco + edad
  if (afiliado.parentesco === "Titular") {
    afiliado.rol = RolAfiliado.TITULAR;
  } else if (afiliado.parentesco === "Cónyuge") {
    afiliado.rol = RolAfiliado.CONYUGE;
  } else if (afiliado.parentesco === "Hijo") {
    afiliado.rol = edad < 18 ? RolAfiliado.HIJO_MENOR : RolAfiliado.HIJO_MAYOR;
  } else {
    afiliado.rol = RolAfiliado.OTRO;
  }

  next();
});
const Afiliado = model<IAfiliado>("Afiliado", afiliadoSchema);

export default Afiliado;
