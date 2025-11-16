import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ICbu extends Document {
  cbu: string;
  tipoDeCuenta: string;
  cuil: string;
  nombre: string;
  apellido: string;
  
}

const cbuSchema: Schema<ICbu> = new Schema({
  cbu: { type: String, required: true, unique: true },
  tipoDeCuenta: { type: String, required: true },
  cuil: { type: String, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true }
  
});


const CbuModel: Model<ICbu> = mongoose.model<ICbu>('Cbu', cbuSchema);
export const Cbu = CbuModel;
export default CbuModel;
