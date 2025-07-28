import { UserStatus } from '@righton/shared';
import { User } from '../users/entities/user.entity';
export type {
  SoldierType,
  ServiceType,
  HousingStatus,
  RightSubject,
  UserStatus,
} from '@righton/shared';

export const isUserMatchingCondition = (user: User, condition: UserStatus) => {
  if (!user || !condition) {
    return false;
  }
  for (const key in condition) {
    // Implement your condition logic here
    return true; // Placeholder return value
  }
};

const isConditionMatch = (user: object, condition: object): boolean => {
  return Object.keys(condition).every((key) => {
    if (condition[key] === undefined || condition[key] === null) {
      return true; // If the condition value is undefined or null, we consider it a match
    }

    if (key === 'soldierType') {
      // Currently all the users are lone soldiers
      return true;
    }

    if (typeof condition[key] === 'object') {
      if ('lte' in condition[key]) {
        return user[key] !== undefined && user[key] <= condition[key]['lte'];
      }
      if ('gte' in condition[key]) {
        return user[key] !== undefined && user[key] >= condition[key]['gte'];
      }
      return isConditionMatch(user[key], condition[key]); // Recursively check nested objects
    } else {
      return user[key] === condition[key]; // Direct comparison for primitive values
    }
  });
};
