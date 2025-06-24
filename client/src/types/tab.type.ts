import { TabName } from '../enums/app-tab.enum';
import type { Question } from './questions';
import type { UserStatus } from './user-status';

export type AppTab = {
  label: TabName;
  description?: string;
  validation?: (userStatus: UserStatus) => boolean;
  questions?: Question[];
};
