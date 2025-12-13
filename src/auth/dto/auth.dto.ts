import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ example: 'John Doe', description: 'The name of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ example: '+1234567890', description: 'The phone number of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @ApiPropertyOptional({ example: '+0987654321', description: 'Alternative phone number' })
  @IsString()
  @IsOptional()
  alternativeNumber?: string;

  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'Tech Corp', description: 'Company or College Name' })
  @IsString()
  @IsNotEmpty({ message: 'Company or College Name is required' })
  companyOrCollegeName: string;

  @ApiProperty({ example: '123 Main St', description: 'Address of the user' })
  @IsString()
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @ApiProperty({ example: 'password123', description: 'Password (min 6 characters)' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;

  @ApiPropertyOptional({ example: 'USER', description: 'Role of the user' })
  @IsString()
  @IsOptional()
  role?: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: 'user-uuid', description: 'The ID of the user' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: '123456', description: 'The 6-digit OTP' })
  @IsString()
  @Length(6, 6)
  otp: string;
}

export class ResendOtpDto {
  @ApiProperty({ example: 'user-uuid', description: 'The ID of the user' })
  @IsString()
  @IsNotEmpty()
  userId: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com', description: 'The email of the user' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'The password of the user' })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  password: string;
}
