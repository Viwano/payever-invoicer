import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class ReportDto {
  @IsNotEmpty()
  @IsString()
  date: string;

  @IsNotEmpty()
  @IsNumber()
  totalSales: number;

  @IsNotEmpty()
  items: Record<string, number>;
}
