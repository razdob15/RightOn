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
    soldierType?: SoldierType;
  };
  aliyah: {
    aliyahYear?: number;
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
  };
  housing: {
    housingStatus?: HousingStatus;
    receivesArmyAssistance?: boolean;
    distanceToBase?: number;
    currentHousing?: string;
  };
};
