import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded, raw } from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule); 
 
  app.enableCors({
    origin: 'https://esgizzi.fr',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: ['Content-Type', 'Authorization'],
  });

  // Configure raw body for Stripe webhook endpoint
  app.use('/subscription/webhook', raw({ type: 'application/json' }));

  //Increase body size limit for file uploads (e.g., profile pictures)
  app.use(json({ limit: '5mb'}));
  app.use(urlencoded({ limit: '5mb', extended: true}));

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
