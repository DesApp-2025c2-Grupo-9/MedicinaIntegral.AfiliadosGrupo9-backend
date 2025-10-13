import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types/ApiResponse';
import { Request, Response } from 'express';
import { RegisterBody, LoginBody, RequestCookies } from '../types/AuthTypes';
import Afiliado from '../models/Afiliado';
import { ERROR_MESSAGES } from '../utils/errorMessages';

interface IUserController {
  registerUser: (req: Request<{}, {}, RegisterBody>, res: Response<ApiResponse>) => Promise<void>;
  login: (req: Request<{}, {}, LoginBody>, res: Response<ApiResponse>) => Promise<void>;
  // logout: (req: Request, res: Response<ApiResponse>) => Promise<void>;
  // refreshToken: (req: Request, res: Response) => Promise<void>;
}

const userController: IUserController = {
  registerUser: async (req, res) => {
    const user = req.body;
    console.log(user);

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
      const foundUser = await Afiliado.findOne({ nroDocumento });
      if (!foundUser) {
        res.status(401).json({ message: 'Usuario no existe.' });
        return;
      }

      const validPassword = await bcrypt.compare(password, foundUser.password);
      if (!validPassword) {
        res.status(401).json({ message: 'Contraseña incorrecta.' });
        return;
      }

      const rol = foundUser.rol;
      const accessToken = jwt.sign({ nroDocumento, rol }, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '30m' });
      const refreshToken = jwt.sign({ nroDocumento }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '1d' });

      // foundUser.refreshToken = refreshToken;
      // await foundUser.save();

      res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: false, maxAge: 1000 * 60 * 60 * 24 });
      res.json({ accessToken, message: 'Inicio de sesión exitoso.' });
    } catch (error) {
      const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
      res.status(500).json({ message });
    }
  }
  /* logout: async (req, res) => {
    const cookies: RequestCookies = req.cookies;

    if (!cookies.jwt) {
      res.sendStatus(204);
      return;
    }

    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: false });

    const foundUser = await Afiliado.findOne({ refreshToken });
    if (!foundUser) {
      res.sendStatus(204);
      return;
    }

    foundUser.refreshToken = undefined;
    await foundUser.save();
    res.sendStatus(204);
  } */
};

export default userController;
