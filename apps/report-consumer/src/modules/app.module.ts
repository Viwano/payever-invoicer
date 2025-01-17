import { Module } from '@nestjs/common';
import { ReportService } from './../services/report-consumer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email.module';
import { ReportController } from './../controllers/report.controller';

@Module({
  imports: [ConfigModule.forRoot(), EmailModule],
  controllers: [ReportController],
  providers: [ReportService, ConfigService],
})
export class AppModule {}
