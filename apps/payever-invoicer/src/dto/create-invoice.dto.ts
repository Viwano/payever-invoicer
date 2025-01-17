import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsDate,
  IsArray,
  ValidateNested,
  Min,
  IsNotEmpty,
  MaxLength,
  Matches,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9\s-]+$/, {
    message:
      'Customer name can only contain letters, numbers, spaces and hyphens',
  })
  @ApiProperty({
    description: 'The customer name',
    example: 'Vahid',
  })
  customer: string;

  @IsNumber()
  @Min(0)
  @ValidateIf(
    (object: any) => {
      return (
        object.amount ===
        object.items.reduce(
          (sum: number, item: any) => sum + item.price * item.quantity,
          0,
        )
      );
    },
    {
      message:
        'Invoice total amount must match the sum of all items (price * quantity)',
    },
  )
  @ApiProperty({
    description: 'The total amount of invoice',
    example: '100',
  })
  amount: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The related invoice number',
    example: 'INV-001',
  })
  reference: string;

  @IsDate()
  @Type(() => Date)
  @ApiProperty({
    description: 'The invoice date',
    example: '2025-01-17T10:00:00.000Z',
  })
  date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
  @ApiProperty({
    description: 'The product items of an invoice',
    example: [
      {
        sku: 'Item 1',
        qt: 1,
        price: 50,
      },
      {
        sku: 'Item 2',
        qt: 1,
        price: 50,
      },
    ],
  })
  items: CreateItemDto[];
}

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  @Min(1)
  qt: number;

  @IsNumber()
  @Min(0)
  price: number;
}
