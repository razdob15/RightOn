import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import {
  SoldierType,
  ServiceType,
  HousingStatus,
  ActivityLevel,
} from '@righton/shared';
import { Transform } from 'class-transformer';
import { differenceInMonths } from 'date-fns';
import { IsNumber } from 'class-validator';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'date', nullable: true })
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: SoldierType,
    nullable: true,
  })
  soldierType: SoldierType;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ nullable: true })
  livingCity: string;

  @Column({ nullable: true })
  @IsNumber()
  aliyahYear: number;

  @Column({ nullable: true })
  aliyahCountry: string;

  @Column({ default: false })
  isOleh: boolean;

  @Column({ nullable: true })
  parentsAbroad: string;

  @Column({ type: 'date', nullable: true })
  enlistDate: Date;

  @Column({ type: 'date', nullable: true })
  releaseDate: Date;

  @Column({
    type: 'enum',
    enum: ServiceType,
    nullable: true,
  })
  serviceType: ServiceType;

  @Column({
    type: 'enum',
    enum: ActivityLevel,
    nullable: true,
  })
  activityLevel: ActivityLevel;

  @Column({ default: false })
  isCombat: boolean;

  @Column({
    type: 'enum',
    enum: HousingStatus,
    nullable: true,
  })
  housingStatus: HousingStatus;

  @Column({ default: false })
  receivesArmyAssistance: boolean;

  @Column({ type: 'int', nullable: true })
  distanceToBase: number;

  @Column({ nullable: true })
  currentHousing: string;

  // Computed properties (not stored in database)
  @Transform(({ obj }: { obj: UserEntity }) => {
    if (!obj.enlistDate) return 0;
    const today = new Date();
    const enlistDate = new Date(obj.enlistDate);
    if (obj.releaseDate && obj.releaseDate < today) {
      const releaseDate = new Date(obj.releaseDate);
      return differenceInMonths(releaseDate, enlistDate);
    }
    return differenceInMonths(today, enlistDate);
  })
  monthsServed: number;

  @Transform(({ obj }: { obj: UserEntity }) => {
    return obj.birthDate
      ? new Date().getFullYear() - new Date(obj.birthDate).getFullYear()
      : 0;
  })
  age: number;
}
