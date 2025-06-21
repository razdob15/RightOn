import axios from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";


import { Stack, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField, Autocomplete, Typography } from "@mui/material";
import { MyDatePicker } from "./dates/MyDatePicker";
import dayjs, { Dayjs } from "dayjs";
import { useCountries } from "../hools/use-countries";
import { useCities } from "../hools/use-cities";






export const GeneralQuestions: React.FC<{
  onSubmit: () => void,
  onValidityChange: (valid: boolean) => void
}> = ({ onSubmit, onValidityChange }) => {
  const { hebrewCountries: allCountries } = useCountries()
  const { israelHebrewCities: allCities } = useCities()
  const [birthDate, setBirthDate] = useState<Dayjs | null>(null);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [soldierType, setSoldierType] = useState("");


  // Validate required fields
  useEffect(() => {
    const valid = !!birthDate && !!country && !!city && !!soldierType;
    onValidityChange(valid);
  }, [birthDate, country, city, soldierType, onValidityChange]);

  return (
    <Stack
      component="form"
      onSubmit={e => { e.preventDefault(); onSubmit(); }}
      alignContent={'start'}
      alignItems={'start'}
      sx={{
        gap: 3,
        maxWidth: '70%',
      }}
    >

      <Typography variant="body1" gutterBottom>
        בחלק זה תתבקש למלא פרטים כלליים אודותיך.
        המידע ישמש להתאמת השירות לצרכיך.
        אנא מלא את כל השדות הנדרשים בצורה מדויקת.
      </Typography>

      <MyDatePicker
        minDate={dayjs("1980")}
        required
        label="מהו תאריך הלידה שלך?"
        value={birthDate}
        onChange={setBirthDate}
        views={['year', 'month', 'day']}
      />

      <Autocomplete
        fullWidth
        options={allCountries}
        value={allCountries.find(opt => opt.value === country) || null}
        onChange={(_, val) => setCountry(val ? val.value : "")}
        renderInput={(params) => <TextField {...params} required
          label="באיזו מדינה נולדת?"
          variant="outlined"
        />}
        noOptionsText="לא נמצאו מדינות"

      />

      <Autocomplete
        fullWidth
        options={allCities}
        value={city}
        onChange={(_, val) => setCity(val || "")}
        renderInput={(params) => <TextField {...params} required
          label="מהי  עיר מגורך? (בישראל)"
          variant="outlined" />}
        noOptionsText="לא נמצאו ערים"
      />

      <FormControl component="fieldset" required>
        <FormLabel component="legend">
          האם אתה חייל בודד או חייל בודד מובהק?
        </FormLabel>
        <RadioGroup
          row
          value={soldierType}
          onChange={e => setSoldierType(e.target.value)}
        >
          <FormControlLabel value="recognized" control={<Radio />} label="חייל בודד מובהק" />
          <FormControlLabel value="lone" control={<Radio />} label="חייל בודד" />
          <FormControlLabel value="none" control={<Radio />} label="איני חייל בודד" />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
}