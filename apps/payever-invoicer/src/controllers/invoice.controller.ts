import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateInvoiceDto } from './../dto/create-invoice.dto';
import { InvoiceService } from './../services/invoice.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Get()
  @ApiOperation({ summary: 'shows the list of all created invoices' })
  findAll() {
    return this.invoiceService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'finds the specific invoice with provided id' })
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create invoice' })
  create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.create(createInvoiceDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'modify an already created invoice' })
  update(@Param('id') id: string, @Body() createInvoiceDto: CreateInvoiceDto) {
    return this.invoiceService.update(id, createInvoiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'remove an invoice' })
  remove(@Param('id') id: string) {
    return this.invoiceService.remove(id);
  }
}
