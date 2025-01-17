import { InvoiceService } from '../services/invoice.service';
import { CustomInvoiceValidator } from '../common/validators/invoice.validator';

export const appProviders = [InvoiceService, CustomInvoiceValidator];
