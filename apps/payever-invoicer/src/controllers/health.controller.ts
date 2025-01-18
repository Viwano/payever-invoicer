import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MongooseHealthIndicator,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check() {
    return this.health.check([
      async () => this.mongoose.pingCheck('mongodb'),
      async () =>
        this.microservice.pingCheck<any>('rabbitmq', {
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: 'reports_queue',
          },
        }),

      async () => ({
        memory_heap: {
          status: 'up',
          details: process.memoryUsage().heapUsed,
        },
      }),

      async () => ({
        uptime: {
          status: 'up',
          details: process.uptime(),
        },
      }),
    ]);
  }
}
