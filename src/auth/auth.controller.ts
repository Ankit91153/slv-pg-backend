import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterUserDto, ResendOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '../common/enums/role.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Post('/verify-email')
  @ApiOperation({ summary: 'Verify email with OTP' })
  @ApiResponse({ status: 200, description: 'Email successfully verified.' })
  @ApiResponse({ status: 400, description: 'Invalid OTP or User ID.' })
  async verifyEmail(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authService.verifyEmailOtp(verifyOtpDto);
  }

  @Post('/resend-otp')
  @ApiOperation({ summary: 'Resend OTP' })
  @ApiResponse({ status: 200, description: 'OTP resent successfully.' })
  @ApiResponse({ status: 400, description: 'User not found.' })
  async resendOtp(@Body() resendOtpDto: ResendOtpDto) {
    return this.authService.resendOtp(resendOtpDto);
  }

  @Post('/login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }

  @Post('/logout')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'User logout' })
  @ApiResponse({ status: 200, description: 'User successfully logged out.' })
  async logout() {
    return this.authService.logout();
  }

  @Get('/users')
  @ApiBearerAuth('bearer')
  @UseGuards(AuthGuard, new RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Get all tenant users (ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Return all tenant users.' })
  getAllTenantUsers() {
    return this.authService.getAllTenantUsers();
  }
}
