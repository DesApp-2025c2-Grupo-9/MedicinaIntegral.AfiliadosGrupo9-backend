import { Document } from "mongoose";
import { Especialidad } from "../enums/Especialidad";
import { Localidad } from "../enums/Localidad";

export interface ILugarAtencion {
  nombre: string;
  localidad: Localidad;
  calle: string;
  numero: string;
  telefono: string;
}

export interface IPrestador {
  nombre: string;
  especialidad: Especialidad;
  lugarAtencion: ILugarAtencion;
}

export interface IPrestadorDocument extends IPrestador, Document {}

/*import { Document } from "mongoose";

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

export interface IPrestadorDocument extends IPrestador, Document {}*/
