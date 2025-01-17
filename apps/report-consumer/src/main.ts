import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe, Logger, BadRequestException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'daily',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  const logger = new Logger('Bootstrap');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        console.error('Validation Errors:', errors);
        return new BadRequestException(errors);
      },
    }),
  );

  app.enableShutdownHooks();

  try {
    await app.listen();
    logger.log('Microservice is listening');
  } catch (error) {
    logger.error('Error starting microservice', error);
    process.exit(1);
  }
}
bootstrap();
