import { Injectable, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class ReportService {
  private readonly logger = new Logger(ReportService.name);
  private transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  @MessagePattern('invoice_reports') // Listen for the "generate_report" event
  async handleGeneratedReport(
    @Payload() report: { totalSales: number; items: any[] },
  ) {
    this.logger.log(`Received report: ${JSON.stringify(report)}`);
    console.log('Received generated report:', report);
    // Process the report (e.g., store in a database, send via email, etc.)

    const emailContent = this.generateEmailContent(report);
    await this.sendEmail({
      to: this.configService.get<string>('EMAIL_RECIPIENT'),
      subject: 'Daily Sales Report',
      text: emailContent,
    });

    this.logger.log('Email sent successfully');
  }

  private generateEmailContent(report: {
    totalSales: number;
    items: any[];
  }): string {
    const { totalSales, items } = report;

    const itemSummary = items
      .map(
        (item) =>
          `SKU: ${item.sku}, Quantity Sold: ${item.qt}, Total: $${item.price}`,
      )
      .join('\n');

    return `
      Daily Sales Report:
      -------------------
      Total Sales: $${totalSales}

      Item Summary:
      ${itemSummary}
    `;
  }

  private async sendEmail(options: nodemailer.SendMailOptions) {
    return this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_FROM'),
      ...options,
    });
  }
}
