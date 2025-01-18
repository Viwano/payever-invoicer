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

  // Create spies for logger methods
  const logSpy = jest.spyOn(Logger.prototype, 'log');
  const errorSpy = jest.spyOn(Logger.prototype, 'error');

  beforeEach(async () => {
    // Clear all mocks before each test
    jest.clearAllMocks();

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
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    emailService = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleGeneratedReport', () => {
    const mockReport: ReportDto = {
      date: '2025-01-17',
      totalSales: 100,
      items: {
        'Item 1': 1,
        'Item 2': 1,
      },
    };

    it('should log the received report', async () => {
      await service.handleGeneratedReport(mockReport);
      expect(logSpy).toHaveBeenCalledWith(
        `Received report: ${JSON.stringify(mockReport)}`
      );
    });

    it('should generate the correct email content', () => {
      const emailContent = service['generateEmailContent'](mockReport);
      expect(emailContent).toContain('Daily Sales Report');
      expect(emailContent).toContain('Total Sales: $100');
      expect(emailContent).toContain('Item: Item 1, Quantity Sold: 1');
      expect(emailContent).toContain('Item: Item 2, Quantity Sold: 1');
    });

    it('should send an email with the correct content and recipient', async () => {
      await service.handleGeneratedReport(mockReport);
      const emailContent = service['generateEmailContent'](mockReport);
      expect(emailService.sendEmail).toHaveBeenCalledWith({
        to: 'recipient@example.com',
        subject: 'Daily Sales Report',
        text: emailContent,
      });
    });

    it('should log success after sending the email', async () => {
      await service.handleGeneratedReport(mockReport);
      
      // Find the specific call for 'Email sent successfully'
      const successCall = logSpy.mock.calls.find(
        call => call[0] === 'Email sent successfully'
      );
      expect(successCall).toBeTruthy();
      expect(successCall[0]).toBe('Email sent successfully');
    });

    it('should log an error if email sending fails', async () => {
      const error = new Error('Email sending failed');
      jest.spyOn(emailService, 'sendEmail').mockRejectedValue(error);
      
      await service.handleGeneratedReport(mockReport);
      
      expect(errorSpy).toHaveBeenCalledWith(
        'Failed to send email',
        {
          error,
        }
      );
    });
  });
});