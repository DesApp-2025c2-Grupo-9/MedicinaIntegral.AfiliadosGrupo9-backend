<<<<<<< HEAD
import { Document } from "mongoose";
import { Types } from "mongoose";
=======
>>>>>>> dev
import { EstadoTramite } from "../enums/EstadoTramite";
import { IObservacion } from "./IObservacion";

export interface IReceta {
  nroAfiliado: string; // clave foránea a Afiliado
  paraAfiliado: string;
  medicamento: string;
  cantidad: number;
  presentacion: string;
  observaciones?: IObservacion[];
  estado: EstadoTramite;

  idAfiliado: Types.ObjectId;
  activo: boolean;

 // fechaBaja?: Date;

}

export default IReceta;
