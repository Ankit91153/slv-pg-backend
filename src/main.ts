import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { ValidationExceptionInterceptor } from './common/interceptors/validation-exception.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for multiple origins
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:5173', // Vite default port
      'http://localhost:8080',
      'http://localhost:8081', // React Native
      process.env.FRONTEND_URL || '', // Production frontend URL from environment
    ].filter(Boolean), // Remove empty strings
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalFilters(new ValidationExceptionInterceptor());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('PG Management API')
    .setDescription(`
      ## PG (Paying Guest) Management System API
      
      Complete REST API for managing PG accommodations including:
      - User authentication and authorization
      - Floor, room, and bed management
      - Room type configuration (flexible bed counts)
      - Booking management system
      - Dashboard statistics
      
      ### Authentication
      Most endpoints require JWT authentication. Use the /auth/login endpoint to obtain a token.
      
      ### Roles
      - **ADMIN**: Full access to all endpoints
      - **TENANT**: Limited access to booking-related endpoints
    `)
    .setVersion('1.0.0')
    .setContact(
      'PG Management Support',
      '',
      'support@pgmanagement.com'
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'bearer',
    )
    .addServer('http://localhost:3003', 'Local Development')
    .addServer(process.env.API_URL || '', 'Production Server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep authorization token after page refresh
      tagsSorter: 'alpha', // Sort tags alphabetically
      operationsSorter: 'alpha', // Sort operations alphabetically
    },
    customSiteTitle: 'PG Management API Docs',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
  });

  const port = process.env.PORT ?? 3003;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
}
bootstrap();
