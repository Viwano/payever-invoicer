import { Module } from '@nestjs/common';
import { InvoiceService } from './../services/invoice.service';
import { InvoiceController } from './../controllers/invoice.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './../database/database.providers';
import { rabbitmqProviders } from './../microservices/rabbitmq.providers';
import { appProviders } from './../providers/providers';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ...databaseProviders,
  ],
  controllers: [InvoiceController],
  providers: [...appProviders],
  exports: [InvoiceService, ...rabbitmqProviders],
})
export class AppModule {}
