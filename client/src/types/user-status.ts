
export enum SoldierType {
  LONE_SOLDIER = "LONE_SOLDIER",
  DISTINGUISHED_LONE_SOLDIER = "DISTINGUISHED_LONE_SOLDIER",
}

export enum ServiceType {
  MANDATORY = "MANDATORY",
  PERMANENT = "PERMANENT",
  VOLUNTEER = "VOLUNTEER",
}

export enum HousingStatus {
  RENTS = "RENTS",
  OWNS = "OWNS",
  NO_HOUSE = "NO_HOUSE",
}

export type UserStatus = {
  soldierType: SoldierType,
  service: {
    serviceType: ServiceType,
    enlistmentDate: Date,
    dutyEndDate?: Date,
  },
  housing: {
    housingStatus: HousingStatus,
    idfRentAssistance: boolean,
  }
}