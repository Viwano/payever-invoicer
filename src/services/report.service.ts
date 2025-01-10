import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class ReportService {
  @MessagePattern('generate_report') // Listen for the "generate_report" event
  handleGeneratedReport(report: any) {
    console.log('Received generated report:', report);
    // Process the report (e.g., store in a database, send via email, etc.)
  }
}
