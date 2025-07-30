import { SoldierType, type User } from '@righton/shared';
import { UserEntity } from '../users/entities/user.entity';
import { differenceInMonths } from 'date-fns';
export type {
  SoldierType,
  ServiceType,
  HousingStatus,
  RightSubject,
} from '@righton/shared';

export const isUserMatchingCondition = (user: UserEntity, condition: User) => {
  if (!user || !condition) {
    return false;
  }
  for (const key in condition) {
    // Implement your condition logic here
    return true; // Placeholder return value
  }
};

const customTransformers = {
  monthsSinceDischarge: (army: User['army']) => {
    if (!army?.releaseDate) return -1;
    const releaseDate = new Date(army.releaseDate);
    const currentDate = new Date();
    const monthsDifference = differenceInMonths(currentDate, releaseDate);
    return monthsDifference;
  },
};

export const isConditionMatch = (user: object, condition: object): boolean => {
  return Object.keys(condition).every((key) => {
    const userValue = user[key] ?? customTransformers[key]?.(user);
    if (userValue === undefined) {
      console.log('UNKNOWN KEY', key);
      return condition[key] === undefined;
    }

    const customConditionByKey: Record<string, boolean | undefined> = {
      monthsSinceDischarge: userValue === -1 ? false : undefined,
      soldierType:
        condition['soldierType'] === SoldierType.LONE_SOLDIER
          ? [
              SoldierType.LONE_SOLDIER,
              SoldierType.DISTINGUISHED_LONE_SOLDIER,
            ].includes(userValue)
          : undefined,
    };

    if (customConditionByKey[key] !== undefined) {
      return customConditionByKey[key];
    }

    if (typeof condition[key] === 'object') {
      if ('lte' in condition[key]) {
        return userValue <= condition[key]['lte'];
      }
      if ('gte' in condition[key]) {
        return userValue >= condition[key]['gte'];
      }

      return isConditionMatch(userValue, condition[key]); // Recursively check nested objects
    } else {
      return userValue === condition[key]; // Direct comparison for primitive values
    }
  });
};
