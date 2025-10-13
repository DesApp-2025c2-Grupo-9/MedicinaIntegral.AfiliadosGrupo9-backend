import { RolAfiliado } from '../enums/RolAfiliado';
import { Document, Types } from 'mongoose';
import { TipoDocumento } from '../enums/TipoDocumento';
import { Parentesco } from '../enums/Parentesco';
import { PlanMedico } from '../enums/PlanMedico';

// Falta implementar la lógica del rol con enums y permisos;

export interface IAfiliado {
  id: string;
  nroAfiliado: string; // Por ejemplo, '000001-01'
  // grupoFamiliar: string; Por ejemplo, '000001'
  grupoFamiliar: Types.ObjectId[];
  nombre: string;
  apellido: string;
  fechaNacimiento: Date;
  tipoDocumento: TipoDocumento; // 'dni' | 'pasaporte' | 'ci'
  nroDocumento: string;
  email: string;
  telefono?: string;
  direccion?: string;
  parentesco: Parentesco; // 'titular' | 'conyuge' | 'hijo' | 'otro'
  password: string;
  fechaAlta: Date;
  registrado: boolean;
  situacionTerapeutica: string;
  planMedico: PlanMedico; // '100' | '200' | '300' | '400'
  cbu?: string;
  rol: RolAfiliado; // 'Titular' | 'Cónyuge' | 'Hijo Menor' | 'Hijo Mayor' | 'Otro'
}

export default IAfiliado;
