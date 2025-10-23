import jwt from 'jsonwebtoken';
import  Afiliado  from '../models/Afiliado';
import {RolAfiliado}  from '../enums/RolAfiliado';


export const getRefreshTokenFromCookies = (cookies: any): string | null => {
  return cookies?.jwt || null;
};

export const findUserByRefreshToken = async (token: string) => {
  return await Afiliado.findOne({ refreshToken: token }).populate<{ grupoFamiliar: Pick<any, '_id' | 'rol'>[] }>('grupoFamiliar', '_id rol');
};

export const verifyRefreshToken = (token: string, secret: string): Promise<{ nroDocumento: string } | null> => {
  return new Promise((resolve) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err || !decoded) return resolve(null);
      resolve(decoded as { nroDocumento: string });
    });
  });
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