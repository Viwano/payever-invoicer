import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { InvoiceService } from './invoice.service';
import { Invoice } from './../schemas/invoice.schema';
import { Types } from 'mongoose';
import { CreateInvoiceDto } from './../dto/create-invoice.dto';
import { ClientProxy } from '@nestjs/microservices';
import { RABBITMQ_CLIENT } from './../microservices/rabbitmq.providers';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let mockInvoiceModel: any;
  let rabbitmqClient: ClientProxy;

  const mockInvoice = {
    _id: new Types.ObjectId(),
    title: 'Test Invoice',
    amount: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockInvoiceModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getModelToken(Invoice.name),
          useValue: mockInvoiceModel,
        },
        {
          provide: RABBITMQ_CLIENT,
          useValue: {
            emit: jest.fn().mockReturnValue({
              toPromise: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
    rabbitmqClient = module.get<ClientProxy>(RABBITMQ_CLIENT);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return an invoice', async () => {
      mockInvoiceModel.create.mockResolvedValue(mockInvoice);

      const result = await service.create({
        customer: 'Test Invoice',
        amount: 100,
      } as CreateInvoiceDto);

      expect(mockInvoiceModel.create).toHaveBeenCalledWith({
        customer: 'Test Invoice',
        amount: 100,
      });
      expect(result).toEqual(mockInvoice);
    });
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const mockQuery = {
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockInvoice]),
      };
      mockInvoiceModel.find.mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(mockInvoiceModel.find).toHaveBeenCalledWith({
        deleted: { $ne: true },
      });
      expect(result).toEqual([mockInvoice]);
    });
  });

  describe('findOne', () => {
    it('should return an invoice if found', async () => {
      mockInvoiceModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockInvoice),
      });

      const result = await service.findOne(mockInvoice._id.toString());

      expect(mockInvoiceModel.findById).toHaveBeenCalledWith(mockInvoice._id);
      expect(result).toEqual(mockInvoice);
    });

    it('should throw an error if not found', async () => {
      mockInvoiceModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.findOne(new Types.ObjectId().toString()),
      ).rejects.toThrowError('Invoice with ID');
    });
  });

  describe('update', () => {
    it('should update and return the invoice', async () => {
      mockInvoiceModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockInvoice),
      });

      const result = await service.update(mockInvoice._id.toString(), {
        title: 'Updated Invoice',
      } as any);

      expect(mockInvoiceModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockInvoice._id,
        { $set: { title: 'Updated Invoice' } },
        { new: true },
      );
      expect(result).toEqual(mockInvoice);
    });

    it('should throw an error if the invoice is not found', async () => {
      mockInvoiceModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.update(new Types.ObjectId().toString(), {
          customer: 'Updated',
        }),
      ).rejects.toThrowError('Invoice with ID');
    });
  });

  describe('remove', () => {
    it('should delete and return the invoice', async () => {
      mockInvoiceModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockInvoice),
      });

      const result = await service.remove(mockInvoice._id.toString());

      expect(mockInvoiceModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockInvoice._id,
        { $set: { deleted: true } },
        { new: true },
      );
      expect(result).toEqual(mockInvoice);
    });

    it('should throw an error if the invoice is not found', async () => {
      mockInvoiceModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        service.remove(new Types.ObjectId().toString()),
      ).rejects.toThrowError('Invoice with ID');
    });
  });
});
