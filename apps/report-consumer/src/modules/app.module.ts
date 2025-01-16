import { Module } from '@nestjs/common';
import { ReportService } from './../services/report-consumer.service';
import { EmailService } from './../services/email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [],
  providers: [ReportService, EmailService],
})
export class AppModule {}
