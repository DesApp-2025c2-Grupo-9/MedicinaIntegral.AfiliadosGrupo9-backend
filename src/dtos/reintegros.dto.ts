import { IReintegroDocument } from '../models/Reintegro';

export class GetReintegrosDTO {
  id: string;
  paraAfiliado: string;
  especialidad: string;
  medico: string;
  fechaDePrestacion: Date;
  lugarDeAtencion: string;
  factura: {
    valorTotal: number;
  };
  estado: string;

  constructor(data: IReintegroDocument) {
    // Recibe un documento de Mongo
    this.id = data._id.toString();
    this.paraAfiliado = data.paraAfiliado;
    this.especialidad = data.especialidad;
    this.medico = data.medico;
    this.fechaDePrestacion = data.fechaDePrestacion;
    this.lugarDeAtencion = data.lugarDeAtencion;
    this.factura = { valorTotal: data.factura.valorTotal };
    this.estado = data.estado;
  }
}

export class PostReintegroDTO {
  id: string;

  constructor(data: IReintegroDocument) {
    this.id = data._id.toString();
  }
}

export class PutReintegroDTO {
  id: string;

  constructor(data: IReintegroDocument) {
    this.id = data._id.toString();
  }
}

export class DeleteReintegroDTO {
  id: string;

  constructor(data: IReintegroDocument) {
    this.id = data._id.toString();
  }
}
