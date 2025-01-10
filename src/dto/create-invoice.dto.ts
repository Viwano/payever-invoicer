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

export class CreateInvoiceDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9\s-]+$/, {
    message:
      'Customer name can only contain letters, numbers, spaces and hyphens',
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
  amount: number;

  @IsString()
  @IsNotEmpty()
  reference: string;

  @IsDate()
  @Type(() => Date)
  date: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateItemDto)
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
