import { Document, Types } from "mongoose";
import { EstadoTurno } from "../enums/EstadoTurno";

export interface ITurno {
  nroAfiliado?: string;  // identificador del Afiliado
  idAfiliado?: Types.ObjectId;  
  prestador: string | Types.ObjectId; // referencia al Prestador como string o _id
  especialidad: string;
  lugarAtencion: string;
  telefono: number;  // teléfono del lugar de atención
  fechaTurno: Date;
  estado: EstadoTurno;
}

export interface ITurnoDocument extends ITurno, Document {}
