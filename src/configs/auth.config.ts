import 'dotenv/config';

export const SALT_ROUNDS = 10;
export const REFRESH_TOKEN_SALT_ROUNDS = 10;

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET cannot be null');

export const JWT_ACCESS_TOKEN_CONFIG = {
  secret: `access_${secret}`,
  expiresIn: '1d',
};

export const JWT_REFRESH_TOKEN_CONFIG = {
  secret: `refresh_${secret}`,
  expiresIn: '1d',
};

export const JWT_PASSWORD_RESET_TOKEN_CONFIG = {
  secret: `password_reset_${secret}`,
  expiresIn: '1d',
};
