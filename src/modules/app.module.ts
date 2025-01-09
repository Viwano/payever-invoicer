import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { InvoiceService } from 'src/services/invoice.service';
import { InvoiceController } from 'src/controllers/invoice.controller';
import { Invoice, InvoiceSchema } from './../schemas/invoice.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/payever_invoicer_db'),
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
  ],
  controllers: [AppController, InvoiceController],
  providers: [AppService, InvoiceService],
  exports: [InvoiceService],
})
export class AppModule {}
