import { Injectable } from '@nestjs/common';
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
    const createdInvoice = new this.invoiceModel(createInvoiceDto);
    return createdInvoice.save();
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoiceModel.find().exec();
  }

  async findOne(id: string): Promise<Invoice> {
    return this.invoiceModel.findById(new Types.ObjectId(id)).exec();
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<Invoice> {
    return this.invoiceModel
      .findByIdAndUpdate(
        new Types.ObjectId(id),
        { $set: updateInvoiceDto },
        { new: true }, // returns the updated document
      )
      .exec();
  }

  async remove(id: string): Promise<Invoice> {
    return this.invoiceModel.findByIdAndDelete(new Types.ObjectId(id)).exec();
  }
}
