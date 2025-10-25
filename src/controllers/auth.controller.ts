import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiResponse } from '../types/ApiResponse';
import { Request, Response } from 'express';
import { RegisterBody, LoginBody } from '../types/AuthTypes';
import { ERROR_MESSAGES } from '../utils/errorMessages';
import { validateUserRegistration } from "../validators/user.validator"
import { validateLoginCredentials, getFamiliaresPermitidos } from "../validators/login.validator";
import {
  getRefreshTokenFromCookies,
  findUserByRefreshToken,
  clearUserRefreshToken
} from '../validators/logout.validator';

import {
  verifyRefreshToken,
} from '../validators/refresh.validator';



interface IUserController {
  registerUser: (req: Request<{}, {}, RegisterBody>, res: Response<ApiResponse>) => Promise<Response|void>; //agregue response /
  login: (req: Request<{}, {}, LoginBody>, res: Response<ApiResponse>) => Promise<Response|void>;
  logout: (req: Request, res: Response<ApiResponse>) => Promise<Response|void>;
  refresh: (req: Request, res: Response<ApiResponse>) => Promise<Response|void>;
}

const userController: IUserController = {
  registerUser: async (req, res) => {
    const user = req.body;

      try {
          const { errors, foundUser } = await validateUserRegistration(user);

      if (errors.length > 0 || !foundUser) {
        return res.status(400).json({ message: errors.join(', ') });
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
    try {
    const { errors, foundUser } = await validateLoginCredentials(req.body);

    if (errors.length > 0 || !foundUser) {
      return res.status(401).json({ message: errors.join(', ') });
    }

    const familiaresPermitidos = getFamiliaresPermitidos(foundUser);

    const accessToken = jwt.sign(
      { nroDocumento: foundUser.nroDocumento, familiaresPermitidos },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { nroDocumento: foundUser.nroDocumento },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '1d' }
    );

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    });

    return res.json({ accessToken, message: 'Inicio de sesión exitoso.' });
  } catch (error) {
    const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
    return res.status(500).json({ message });
  }


  },

  logout: async (req, res) => {
    const refreshToken = getRefreshTokenFromCookies(req.cookies);

    if (!refreshToken) {
      return res.sendStatus(204);
    }

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });

    const foundUser = await findUserByRefreshToken(refreshToken);
    if (!foundUser) {
      return res.sendStatus(204);
    }

    await clearUserRefreshToken(foundUser);
    return res.sendStatus(204);

  },

  refresh: async (req, res) => {
    const refreshToken = getRefreshTokenFromCookies(req.cookies);
  if (!refreshToken) return res.sendStatus(401);

  res.clearCookie('jwt', { httpOnly: true, sameSite: 'lax', secure: false });

  try {
    const foundUser = await findUserByRefreshToken(refreshToken);
    if (!foundUser) return res.sendStatus(401);

    const decoded = await verifyRefreshToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    if (!decoded || foundUser.nroDocumento !== decoded.nroDocumento) {
      foundUser.refreshToken = '';
      await foundUser.save();
      return res.sendStatus(401);
    }

    const familiaresPermitidos = getFamiliaresPermitidos(foundUser);

    const accessToken = jwt.sign(
      { nroDocumento: foundUser.nroDocumento, familiaresPermitidos },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: '15m' }
    );

    const newRefreshToken = jwt.sign(
      { nroDocumento: foundUser.nroDocumento },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: '1d' }
    );

    foundUser.refreshToken = newRefreshToken;
    await foundUser.save();

    res.cookie('jwt', newRefreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    });

    res.json({ accessToken });
  } catch (error) {
    const message = ERROR_MESSAGES.GENERAL.UNKNOWN(error);
    res.status(500).json({ message });
  }
  }
  
};
export default userController;