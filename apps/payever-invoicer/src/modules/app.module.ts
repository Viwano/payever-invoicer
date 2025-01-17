// app.module.ts
import { Module } from '@nestjs/common';
import { InvoiceService } from './../services/invoice.service';
import { InvoiceController } from './../controllers/invoice.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './../database/database.providers';
import { RabbitMQModule } from './rabbitmq.module';
import { appProviders } from './../providers/providers';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    RabbitMQModule.register(),
    ...databaseProviders,
  ],
  controllers: [InvoiceController],
  providers: [...appProviders, InvoiceService],
  exports: [InvoiceService],
})
export class AppModule {}
