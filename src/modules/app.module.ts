import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceService } from 'src/services/invoice.service';
import { InvoiceController } from 'src/controllers/invoice.controller';
import { Invoice, InvoiceSchema } from './../schemas/invoice.schema';
import { CustomInvoiceValidator } from './../common/validators/invoice.validator';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReportService } from 'src/services/report.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    ScheduleModule.forRoot(),
    ClientsModule.register([
      {
        name: 'REPORT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'invoice_reports',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, CustomInvoiceValidator, ReportService],
  exports: [InvoiceService],
})
export class AppModule {}
