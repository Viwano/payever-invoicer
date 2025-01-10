import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceService } from 'src/services/invoice.service';
import { InvoiceController } from 'src/controllers/invoice.controller';
import { Invoice, InvoiceSchema } from './../schemas/invoice.schema';
import { CustomInvoiceValidator } from './../common/validators/invoice.validator';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  ],
  controllers: [AppController, InvoiceController],
  providers: [AppService, InvoiceService, CustomInvoiceValidator],
  exports: [InvoiceService],
})
export class AppModule {}
