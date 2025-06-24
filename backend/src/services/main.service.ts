import fs from "fs";
import csvParser from "csv-parser";
import _ from "lodash";
import { ActivityLevel, FinancialStatus, HousingStatus, ServiceType, Solder, SoldierType } from "../types/types";
import { Request, Response } from 'express';


// קריאה של קובץ ה-CSV
const csvFilePath = "./data.csv";


// Function to read and parse CSV using csv-parser
const parseCSV = async (filePath: string): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

const isConditionMatch = (user: any, condition: any): boolean => {
  return Object.keys(condition).every(key => {
    if (typeof condition[key] === "object" && condition[key] !== null) {
      if ("lte" in condition[key]) {
        return user[key] !== undefined && user[key] <= condition[key]["lte"];
      }
      if ("gte" in condition[key]) {
        return user[key] !== undefined && user[key] >= condition[key]["gte"];
      }
      return isConditionMatch(user[key], condition[key]); // Recursively check nested objects
    } else {
      return user[key] === condition[key]; // Direct comparison for primitive values
    }
  });
};


const checkEligibility = (user: Solder, rights: any[]): any[] => {
  const relevantRights = rights.filter(right => {
    try {
      const conditions: any[] = JSON.parse(right["תנאים במבנה חדש"]);
      if (!conditions || conditions.length === 0) {
        return true; // If no conditions, the right is applicable
      }

      return conditions.some((cond: any) => isConditionMatch(user, cond));

    } catch (error) {
      console.log(`Problem with '${right['שם הזכות']}':  ${right["תנאים במבנה חדש"]}`);
      return false;
    }
  });
  return relevantRights;
};

export const mainTest = async (req: Request, res: Response): Promise<void> => {

  // ביצוע בדיקה
  const rightsArray = await parseCSV(csvFilePath);
  const user: Solder = {
    general: {
      age: 21,
      birthDate: undefined,
      birthCountry: "Israel"
    },
    aliyah: {
      originCountry: "Israel",
      monthsSinceAliyah: 1
    },
    housing: {
      housingStatus: HousingStatus.OWNER,
      idfRentAssistance: true
    },
    service: {
      soldierType: SoldierType.DISTINGUISHED_LONE_SOLDIER,
      serviceType: ServiceType.MANDATORY,
      activityLevel: ActivityLevel.ALEF,
      isCombat: true,
      monthsInService: 10
    },
    discharge: {
      monthsSinceDischarge: undefined
    },
    financialStatus: FinancialStatus.LOW
  };


  const eligibleRights = checkEligibility(user, rightsArray);

  res.send(eligibleRights);
}