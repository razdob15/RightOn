import { ActivityLevel } from './../../../../archive/old-backend/src/types/types';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { SoldierType, ServiceType, HousingStatus } from '@righton/shared';
import { Transform } from 'class-transformer';
import { differenceInMonths } from 'date-fns';

@Entity('users')
export class User {
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

  @Column({ nullable: true })
  nationality: string;

  @Column({ default: true })
  isActive: boolean;

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

  birthCountry: string;
  livingCity: string;
  aliyahYear: string;
  aliyahCountry: string;
  isOleh: boolean;
  parentsAbroad: string;
  enlistDate: Date;
  releaseDate: Date;
  serviceType: ServiceType;
  activityLevel: ActivityLevel;
  isCombat: boolean;
  housingStatus: HousingStatus;
  receivesArmyAssistance: boolean;
  distanceToBase: number;
  currentHousing: string;

  @Transform(({ obj }: { obj: User }) => {
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
  @Transform(({ obj }: { obj: User }) => {
    return obj.birthDate
      ? new Date().getFullYear() - new Date(obj.birthDate).getFullYear()
      : 0;
  })
  age: number;
}
