export enum ServiceType {
  MANDATORY = "MANDATORY",
  OPTIONAL = "OPTIONAL",
  VOLUNTARY = "VOLUNTARY",
  NATIONAL_SERVICE_VOLUNTARY = "NATIONAL_SERVICE_VOLUNTARY",
}

export enum SoldierType {
  LONE_SOLDIER = 'LONE_SOLDIER',
  DISTINGUISHED_LONE_SOLDIER = 'DISTINGUISHED_LONE_SOLDIER',
}

export enum HousingStatus {
  OWNER = "OWNER",
  RENTER = "RENTER",
  NONE = "NONE",
}

export enum ActivityLevel {
  ALEF = "ALEF",
  BET = "BET",
  GIMEL = "GIMEL",
  DALET = "DALET",
}


export enum FinancialStatus {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}


export type Solder = {
  general: {
    age: number;
    birthDate?: string;
    birthCountry?: string;
  }
  aliyah: {
    originCountry?: string;
    monthsSinceAliyah?: number;
  }
  housing: { housingStatus: HousingStatus; idfRentAssistance: boolean; };
  financialStatus?: FinancialStatus
  isInjured?: boolean;
  service: {
    soldierType?: SoldierType;
    serviceType: ServiceType;
    activityLevel?: ActivityLevel;
    isCombat: boolean;
    monthsInService?: number;
  }
  discharge: {
    monthsSinceDischarge?: number;
  }
}