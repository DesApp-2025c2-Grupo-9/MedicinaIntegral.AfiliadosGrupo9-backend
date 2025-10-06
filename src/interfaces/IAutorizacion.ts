import { Document } from "mongoose";
import { EstadoTramite } from "../enums/EstadoDeTramite";

export interface IAutorizacion {
  nroAfiliado: string; // referencia al Afiliado
  fechaSolicitud: Date;
  practica: string;
  especialidad: string;
  medicoSolicitante: string;
  lugarAtencion: string;
  diagnostico?: string;
  observaciones?: string;
  estado: EstadoTramite;
}

export interface IAutorizacionDocument extends IAutorizacion, Document {}
