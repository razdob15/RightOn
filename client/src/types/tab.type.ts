import { TabName } from '../enums/app-tab.enum';
import { Question } from './questions';
import { Right } from './rights';
import { UserStatus } from './user-status';

export type AppTab = {
  label: TabName;
  description?: string;
  validation?: (userStatus: UserStatus) => boolean;
  questions?: Question[];
};
