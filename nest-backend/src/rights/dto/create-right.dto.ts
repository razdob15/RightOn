import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateRightDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsString()
  eligibility?: string;

  @IsOptional()
  conditions?: any;

  @IsOptional()
  @IsString()
  implementationProcess?: string;

  @IsOptional()
  @IsString()
  additionalInfo?: string;
}
