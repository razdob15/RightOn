import countries from "i18n-iso-countries";
import heLocale from "i18n-iso-countries/langs/he.json";

export const useCountries = () => {
  countries.registerLocale(heLocale);

  return {
    hebrewCountries: Object.entries(countries.getNames("he", { select: "official" }))
      .map(([code, name]) => ({ value: code, label: name }))
  }
}