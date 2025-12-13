import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Encrypt / hash plain password
 */
export const hashPassword = async (plainPassword: string): Promise<string> => {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
};

/**
 * Compare plain password with hashed password
 */
export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
