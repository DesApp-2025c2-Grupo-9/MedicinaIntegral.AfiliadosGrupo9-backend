import bcrypt from 'bcrypt';
import  Afiliado from '../models/Afiliado';
import { IAfiliadoDocument } from '../models/Afiliado';

export const validateUserLogin = async (nroDocumento: string, password: string) => {
  const foundUser = await Afiliado.findOne({ nroDocumento }).populate<{ grupoFamiliar: Pick<IAfiliadoDocument, '_id' | 'rol'>[] }>('grupoFamiliar', '_id rol');

  if (!foundUser) {
    throw { status: 401, message: 'Usuario no existe.' };
  }

  if (!foundUser.registrado) {
    throw { status: 401, message: 'Usuario no está registrado.' };
  }

  const validPassword = await bcrypt.compare(password, foundUser.password);
  if (!validPassword) {
    throw { status: 401, message: 'Contraseña incorrecta.' };
  }

  return foundUser;
};