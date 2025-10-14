import { IAfiliadoDocument } from '../models/Afiliado';

interface IPopulatedAfiliado extends Omit<IAfiliadoDocument, 'grupoFamiliar'> {
  grupoFamiliar: IAfiliadoDocument[];
}

export class GetAfiliadoDTO {
  nombre: string;
  apellido: string;
  grupoFamiliar: { nombre: string; apellido: string }[];

  constructor(data: unknown) {
    const castedData = data as IPopulatedAfiliado;
    this.nombre = castedData.nombre;
    this.apellido = castedData.apellido;
    this.grupoFamiliar = castedData.grupoFamiliar?.map(doc => ({
      nombre: doc.nombre,
      apellido: doc.apellido
    }));
  }
}
