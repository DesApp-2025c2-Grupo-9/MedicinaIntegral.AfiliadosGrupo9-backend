import { IRecetaDocument } from "../models/Receta";
import { IObservacion } from "../interfaces/IObservacion";

export class GetRecetasDTO {
  id: string;
  nroAfiliado: string;
  paraAfiliado: string;
  medicamento: string;
  cantidad: number;
  presentacion: string;
  observaciones?: IObservacion[];
  estado: string;

  constructor(data: IRecetaDocument) {
    this.id = data._id.toString();
    this.nroAfiliado = data.nroAfiliado;
    this.paraAfiliado = data.paraAfiliado;
    this.medicamento = data.medicamento;
    this.cantidad = data.cantidad;
    this.presentacion = data.presentacion;
    this.observaciones = data.observaciones;
    this.estado = data.estado;
  }
}

export class IdRecetaDTO {
  id: string;

  constructor(data: IRecetaDocument) {
    this.id = data._id.toString();
  }
}
