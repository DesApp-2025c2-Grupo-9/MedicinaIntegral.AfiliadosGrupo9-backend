import { Document, Types } from 'mongoose';
import { EstadoTurno } from '../enums/EstadoTurno';

export interface ITurno {
  idPrestador: Types.ObjectId;
  especialidad: string;
  lugarAtencion: string;
  telefono: number;  // teléfono del lugar de atención
  fechaTurno: Date;
  estado: EstadoTurno; // 'disponible' | 'reservado'
  idAfiliado?: Types.ObjectId;
}

export interface ITurnoDocument extends ITurno, Document {}
