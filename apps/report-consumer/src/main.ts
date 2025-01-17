import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'invoice_reports_queue',
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  app.useGlobalPipes(new ValidationPipe());
  await app.listen();
}
bootstrap();
