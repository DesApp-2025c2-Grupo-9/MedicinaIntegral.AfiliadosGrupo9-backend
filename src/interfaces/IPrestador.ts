import { Document } from "mongoose";

export interface IPrestador {
  nombre: string;
  especialidad: string[]; //puede tener varias especialidades
  lugarAtencion: string[]; //puede atender en varios lugares
}
export interface IPrestadorDocument extends IPrestador, Document {}
