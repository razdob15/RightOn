import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { SoldierType, ServiceType, HousingStatus } from '@righton/shared';

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
  dateOfBirth: Date;

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

  @Column('jsonb', { nullable: true })
  service: {
    serviceType: ServiceType;
    enlistmentDate?: number;
    dutyEndDate?: number;
  };

  @Column('jsonb', { nullable: true })
  housing: {
    housingStatus: HousingStatus;
    idfRentAssistance: boolean;
  };

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
