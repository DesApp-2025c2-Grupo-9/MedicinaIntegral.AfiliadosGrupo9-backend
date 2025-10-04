import { Document, Types } from "mongoose";
import { EstadoTurno } from "../enums/EstadoTurno";

export interface ITurno {
  nroAfiliado: string; // referencia al Afiliado
  prestador: string | Types.ObjectId; // referencia al Prestador como string o _id
  especialidad: string;
  lugarAtencion: string;
  fechaTurno: Date;
  estado: EstadoTurno;
}

export interface ITurnoDocument extends ITurno, Document {}
