// app.module.ts
import { Module } from '@nestjs/common';
import { InvoiceService } from './../services/invoice.service';
import { InvoiceController } from './../controllers/invoice.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './../database/database.providers';
import { RabbitMQModule } from './rabbitmq.module';
import { appProviders } from './../providers/providers';
import { HealthController } from './../controllers/health.controller';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    RabbitMQModule.register(),
    ...databaseProviders,
    TerminusModule,
  ],
  controllers: [InvoiceController, HealthController],
  providers: [...appProviders, InvoiceService],
  exports: [InvoiceService],
})
export class AppModule {}
