import { BadRequestException, Injectable } from '@nestjs/common';
import {
  LoginDto,
  RegisterUserDto,
  ResendOtpDto,
  VerifyOtpDto,
} from './dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { comparePassword, hashPassword } from 'src/common/utils/password.util';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserRegisteredEvent } from './events/user-registered.event';
import { verifyOtp } from 'src/common/utils/otp.util';
import { createToken } from 'src/common/utils/jwt.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) { }

  async register(registerUserDto: RegisterUserDto) {
    const {
      name,
      phoneNumber,
      alternativeNumber,
      email,
      companyOrCollegeName,
      address,
      password,
    } = registerUserDto;

    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });

    // 🔁 If user exists
    if (existingUser) {
      if (existingUser.isVerified) {
        if (existingUser.email === email) {
          throw new BadRequestException('Email already exists');
        }
        if (existingUser.phoneNumber === phoneNumber) {
          throw new BadRequestException('Phone number already exists');
        }
      }

      // Not verified → resend OTP
      this.eventEmitter.emit(
        'user.registered',
        new UserRegisteredEvent(
          existingUser.id,
          existingUser.email,
          existingUser.name,
        ),
      );

      return {
        message: 'OTP resent successfully',
        data: {
          id: existingUser.id,
          email: existingUser.email,
        },
      };
    }

    // 🆕 Create user
    const hashedPassword = await hashPassword(password);

    const user = await this.prisma.user.create({
      data: {
        name,
        phoneNumber,
        alternativeNumber,
        email,
        companyOrCollegeName,
        address,
        password: hashedPassword,
        isVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        role: true,
      },
    });

    this.eventEmitter.emit(
      'user.registered',
      new UserRegisteredEvent(user.id, user.email, user.name),
    );

    return {
      message: 'OTP sent successfully',
      data: user,
    };
  }


  async verifyEmailOtp(verifyOtpDto: VerifyOtpDto) {
    const { userId, otp } = verifyOtpDto;
    const otpRecord = await this.prisma.otp.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (!otpRecord) {
      throw new BadRequestException('OTP not found Please Register first');
    }
    if (otpRecord.expiresAt < new Date()) {
      throw new BadRequestException('OTP has expired Please send again OTP');
    }

    const isValid = await verifyOtp(otp, otpRecord.otpHash);
    if (!isValid) {
      throw new BadRequestException('Please fill correct OTP');
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { isVerified: true },
    });
    await this.prisma.otp.deleteMany({ where: { userId } });

    return {
      message: 'Register Successfull',
    };
  }

  async resendOtp(resendOtpDto: ResendOtpDto) {
    const { userId } = resendOtpDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('User already verified');
    }

    // Delete old OTPs
    await this.prisma.otp.deleteMany({ where: { userId } });

    this.eventEmitter.emit(
      'user.registered',
      new UserRegisteredEvent(user.id, user.email, user.name),
    );

    return {
      message: 'OTP sent successfully',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const existingUser = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new BadRequestException('Email not register please Register first');
    }
    if (!existingUser.isVerified) {
      throw new BadRequestException('Email not verified please verify first');
    }

    const isPasswordMatch = await comparePassword(
      password,
      existingUser.password,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid Credentia');
    }

    const token = createToken({
      userId: existingUser?.id,
      email: existingUser?.email,
      role: existingUser?.role,
    });

    if (!token) {
      throw new BadRequestException('token not');
    }

    return {
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          id: existingUser?.id,
          name: existingUser?.name,
          email: existingUser?.email,
          phoneNumber: existingUser?.phoneNumber,
          role: existingUser?.role,
        },
      },
    };
  }
  async logout() {
    return {
      message: 'Logout successful',
    };
  }

  async getAllTenantUsers() {
    const tenants = await this.prisma.user.findMany({
      where: {
        role: 'TENANT',
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        alternativeNumber: true,
        companyOrCollegeName: true,
        address: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data: tenants,
      message: 'Tenant users fetched successfully',
    };
  }
}
