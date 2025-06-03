import { TabName } from "../enums/app-tab.enum"
import { Question } from "./questions";
import { UserStatus } from "./user-status";

export type AppTab = {
  label: TabName;
  validation: (userStatus: UserStatus) => boolean;
  questions?: Question[];
}