import { SoldierType, ServiceType, ActivityLevel, HousingStatus } from '../enums';

export type User = {
  personal: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
  general: {
    birthDate?: Date;
    country?: string;
    city?: string;
  };
  aliyah: {
    aliyahDate?: number;
    aliyahCountry?: string;
    isOleh?: boolean;
    parentsAbroad?: string;
  };
  army: {
    enlistDate?: Date;
    releaseDate?: Date;
    serviceType?: ServiceType;
    monthsServed?: number;
    activityLevel?: ActivityLevel;
    isCombat?: boolean;
    soldierType?: SoldierType;
  };
  housing: {
    housingStatus?: HousingStatus;
    receivesArmyAssistance?: boolean;
    distanceToBase?: number;
    currentHousing?: string;
  };
};
