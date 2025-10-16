import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types/ApiResponse';
import { Request, Response } from 'express';
import { RegisterBody, LoginBody, RequestCookies } from '../types/AuthTypes';
import Afiliado, { IAfiliadoDocument } from '../models/Afiliado';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { RolAfiliado } from '../enums/RolAfiliado';

interface IUserController {
  registerUser: (req: Request<{}, {}, RegisterBody>, res: Response<ApiResponse>) => Promise<void>;
  login: (req: Request<{}, {}, LoginBody>, res: Response<ApiResponse>) => Promise<void>;
  logout: (req: Request, res: Response<ApiResponse>) => Promise<void>;
  refresh: (req: Request, res: Response<ApiResponse>) => Promise<void>;
}

const userController: IUserController = {
  registerUser: async (req, res) => {
    const user = req.body;

    try {
      const foundUser = await Afiliado.findOne({ nroDocumento: user.nroDocumento });
      if (!foundUser) {
        res.status(401).json({ message: 'Usuario no existe.' });
        return;
      }
      if (foundUser.registrado) {
        res.status(409).json({ message: 'Usuario ya registrado.' });
        return;
      }
      if (user.password !== user.confirmPassword) {
        res.status(400).json({ message: 'Contraseñas no coinciden.' });
        return;
      }

      const hashedPassword = await bcrypt.hash(user.password, 10);
      foundUser.password = hashedPassword;
      foundUser.registrado = true;
      const userRegistrado = await foundUser.save();
      res.json({ data: userRegistrado, message: 'Usuario registrado con éxito.' });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  login: async (req, res) => {
    const { nroDocumento, password } = req.body;

    try {
      const foundUser = await Afiliado.findOne({ nroDocumento }).populate<{ grupoFamiliar: Pick<IAfiliadoDocument, '_id' | 'rol'>[] }>('grupoFamiliar', '_id rol');

      if (!foundUser) {
        res.status(401).json({ message: 'Usuario no existe.' });
        return;
      }

      if (!foundUser.registrado) {
        res.status(401).json({ message: 'Usuario no está registrado.' });
        return;
      }

      const validPassword = await bcrypt.compare(password, foundUser.password);
      if (!validPassword) {
        res.status(401).json({ message: 'Contraseña incorrecta.' });
        return;
      }

      let familiaresPermitidos; // Arreglo de _id de los afiliados de los cuales el usuario puede ver su información dependiendo el rol.

      if (foundUser.rol === RolAfiliado.TITULAR) {
        const arr = foundUser.grupoFamiliar.map(familiar => familiar._id);
        familiaresPermitidos = [...arr];
      }

      if (foundUser.rol === RolAfiliado.CONYUGE) {
        const arr = foundUser.grupoFamiliar.filter(familiar => familiar.rol !== RolAfiliado.TITULAR && familiar.rol !== RolAfiliado.HIJO_MAYOR).map(familiar => familiar._id);
        familiaresPermitidos = [...arr];
      }

      if (foundUser.rol === RolAfiliado.HIJO_MAYOR || foundUser.rol === RolAfiliado.HIJO_MENOR || foundUser.rol === RolAfiliado.OTRO) {
        familiaresPermitidos = [foundUser._id];
      }

      const accessToken = jwt.sign({ nroDocumento, familiaresPermitidos }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
      const refreshToken = jwt.sign({ nroDocumento }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '1d' });

      foundUser.refreshToken = refreshToken;
      await foundUser.save();

      res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 1000 * 60 * 60 * 24 });
      res.json({ accessToken, message: 'Inicio de sesión exitoso.' });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  },
  logout: async (req, res) => {
    const cookies: RequestCookies = req.cookies;

    if (!cookies.jwt) {
      res.sendStatus(204);
      return;
    }

    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });

    const foundUser = await Afiliado.findOne({ refreshToken });
    if (!foundUser) {
      res.sendStatus(204);
      return;
    }

    foundUser.refreshToken = '';
    await foundUser.save();
    res.sendStatus(204);
  },
  refresh: async (req, res) => {
    const cookies: RequestCookies = req.cookies;

    if (!cookies?.jwt) {
      res.sendStatus(401);
      return;
    }
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });

    try {
      const foundUser = await Afiliado.findOne({ refreshToken }).populate<{ grupoFamiliar: Pick<IAfiliadoDocument, '_id' | 'rol'>[] }>('grupoFamiliar', '_id rol');
      if (!foundUser) {
        res.sendStatus(401);
        return;
      }

      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, async (error, decoded) => {
        const decodedPayload = decoded as { nroDocumento: string; familiaresPermitidos: string[] };
        if (error || foundUser.nroDocumento !== decodedPayload?.nroDocumento) {
          foundUser.refreshToken = '';
          await foundUser.save();
          res.sendStatus(401);
          return;
        }

        let familiaresPermitidos; // Arreglo de _id de los afiliados de los cuales el usuario puede ver su información dependiendo el rol.

        if (foundUser.rol === RolAfiliado.TITULAR) {
          const arr = foundUser.grupoFamiliar.map(familiar => familiar._id);
          familiaresPermitidos = [...arr];
        }

        if (foundUser.rol === RolAfiliado.CONYUGE) {
          const arr = foundUser.grupoFamiliar.filter(familiar => familiar.rol !== RolAfiliado.TITULAR && familiar.rol !== RolAfiliado.HIJO_MAYOR).map(familiar => familiar._id);
          familiaresPermitidos = [...arr];
        }

        if (foundUser.rol === RolAfiliado.HIJO_MAYOR || foundUser.rol === RolAfiliado.HIJO_MENOR || foundUser.rol === RolAfiliado.OTRO) {
          familiaresPermitidos = [foundUser._id];
        }

        const accessToken = jwt.sign({ nroDocumento: foundUser.nroDocumento, familiaresPermitidos }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });
        const newRefreshToken = jwt.sign({ nroDocumento: foundUser.nroDocumento }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '1d' });

        foundUser.refreshToken = newRefreshToken;
        await foundUser.save();

        res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'lax', secure: false, maxAge: 1000 * 60 * 60 * 24 });
        res.json({ accessToken });
      });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  }
};

export default userController;
