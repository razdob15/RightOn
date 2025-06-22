import React, { useEffect, useState } from 'react';
import {
  Stack,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Autocomplete,
  Typography,
} from '@mui/material';
import { MyDatePicker } from './dates/MyDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useCountries } from '../hools/use-countries';
import { useCities } from '../hools/use-cities';
import { FormQuestionLabels, FormQuestionsProps } from '../types/formQuestionsProps.type';

const LABEL_KEY = FormQuestionLabels.GENERAL;

export const GeneralQuestions: React.FC<FormQuestionsProps> = ({
  onSubmit,
  onValidityChange,
  answers,
  setAnswers,
}) => {
  const { hebrewCountries: allCountries } = useCountries();
  const { israelHebrewCities: allCities } = useCities();
  const [birthDate, setBirthDate] = useState(answers?.birthDate ? dayjs(answers.birthDate) : null);
  const [country, setCountry] = useState(answers?.country || '');
  const [city, setCity] = useState(answers?.city || '');
  const [soldierType, setSoldierType] = useState(answers?.soldierType || '');

  useEffect(() => {
    setAnswers(LABEL_KEY, {
      birthDate: birthDate ? birthDate.toISOString() : null,
      country,
      city,
      soldierType,
    });
    const valid = !!birthDate && !!country && !!city && !!soldierType;
    onValidityChange(valid);
  }, [birthDate, country, city, soldierType, setAnswers, onValidityChange]);

  return (
    <Stack
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      alignContent={'start'}
      alignItems={'start'}
      sx={{
        gap: 3,
        maxWidth: '70%',
      }}
    >
      <Typography variant="body1" gutterBottom>
        בחלק זה תתבקש למלא פרטים כלליים אודותיך. המידע ישמש להתאמת השירות לצרכיך. אנא מלא את כל
        השדות הנדרשים בצורה מדויקת.
      </Typography>

      <MyDatePicker
        minDate={dayjs('1980')}
        required
        label="מהו תאריך הלידה שלך?"
        value={birthDate}
        onChange={setBirthDate}
        views={['year', 'month', 'day']}
      />

      <Autocomplete
        fullWidth
        options={allCountries}
        value={allCountries.find((opt) => opt.value === country) || null}
        onChange={(_, val) => setCountry(val ? val.value : '')}
        renderInput={(params) => (
          <TextField {...params} required label="באיזו מדינה נולדת?" variant="outlined" />
        )}
        noOptionsText="לא נמצאו מדינות"
      />

      <Autocomplete
        fullWidth
        options={allCities}
        value={city}
        onChange={(_, val) => setCity(val || '')}
        renderInput={(params) => (
          <TextField {...params} required label="מהי  עיר מגורך? (בישראל)" variant="outlined" />
        )}
        noOptionsText="לא נמצאו ערים"
      />

      <FormControl component="fieldset" required>
        <FormLabel component="legend">האם אתה חייל בודד או חייל בודד מובהק?</FormLabel>
        <RadioGroup row value={soldierType} onChange={(e) => setSoldierType(e.target.value)}>
          <FormControlLabel value="recognized" control={<Radio />} label="חייל בודד מובהק" />
          <FormControlLabel value="lone" control={<Radio />} label="חייל בודד" />
          <FormControlLabel value="none" control={<Radio />} label="איני חייל בודד" />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
};
