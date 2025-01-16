import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './../services/report-consumer.service';
import { EmailService } from './email.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ReportDto } from './../dto/report.dto';

describe('ReportService', () => {
  let service: ReportService;
  let emailService: EmailService;
  let configService: ConfigService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn().mockResolvedValue(true),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('recipient@example.com'),
          },
        },
        {
          provide: Logger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    emailService = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
    logger = module.get<Logger>(Logger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleGeneratedReport', () => {
    const mockReport: ReportDto = {
      totalSales: 1000,
      items: [
        { sku: '123', qt: 10, price: 100 },
        { sku: '456', qt: 5, price: 50 },
      ],
    };

    it('should log the received report', async () => {
      await service.handleGeneratedReport(mockReport);
      expect(logger.log).toHaveBeenCalledWith(
        `Received report: ${JSON.stringify(mockReport)}`,
      );
    });

    it('should generate the correct email content', async () => {
      const emailContent = service['generateEmailContent'](mockReport);
      expect(emailContent).toContain('Daily Sales Report');
      expect(emailContent).toContain('Total Sales: $1000');
      expect(emailContent).toContain(
        'SKU: 123, Quantity Sold: 10, Total: $100',
      );
      expect(emailContent).toContain('SKU: 456, Quantity Sold: 5, Total: $50');
    });

    it('should log success after sending the email', async () => {
      await service.handleGeneratedReport(mockReport);
      expect(logger.log).toHaveBeenCalledWith('Email sent successfully');
    });

    it('should log an error if email sending fails', async () => {
      jest
        .spyOn(emailService, 'sendEmail')
        .mockRejectedValue(new Error('Email sending failed'));

      await service.handleGeneratedReport(mockReport);

      expect(logger.error).toHaveBeenCalledWith('Failed to process report', {
        error: new Error('Email sending failed'),
      });
    });
  });
});
