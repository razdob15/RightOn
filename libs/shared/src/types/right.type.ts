import type { User } from './user.type';

export type Right = {
  id: number;
  name: string;
  description: string;
  link: string;
  source: string;
  contact: string;
  conditions: any;
  implementationProcess: string;
  additionalInfo: string;
  createdAt: Date;
  updatedAt: Date;
  provider: string;
  eligibility: string;
  category: string;
  isEligible: (user: User) => boolean;
};
