import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  IsEnum,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SoldierType, ServiceType, HousingStatus } from '@righton/shared';

class ServiceDto {
  @IsEnum(ServiceType)
  serviceType: ServiceType;

  @IsOptional()
  enlistmentDate?: number;

  @IsOptional()
  dutyEndDate?: number;
}

class HousingDto {
  @IsEnum(HousingStatus)
  housingStatus: HousingStatus;

  @IsBoolean()
  idfRentAssistance: boolean;
}

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @IsOptional()
  nationality?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsEnum(SoldierType)
  @IsOptional()
  soldierType?: SoldierType;

  @ValidateNested()
  @Type(() => ServiceDto)
  @IsOptional()
  service?: ServiceDto;

  @ValidateNested()
  @Type(() => HousingDto)
  @IsOptional()
  housing?: HousingDto;
}
