import { SoldierType, HousingStatus, UserStatus, ServiceType, RightSubject } from './user-status'
import { differenceInMonths } from 'date-fns'

const hasHouse = (userStatus: UserStatus) =>
  [HousingStatus.OWNS, HousingStatus.RENTS].includes(userStatus.housing.housingStatus)

export interface Right {
  rightName: string
  details: string
  sourceOrganization: string
  grantingOrganization: string
  eligibleSoldierType: SoldierType[]
  subject: RightSubject
  contactPerson?: string
  isEligible: (userStatus: UserStatus) => boolean
}

export const rightsData: Right[] = [
  {
    rightName: 'Housing Expenses Assistance for Lone Soldiers',
    details:
      'Eligible to receive participation from the IDF in rent and housing maintenance expenses such as: water, gas, and building management fees.\nIf the soldier rents an apartment, they are entitled to participation in rent + related expenses.\nIf the soldier lives in an owned apartment, they are entitled to assistance with related expenses.',
    sourceOrganization: 'Kol Zchut',
    grantingOrganization: 'IDF',
    subject: RightSubject.HOUSING,
    contactPerson: 'Mashakit Tash (Welfare Officer)',
    eligibleSoldierType: [SoldierType.DISTINGUISHED_LONE_SOLDIER, SoldierType.LONE_SOLDIER],
    isEligible: (userStatus: UserStatus) => {
      if (userStatus.housing.housingStatus) {
        return hasHouse(userStatus) && userStatus.service.serviceType === ServiceType.MANDATORY
      }
      return false
    },
  },
  {
    rightName: 'Rent Assistance for New Immigrants',
    details:
      "The total assistance the soldier is entitled to is NIS 402 per month.\nThe eligibility period for 'lone soldier' assistance is for the period they are defined as a 'lone soldier'.\nThe assistance will be given automatically every month during the service (no need to submit an application for assistance).",
    sourceOrganization: 'Kol Zchut',
    grantingOrganization: 'Ministry of Construction and Housing',
    subject: RightSubject.HOUSING,
    contactPerson:
      'For soldiers in active service only: please contact the Ministry of Aliyah and Integration by email at shaulg@moia.gov.il.',
    eligibleSoldierType: [SoldierType.DISTINGUISHED_LONE_SOLDIER],
    isEligible: (userStatus: UserStatus) =>
      userStatus.service.serviceType === ServiceType.MANDATORY,
  },
  {
    rightName: "Permanent Accommodation at Beit HaHayal (Soldier's House) for Lone Soldiers",
    details:
      "Lone soldiers are allowed to stay permanently in one of the 'Association for the Well-being of Soldiers' (Beit HaHayal) facilities.\nAt Beit HaHayal, soldiers will be provided with laundry and food services.\nEligibility for 3 months of accommodation after release.",
    sourceOrganization: 'Kol Zchut',
    grantingOrganization: 'IDF and the Association for the Well-being of Soldiers',
    subject: RightSubject.HOUSING,
    contactPerson: 'Mashakit Tash (Welfare Officer)',
    eligibleSoldierType: [SoldierType.DISTINGUISHED_LONE_SOLDIER, SoldierType.LONE_SOLDIER],
    isEligible: (userStatus: UserStatus) => {
      if (userStatus.housing.housingStatus === HousingStatus.NO_HOUSE) {
        if (userStatus.service.serviceType === ServiceType.MANDATORY) return true
        if (
          userStatus.service.dutyEndDate &&
          differenceInMonths(userStatus.service.dutyEndDate, new Date()) <= 3
        )
          return true
      }
      return false
    },
  },
  {
    rightName: 'Accommodation in Beit HaHayal During Leave for Lone Soldiers',
    details:
      "During regular leave, long weekend leave, and holidays, lone soldiers are entitled to free accommodation in any of the Beit HaHayal facilities located throughout the country.\nDuring leave days, the soldier will receive free meals through Beit HaHayal.\nIn cases where Beit HaHayal does not provide meals, the soldier will be entitled to a per diem allowance through the 'Association for the Well-being of Soldiers'.",
    sourceOrganization: 'Kol Zchut',
    grantingOrganization: 'IDF and the Association for the Well-being of Soldiers',
    eligibleSoldierType: [SoldierType.DISTINGUISHED_LONE_SOLDIER, SoldierType.LONE_SOLDIER],
    subject: RightSubject.OTHER,
    isEligible: (userStatus: UserStatus) =>
      userStatus.service.serviceType === ServiceType.MANDATORY,
  },
  {
    rightName: 'Accommodation in Kibbutzim for Lone Soldiers',
    details:
      "The kibbutzim provide soldiers with a furnished room, kitchenette, shower and toilet, laundry and food services. In addition, there are 'adoptive families' for lone soldiers in the kibbutzim.\nA lone soldier living in a kibbutz receives a kibbutz grant of NIS 150 per month.\nCombat soldiers are entitled to stay in a separate room in the kibbutz.",
    sourceOrganization: 'Kol Zchut',
    grantingOrganization: 'IDF',
    eligibleSoldierType: [SoldierType.DISTINGUISHED_LONE_SOLDIER, SoldierType.LONE_SOLDIER],
    subject: RightSubject.HOUSING,
    isEligible: (userStatus: UserStatus) =>
      userStatus.housing.housingStatus === HousingStatus.NO_HOUSE &&
      userStatus.service.serviceType === ServiceType.MANDATORY,
  },
  {
    rightName: 'ALACH Apartments for Lone Soldiers',
    details:
      'The apartments, located in various communities throughout the country, are furnished and equipped so that soldiers can maintain a proper lifestyle during their military service.\nMost are four-room apartments intended for six soldiers, so that every two soldiers share a room.\nThe soldiers are not required to pay rent or taxes for the apartment, and the Association for the Well-being of Soldiers provides them with laundry and food services.',
    sourceOrganization: 'Kol Zchut',
    grantingOrganization: 'IDF and the Association for the Well-being of Soldiers',
    eligibleSoldierType: [SoldierType.DISTINGUISHED_LONE_SOLDIER, SoldierType.LONE_SOLDIER],
    subject: RightSubject.HOUSING,
    isEligible: (userStatus: UserStatus) =>
      userStatus.service.serviceType === ServiceType.MANDATORY,
  },
  {
    rightName: 'Discount on Electricity Bill',
    details:
      "The discount given each month is 50% for the first 400 kilowatt-hours each month (800 kWh in a bi-monthly bill) at the residential rate, in the home used for the beneficiaries' residence.",
    sourceOrganization: 'Kol Zchut',
    grantingOrganization: 'Israel Electric Corporation',
    eligibleSoldierType: [SoldierType.DISTINGUISHED_LONE_SOLDIER, SoldierType.LONE_SOLDIER],
    subject: RightSubject.HOUSING,
    isEligible: (userStatus: UserStatus) => {
      if (userStatus.housing.housingStatus) {
        return (
          hasHouse(userStatus) &&
          userStatus.service.serviceType === ServiceType.MANDATORY &&
          userStatus.housing.idfRentAssistance
        )
      }
      return false
    },
  },
  {
    rightName: 'Municipal Tax (Arnona) Discount',
    details:
      'Soldiers in mandatory service are entitled to an exemption from paying municipal tax (Arnona) during their military service, and for up to 4 months from the date of their release from mandatory service.\nThe exemption from paying Arnona is given for 70 square meters of the apartment area.\nIn apartments where 5 or more people live (more than 4 people), an exemption is given for 90 square meters of the apartment area.',
    sourceOrganization: 'Kol Zchut',
    grantingOrganization: 'Local Authority',
    eligibleSoldierType: [SoldierType.DISTINGUISHED_LONE_SOLDIER, SoldierType.LONE_SOLDIER],
    subject: RightSubject.HOUSING,
    isEligible: (userStatus: UserStatus) => {
      if (hasHouse(userStatus)) {
        if (
          userStatus.service.serviceType === ServiceType.MANDATORY ||
          (userStatus.service.dutyEndDate &&
            differenceInMonths(userStatus.service.dutyEndDate, new Date()) <= 4)
        )
          return true
      }

      if (userStatus.housing.idfRentAssistance) return true
      return false
    },
  },
]
