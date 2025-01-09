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
  name: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}
