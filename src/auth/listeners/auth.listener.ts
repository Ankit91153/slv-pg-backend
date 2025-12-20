import { OnEvent } from '@nestjs/event-emitter';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { sendEmail } from 'src/common/utils/email.util';
import { UserRegisteredEvent } from '../events/user-registered.event';
import { generateOtp, hashOtp } from 'src/common/utils/otp.util';

@Injectable()
export class AuthListener {
  constructor(private readonly prisma: PrismaService) { }

  @OnEvent('user.registered', { async: true })
  async handleUserRegistered(event: UserRegisteredEvent) {
    const otp = generateOtp();
    const otpHash = await hashOtp(otp);

    console.log(otp, "OTP");
    console.log(otpHash, "OTP Hash");

    //  delete old OTPs
    await this.prisma.otp.deleteMany({
      where: { userId: event.userId },
    });

    console.log(event.userId, "User ID");
    //  Save hashed OTP
    await this.prisma.otp.create({
      data: {
        userId: event.userId,
        otpHash,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min
      },
    });

    console.log(event.email, "Email");
    //  Send plain OTP to email
    await sendEmail(
      event.email,
      'Verify your email',
      `
        <h3>Hello ${event.name}</h3>
        <p>Your OTP is <b>${otp}</b></p>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    );
    console.log("Email sent successfully");
  }
}
