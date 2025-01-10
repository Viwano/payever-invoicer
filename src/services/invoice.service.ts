import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateInvoiceDto } from './../dto/create-invoice.dto';
import { UpdateInvoiceDto } from './../dto/update-invoice.dto';
import { Invoice } from './../schemas/invoice.schema';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
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
}
