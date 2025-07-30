import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  IsEnum,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import {
  SoldierType,
  ServiceType,
  HousingStatus,
  ActivityLevel,
  User,
} from '@righton/shared';

// DTOs matching SharedUser structure
class PersonalDto {
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
}

class GeneralDto {
  @IsDateString()
  @IsOptional()
  birthDate?: Date;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsEnum(SoldierType)
  @IsOptional()
  soldierType?: SoldierType;
}

class AliyahDto {
  @IsNumber()
  @IsOptional()
  aliyahYear?: number;

  @IsString()
  @IsOptional()
  aliyahCountry?: string;

  @IsBoolean()
  @IsOptional()
  isOleh?: boolean;

  @IsString()
  @IsOptional()
  parentsAbroad?: string;
}

class ArmyDto {
  @IsDateString()
  @IsOptional()
  enlistDate?: Date;

  @IsDateString()
  @IsOptional()
  releaseDate?: Date;

  @IsEnum(ServiceType)
  @IsOptional()
  serviceType?: ServiceType;

  @IsNumber()
  @IsOptional()
  monthsServed?: number;

  @IsEnum(ActivityLevel)
  @IsOptional()
  activityLevel?: ActivityLevel;

  @IsBoolean()
  @IsOptional()
  isCombat?: boolean;
}

class HousingDto {
  @IsEnum(HousingStatus)
  @IsOptional()
  housingStatus?: HousingStatus;

  @IsBoolean()
  @IsOptional()
  receivesArmyAssistance?: boolean;

  @IsNumber()
  @IsOptional()
  distanceToBase?: number;

  @IsString()
  @IsOptional()
  currentHousing?: string;
}

export class CreateUserDto implements User {
  @ValidateNested()
  @Type(() => PersonalDto)
  @IsNotEmpty()
  personal: PersonalDto;

  @ValidateNested()
  @Type(() => GeneralDto)
  @IsOptional()
  general: GeneralDto;

  @ValidateNested()
  @Type(() => AliyahDto)
  @IsOptional()
  aliyah: AliyahDto;

  @ValidateNested()
  @Type(() => ArmyDto)
  @IsOptional()
  army: ArmyDto;

  @ValidateNested()
  @Type(() => HousingDto)
  @IsOptional()
  housing: HousingDto;
}
