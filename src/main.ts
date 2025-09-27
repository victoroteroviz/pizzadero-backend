import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Configurar zona horaria globalmente
process.env.TZ = 'America/Mexico_City';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Configuracion del prefijo global de las rutas
  app.setGlobalPrefix('api');

  // Configuración global de pipes de validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch((err) => console.error('Error starting server:', err));
