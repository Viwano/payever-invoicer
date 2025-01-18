import { Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateInvoiceDto } from './../dto/create-invoice.dto';
import { UpdateInvoiceDto } from './../dto/update-invoice.dto';
import { Invoice } from './../schemas/invoice.schema';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ClientProxy } from '@nestjs/microservices';
import { RABBITMQ_CLIENT } from './../modules/rabbitmq.module';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);

  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @Inject(RABBITMQ_CLIENT) private readonly client: ClientProxy,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceModel.create(createInvoiceDto);
  }

  async findAll(limit = 10, skip = 0): Promise<Invoice[]> {
    return this.invoiceModel
      .find({ deleted: { $ne: true } })
      .limit(limit)
      .skip(skip)
      .exec();
  }

  async findOne(id: string): Promise<Invoice> {
    const invoice = await this.invoiceModel
      .findById(new Types.ObjectId(id))
      .exec();
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    const updatedInvoice = await this.invoiceModel
      .findByIdAndUpdate(
        new Types.ObjectId(id),
        { $set: updateInvoiceDto },
        { new: true },
      )
      .exec();
    if (!updatedInvoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return updatedInvoice;
  }

  async remove(id: string): Promise<Invoice> {
    const deletedInvoice = await this.invoiceModel
      .findByIdAndUpdate(
        new Types.ObjectId(id),
        { $set: { deleted: true } },
        { new: true },
      )
      .exec();

    if (!deletedInvoice) {
      throw new Error(`Invoice with ID ${id} not found`);
    }

    return deletedInvoice;
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async generateDailyReport() {
    this.logger.log('Generating daily sales report...');

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const invoices = await this.invoiceModel
        .find({
          date: { $gte: startOfDay, $lte: endOfDay },
          processed: false,
        })
        .exec();

      if (invoices.length === 0) {
        this.logger.log('No new invoices to process.');
        return;
      }

      let totalSales = 0;
      const itemSummary: Record<string, number> = {};

      invoices.forEach((invoice) => {
        totalSales += invoice.amount;

        invoice.items.forEach((item) => {
          if (!itemSummary[item.sku]) {
            itemSummary[item.sku] = 0;
          }
          itemSummary[item.sku] += item.qt;
        });
      });

      const report = {
        date: startOfDay.toISOString().split('T')[0],
        totalSales,
        items: itemSummary,
      };
      this.logger.log('Daily Sales Report:', report);

      await this.client.emit('daily', report);

      await this.invoiceModel.updateMany(
        { _id: { $in: invoices.map((invoice) => invoice._id) } },
        { $set: { processed: true } },
      );
      this.logger.log(`${invoices.length} invoices marked as processed.`);
    } catch (error) {
      this.logger.error('Error generating daily sales report', error.stack);
    }
  }
}
