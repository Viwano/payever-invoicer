import { ConfigService, ConfigModule } from '@nestjs/config';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

export const RABBITMQ_CLIENT = 'RABBITMQ_CLIENT';

export const rabbitmqProviders = [
  {
    provide: RABBITMQ_CLIENT,
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService): Promise<ClientProxy> => {
      return ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [configService.get<string>('RABBITMQ_URL')],
          queue: configService.get<string>('RABBITMQ_INVOICE_REPORT_QUEUE'),
          queueOptions: {
            durable: true,
          },
        },
      });
    },
    inject: [ConfigService],
  },
];
