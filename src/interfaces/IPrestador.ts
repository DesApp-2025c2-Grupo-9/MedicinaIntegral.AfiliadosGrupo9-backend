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
