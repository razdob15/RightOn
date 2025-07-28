import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRightDto } from './create-right.dto';

export class BulkCreateRightDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRightDto)
  rights: CreateRightDto[];
}

export class SearchRightsDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  search?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  category?: string;
}
