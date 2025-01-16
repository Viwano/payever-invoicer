import { IsNumber, IsArray, ValidateNested } from 'class-validator';

export class ReportDto {
  @IsNumber()
  totalSales: number;

  @IsArray()
  @ValidateNested({ each: true })
  items: Array<{
    sku: string;
    qt: number;
    price: number;
  }>;
}
