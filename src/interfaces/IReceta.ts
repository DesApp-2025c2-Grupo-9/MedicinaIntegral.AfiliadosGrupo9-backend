import { Document } from "mongoose";
import { Types } from "mongoose";
import { EstadoTramite } from "../enums/EstadoTramite";
import { IObservacion } from "./IObservacion";

export interface IReceta {
  nroAfiliado: string; // clave foránea a Afiliado
  medicamento: string;
  cantidad: number;
  presentacion: string;
  observaciones?: IObservacion[];
  estado: EstadoTramite;
  idAfiliado: Types.ObjectId;
}

export default IReceta;
