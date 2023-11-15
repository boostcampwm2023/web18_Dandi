import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Dandi Api Document')
  .setDescription('Dandi Swagger API Document')
  .setVersion('0.1')
  .addTag('Dandi')
  .build();
