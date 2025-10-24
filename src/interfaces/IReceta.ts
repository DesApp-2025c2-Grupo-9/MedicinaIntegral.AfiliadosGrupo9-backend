import { EstadoTramite } from "../enums/EstadoTramite";
import { IObservacion } from "./IObservacion";

export interface IReceta {
  nroAfiliado: string; // clave foránea a Afiliado
  medicamento: string;
  cantidad: number;
  presentacion: string;
  observaciones?: IObservacion[];
  estado: EstadoTramite;
  fechaBaja?: Date;
}

export default IReceta;
