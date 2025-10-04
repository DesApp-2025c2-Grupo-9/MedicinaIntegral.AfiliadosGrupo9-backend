import { Schema, model } from "mongoose";
import { RolAfiliado } from "../enums/RolAfiliado";
import { IAfiliadoDocument } from "../interfaces/IAfiliado";
import { TipoDocumento } from "../enums/TipoDocumento";
import { Parentesco } from "../enums/Parentesco";
import { PlanMedico } from "../enums/PlanMedico";

const afiliadoSchema = new Schema<IAfiliadoDocument>(
  {
    nroAfiliado: { type: String, required: true, unique: true },
    grupoFamiliar: { type: String, required: true },
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    tipoDocumento: {
      type: String,
      enum: Object.values(TipoDocumento),
      required: true,
      default: TipoDocumento.DNI,
    },
    nroDocumento: { type: String, required: true, unique: true },
    fechaNacimiento: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    direccion: { type: String },
    parentesco: {
      type: String,
      enum: Object.values(Parentesco),
      required: true,
      default: Parentesco.TITULAR,
    },
    password: { type: String, required: true, default: "123456" },
    fechaAlta: { type: Date, required: true, default: Date.now },
    registrado: { type: Boolean, default: false },
    situacionTerapeutica: {
      type: String,
      required: true,
      default: "Sin enfermedades preexistentes",
    },
    planMedico: {
      type: String,
      enum: Object.values(PlanMedico),
      required: true,
      default: PlanMedico.PLAN_100,
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
//despues ver si va en carpeta middlewares o hooks

afiliadoSchema.pre("save", function (next) {
  const afiliado = this as IAfiliadoDocument;

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
  if (afiliado.parentesco === "titular") {
    afiliado.rol = RolAfiliado.TITULAR;
  } else if (afiliado.parentesco === "conyuge") {
    afiliado.rol = RolAfiliado.CONYUGE;
  } else if (afiliado.parentesco === "hijo") {
    afiliado.rol = edad < 18 ? RolAfiliado.HIJO_MENOR : RolAfiliado.HIJO_MAYOR;
  } else {
    afiliado.rol = RolAfiliado.OTRO;
  }

  next();
});

export default model<IAfiliadoDocument>("Afiliado", afiliadoSchema);
