import { Module, Logger } from '@nestjs/common';
import { ReportService } from './../services/report-consumer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email.module';
import { ReportController } from './../controllers/report.controller';
import { EmailService } from './../services/email.service';

@Module({
  imports: [ConfigModule.forRoot(), EmailModule],
  controllers: [ReportController],
  providers: [ReportService, EmailService, ConfigService],
})
export class AppModule {}
