import { Injectable, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { ReportDto } from './../dto/report.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  @MessagePattern('invoice_reports')
  async handleGeneratedReport(@Payload() report: ReportDto) {
    try {
      this.logger.log(`Received report: ${JSON.stringify(report)}`);

      const emailContent = this.generateEmailContent(report);
      const recipient = this.configService.get<string>('EMAIL_RECIPIENT');
      await this.emailService.sendEmail({
        to: recipient,
        subject: 'Daily Sales Report',
        text: emailContent,
      });

      this.logger.log('Email sent successfully');
    } catch (error) {
      this.logger.error('Failed to process report', { error });
    }
  }

  private generateEmailContent(report: ReportDto): string {
    const { totalSales, items } = report;

    const itemSummary = items
      .map(
        (item) =>
          `SKU: ${item.sku}, Quantity Sold: ${item.qt}, Total: $${item.price}`,
      )
      .join('\n');

    return `Daily Sales Report:
  -------------------
  Total Sales: $${totalSales}
  
  Item Summary:
  ${itemSummary}`;
  }
}
