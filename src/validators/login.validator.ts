import bcrypt from 'bcrypt';
import  Afiliado  from '../models/Afiliado';
import { RolAfiliado } from '../enums/RolAfiliado';
import { LoginBody } from '../types/AuthTypes';

export const validateLoginCredentials = async ({ nroDocumento, password }: LoginBody) => {
  const errors: string[] = [];

  const foundUser = await Afiliado.findOne({ nroDocumento }).populate<{ grupoFamiliar: Pick<any, '_id' | 'rol'>[] }>('grupoFamiliar', '_id rol');

  if (!foundUser) {
    errors.push('Usuario no existe.');
    return { errors, foundUser: null };
  }

  if (!foundUser.registrado) {
    errors.push('Usuario no está registrado.');
    return { errors, foundUser };
  }

  const validPassword = await bcrypt.compare(password, foundUser.password);
  if (!validPassword) {
    errors.push('Contraseña incorrecta.');
  }

  return { errors, foundUser };
};

export const getFamiliaresPermitidos = (user: any): string[] => {
  if (user.rol === RolAfiliado.TITULAR) {
    return user.grupoFamiliar.map((f: any) => f._id);
  }

  if (user.rol === RolAfiliado.CONYUGE) {
    return user.grupoFamiliar
      .filter((f: any) => f.rol !== RolAfiliado.TITULAR && f.rol !== RolAfiliado.HIJO_MAYOR)
      .map((f: any) => f._id);
  }

  return [user._id];
};