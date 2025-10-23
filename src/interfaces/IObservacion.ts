export interface IObservacion {
  idEmisor: string; // idEmisor puede ser el ObjectId de un Prestador o un Afiliado
  rolEmisor: string; // 'Prestador' | 'Afiliado'
  descripcion: string;
  fecha: Date;
}
