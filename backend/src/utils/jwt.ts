import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

export const generateTokens = (payload: JWTPayload) => {
  const accessToken = jwt.sign(
    payload as object,
    process.env.JWT_SECRET as string,
    { expiresIn: (process.env.JWT_EXPIRE as string) || '24h' as string }
  );

  const refreshToken = jwt.sign(
    payload as object,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: (process.env.JWT_REFRESH_EXPIRE as string) || '7d' as string }
  );

  return { accessToken, refreshToken };
};

export const verifyToken = (token: string, secret: string): JWTPayload => {
  return jwt.verify(token, secret) as JWTPayload;
};

export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    return null;
  }
};