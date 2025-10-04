import { RolAfiliado } from "../enums/RolAfiliado";
import { Document } from "mongoose";
import { TipoDocumento } from "../enums/TipoDocumento";
import { Parentesco } from "../enums/Parentesco";
import { PlanMedico } from "../enums/PlanMedico";

//falta terminar de implementar la logica del rol- con enum y permisos
export interface IAfiliado {
  nroAfiliado: string; // Ej: "0000001-01"
  grupoFamiliar: string; // Ej: "0000001"
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  tipoDocumento: TipoDocumento;
  nroDocumento: string;
  email: string;
  telefono?: string;
  direccion?: string;
  parentesco: Parentesco;
  password: string;
  fechaAlta: Date;
  registrado: boolean;
  situacionTerapeutica: string;
  planMedico: PlanMedico;
  cbu?: string;
  rol: RolAfiliado;
}

export interface IAfiliadoDocument extends IAfiliado, Document {}
