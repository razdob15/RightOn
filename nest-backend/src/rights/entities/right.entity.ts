import { Right } from '@righton/shared';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rights')
export class RightEntity implements Omit<Right, 'isEligible'> {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  category: string;

  @Column()
  name: string;

  @Column('text')
  description: string;

  @Column('text', { nullable: true })
  link: string;

  @Column('text', { nullable: true })
  source: string;

  @Column('text', { nullable: true })
  provider: string;

  @Column('text', { nullable: true })
  contact: string;

  @Column('text', { nullable: true })
  eligibility: string;

  @Column('jsonb', { nullable: true })
  conditions: any;

  @Column('text', { nullable: true })
  implementationProcess: string;

  @Column('text', { nullable: true })
  additionalInfo: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
