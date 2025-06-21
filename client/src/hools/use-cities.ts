import axios from "axios";
import { useEffect, useState } from "react";

import { GOV_DATA_API, GOV_DATA_SOURCES } from "../constants/gov-data.const";


export const useCities = () => {
  const [israelHebrewCities, setIsraelHebrewCities] = useState<string[]>([]);


  useEffect(() => {
    const fetchCities = async () => {
      const citiesResponse = await axios.get(
        GOV_DATA_API,
        {
          params: {
            resource_id: GOV_DATA_SOURCES['cities'],
          },
        }
      );

      const allCitiesNames = citiesResponse?.data?.result?.records?.map((rec: Record<string, string>) => rec["שם_ישוב"]) || [];
      setIsraelHebrewCities(allCitiesNames);
    };
    fetchCities();
  }, []);

  return { israelHebrewCities }
}