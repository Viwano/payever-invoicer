import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './common/filters/validation-exception.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Payever Invoicer app')
    .setDescription('This is a technical assessment to show my perfomance.')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);

  await app.listen(process.env.PORT ?? 3000);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ValidationExceptionFilter());
}
bootstrap();
