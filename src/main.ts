import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Permite todas las solicitudes (útil para desarrollo)
    methods: 'GET,POST,PUT,DELETE,PATCH', // Métodos HTTP permitidos
    allowedHeaders: 'Content-Type,Authorization', // Headers permitidos
  });

  await app.listen(3000);
  
}

bootstrap();
