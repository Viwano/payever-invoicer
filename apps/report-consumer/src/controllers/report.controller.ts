import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ReportService } from './../services/report-consumer.service';
import { ReportDto } from './../dto/report.dto';
import { Payload } from '@nestjs/microservices';

@Controller('reports')
export class ReportController {
  private readonly logger = new Logger(ReportController.name);
  constructor(private readonly reportService: ReportService) {}

  @EventPattern('invoice_reports_queue')
  async handleInvoice(@Payload() data: any) {
    this.logger.log(JSON.stringify(data));
    await this.reportService.handleGeneratedReport(data);
  }
}
