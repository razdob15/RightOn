import type { User } from './user.type';
import { RightSubject } from '../enums/right-subject.enum';
import { SoldierType } from '../enums/soldier-type.enum';

export type Right = {
  rightName: string;
  details: string;
  sourceOrganization: string;
  grantingOrganization: string;
  eligibleSoldierType: SoldierType[];
  subject: RightSubject;
  contactPerson?: string;
  isEligible: (user: User) => boolean;
};
