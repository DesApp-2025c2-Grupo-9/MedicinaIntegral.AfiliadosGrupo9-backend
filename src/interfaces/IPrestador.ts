import { Document } from "mongoose";

export interface ILugarAtencion {
  nombre: string;
  localidad: string;
  calle: string;
  numero: string;
  telefono: string;
}

export interface IPrestador {
  nombre: string;
  especialidad: string[]; // puede tener varias especialidades
  lugarAtencion: ILugarAtencion[]; // puede atender en varios lugares
}

export interface IPrestadorDocument extends IPrestador, Document {}
