import { IRecetaDocument } from "../models/Receta";
import { IObservacion } from "../interfaces/IObservacion";

export class GetRecetasDTO {
  id: string;
  nroAfiliado: string;
  paraAfiliado: string;
  medicamento: string;
  cantidad: number;
  presentacion: string;
  idAfiliado?: string;
  observaciones?: IObservacion[];
  estado: string;
  createdAt?: Date;
  fechaAprobacion?: Date;

  constructor(data: IRecetaDocument) {
    this.id = data._id.toString();
    this.nroAfiliado = data.nroAfiliado;
    this.paraAfiliado = data.paraAfiliado;
    this.medicamento = data.medicamento;
    this.cantidad = data.cantidad;
    this.presentacion = data.presentacion;
    this.observaciones = data.observaciones;
    this.estado = data.estado;
    this.createdAt = data.createdAt;
    this.idAfiliado = data.idAfiliado.toString();
    this.fechaAprobacion = data.fechaAprobacion;
  }
}

export class IdRecetaDTO {
  id: string;

  constructor(data: IRecetaDocument) {
    this.id = data._id.toString();
  }
}
export class CommentRecetaDTO {
  id: string;
  observaciones?: IObservacion[];

  constructor(data: IRecetaDocument) {
    this.id = data._id.toString();
    this.observaciones = data.observaciones;
  }
}
