import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { RolAfiliado } from '../enums/RolAfiliado';

declare module 'express-serve-static-core' {
  interface Request {
    nroDocumento?: string;
    rol?: RolAfiliado;
  }
}

export const verifyJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const formatedAuthHeader = authHeader as string;
  console.log(formatedAuthHeader);
  if (!formatedAuthHeader?.startsWith('Bearer ')) return res.sendStatus(401); // Si no hay accessToken en el header 'authorization' de la petición, error 401;

  const token = formatedAuthHeader.split(' ')[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (error, decoded) => {
    if (error) return res.sendStatus(403); // Si accessToken del header 'authorization' ya está vencido, error 403;

    const decodedPayload = decoded as { nroDocumento: string; rol: RolAfiliado };
    req.nroDocumento = decodedPayload.nroDocumento;
    req.rol = decodedPayload.rol;
    next();
  });
};
