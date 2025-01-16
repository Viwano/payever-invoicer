import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './../services/invoice.service';
import { CreateInvoiceDto } from './../dto/create-invoice.dto';
import { UpdateInvoiceDto } from './../dto/update-invoice.dto';
import { v4 as uuidv4 } from 'uuid';

describe('InvoiceController (e2e)', () => {
  let app: INestApplication;
  let mockInvoiceService: Partial<InvoiceService>;

  const mockInvoice = {
    _id: '63c918fc08f7b9a18c4c7e0a',
    customer: 'Test Invoice',
    amount: 100,
    date: new Date().toISOString(),
  };

  beforeEach(async () => {
    mockInvoiceService = {
      create: jest.fn().mockResolvedValue(mockInvoice),
      findAll: jest.fn().mockResolvedValue([mockInvoice]),
      findOne: jest.fn().mockResolvedValue(mockInvoice),
      update: jest.fn().mockResolvedValue({
        ...mockInvoice,
        customer: 'Updated Invoice',
      }),
      remove: jest.fn().mockResolvedValue(mockInvoice),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [
        {
          provide: InvoiceService,
          useValue: mockInvoiceService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/POST invoices (create)', async () => {
    const createInvoiceDto: CreateInvoiceDto = {
      customer: 'Test Invoice',
      amount: 100,
      reference: uuidv4(),
      date: new Date(),
      items: [
        {
          sku: 'Item 1',
          qt: 1,
          price: 50.0,
        },
        {
          sku: 'Item 2',
          qt: 1,
          price: 50.0,
        },
      ],
    };

    const response = await request(app.getHttpServer())
      .post('/invoices')
      .send(createInvoiceDto)
      .expect(201);

    expect(response.body).toEqual(mockInvoice);
    expect(mockInvoiceService.create).toHaveBeenCalled();
  });

  it('/GET invoices (findAll)', async () => {
    const response = await request(app.getHttpServer())
      .get('/invoices')
      .expect(200);

    expect(response.body).toEqual([mockInvoice]);
    expect(mockInvoiceService.findAll).toHaveBeenCalled();
  });

  it('/GET invoices/:id (findOne)', async () => {
    const id = '63c918fc08f7b9a18c4c7e0a';

    const response = await request(app.getHttpServer())
      .get(`/invoices/${id}`)
      .expect(200);

    expect(response.body).toEqual(mockInvoice);
    expect(mockInvoiceService.findOne).toHaveBeenCalledWith(id);
  });

  it('/PATCH invoices/:id (update)', async () => {
    const id = '63c918fc08f7b9a18c4c7e0a';
    const updateInvoiceDto: UpdateInvoiceDto = {
      customer: 'Updated Invoice',
      amount: 200,
    };

    const response = await request(app.getHttpServer())
      .patch(`/invoices/${id}`)
      .send(updateInvoiceDto)
      .expect(200);

    expect(response.body).toEqual({
      ...mockInvoice,
      customer: 'Updated Invoice',
    });
    expect(mockInvoiceService.update).toHaveBeenCalledWith(
      id,
      updateInvoiceDto,
    );
  });

  it('/DELETE invoices/:id (remove)', async () => {
    const id = '63c918fc08f7b9a18c4c7e0a';

    const response = await request(app.getHttpServer())
      .delete(`/invoices/${id}`)
      .expect(200);

    expect(response.body).toEqual(mockInvoice);
    expect(mockInvoiceService.remove).toHaveBeenCalledWith(id);
  });
});
