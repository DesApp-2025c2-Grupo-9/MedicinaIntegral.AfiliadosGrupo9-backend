import { IReintegroDocument } from '../models/Reintegro';
import pesosArg from '../utils/pesosArg';
import capitalize from '../utils/capitalize';

export class GetReintegrosDTO {
  id: string;
  paraAfiliado: string;
  especialidad: string;
  medico: string;
  fecha: Date;
  lugar: string;
  valor: string;
  estado: string;

  constructor(data: IReintegroDocument) {
    // Recibe un documento de Mongo
    this.id = data._id.toString();
    this.paraAfiliado = data.paraAfiliado;
    this.especialidad = data.especialidad;
    this.medico = data.medico;
    this.fecha = data.fechaDePrestacion;
    this.lugar = data.lugarDeAtencion;
    this.valor = pesosArg.format(data.factura.valorTotal);
    this.estado = capitalize(data.estado);
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
