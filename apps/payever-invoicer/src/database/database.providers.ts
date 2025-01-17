import { ConfigService, ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from './../schemas/invoice.schema';

export const databaseProviders = [
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('DATABASE_URI'),
    }),
    inject: [ConfigService],
  }),
  MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
];
