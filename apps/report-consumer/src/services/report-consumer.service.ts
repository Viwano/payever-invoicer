import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { ReportDto } from './../dto/report.dto';

@Injectable()
export class ReportService {
  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly logger: Logger,
  ) {}

  async handleGeneratedReport(report: ReportDto): Promise<void> {
    this.logger.log(`Received report: ${JSON.stringify(report)}`);

    try {
      const emailContent = this.generateEmailContent(report);
      const recipient = this.configService.get<string>('RECIPIENT_EMAIL');

      await this.emailService.sendEmail({
        to: recipient,
        subject: 'Daily Sales Report',
        text: emailContent,
      });
      this.logger.log('Email sent successfully');
    } catch (error) {
      this.logger.error('Failed to process report', {
        error,
      });
    }
  }

  private generateEmailContent(report: ReportDto): string {
    let content = 'Daily Sales Report\n\n';
    content += `Total Sales: $${report.totalSales}\n\n`;
    content += 'Items:\n';

    for (const item of report.items) {
      content += `SKU: ${item.sku}, Quantity Sold: ${item.qt}, Total: $${item.price}\n`;
    }

    return content;
  }
}
