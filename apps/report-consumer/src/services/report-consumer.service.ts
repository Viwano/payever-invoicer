import { Injectable, Logger } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { ReportDto } from './../dto/report.dto';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);

  constructor(
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
  ) {}

  async handleGeneratedReport(report: ReportDto): Promise<void> {
    this.logger.log(`Received report: ${JSON.stringify(report)}`);

    try {
      const emailContent = this.generateEmailContent(report);
      const recipient = this.configService.get<string>('EMAIL_RECIPIENT');

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

    for (const [itemName, quantity] of Object.entries(report.items)) {
      content += `Item: ${itemName}, Quantity Sold: ${quantity}\n`;
    }

    return content;
  }
}
