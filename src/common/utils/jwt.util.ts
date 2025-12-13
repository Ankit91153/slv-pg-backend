
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function createToken(payload: TokenPayload): string {
  // 30 days in seconds
  const expiresIn = 30 * 24 * 60 * 60;

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn });

  return token;
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
} 