import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ReportService } from './../services/report-consumer.service';

@Controller('reports')
export class ReportController {
  private readonly logger = new Logger(ReportController.name);
  constructor(private readonly reportService: ReportService) {}

  @EventPattern('invoice_reports')
  async handleInvoice(data: any) {
    // Delegate to service for business logic
    //await this.invoiceService.processInvoice(data);
    this.logger.log(JSON.stringify(data));
  }
}
