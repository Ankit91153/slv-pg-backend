import * as bcrypt from 'bcrypt';
export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export async function hashOtp(otp: string): Promise<string> {
  return bcrypt.hash(otp, 10);
}

export async function verifyOtp(
  otp: string,
  otpHash: string,
): Promise<boolean> {
  return bcrypt.compare(otp, otpHash);
}
