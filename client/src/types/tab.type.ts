import type { User } from '@righton/shared';
import { TabName } from '../enums/app-tab.enum';
import type { Question } from './questions';

export type AppTab = {
  label: TabName;
  description?: string;
  validation?: (user: User) => boolean;
  questions?: Question[];
};
