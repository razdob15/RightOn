import React, { useEffect, useState } from 'react';
import {
  Stack,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  Autocomplete,
  Switch,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { FormQuestionLabels, type FormQuestionsProps as FormQuestionsProperties } from '../types/formQuestionsProps.type';
import dayjs, { Dayjs } from 'dayjs';
import { MyDatePicker } from './dates/MyDatePicker';
import { useCountries } from '../hools/use-countries';

const LABEL_KEY = FormQuestionLabels.ALIYAH;

export const AliyahQuestions: React.FC<FormQuestionsProperties> = ({
  onSubmit,
  onValidityChange,
  answers,
  setAnswers,
}) => {
  const { hebrewCountries: allCountries } = useCountries();

  // Initialize state from answers
  const [aliyahYear, setAliyahYear] = useState<Dayjs | null>(
    answers?.aliyahYear ? dayjs(answers.aliyahYear) : null
  );
  const [aliyahCountry, setAliyahCountry] = useState(answers?.aliyahCountry || '');
  const [isOleh, setIsOleh] = useState(
    typeof answers?.isOleh === 'boolean' ? answers.isOleh : true
  );
  const [parentsAbroad, setParentsAbroad] = useState(answers?.parentsAbroad || 'none');

  // Update parent state when local state changes
  useEffect(() => {
    setAnswers(LABEL_KEY, {
      aliyahYear: aliyahYear ? aliyahYear.toISOString() : null,
      aliyahCountry,
      isOleh,
      parentsAbroad,
    });
    // Validate required fields
    const valid = !isOleh || (!!aliyahYear && !!aliyahCountry);
    onValidityChange(valid);
  }, [aliyahYear, aliyahCountry, isOleh, parentsAbroad]); //, setAnswers, onValidityChange]);

  return (
    <Stack
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      alignContent="start"
      alignItems="start"
      sx={{
        gap: 3,
        maxWidth: '70%',
      }}
    >
      <Typography variant="body1" gutterBottom>
        בחלק זה תתבקש למלא פרטים אודות העלייה שלך לישראל. המידע ישמש להתאמת השירות לצרכיך. אנא מלא
        את כל השדות הנדרשים בצורה מדויקת.
      </Typography>

      <FormControl component="fieldset" required>
        <FormLabel component="legend">האם עלית לישראל ב-10 השנים האחרונות?</FormLabel>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography>לא</Typography>
          <Switch checked={isOleh} onChange={(_, checked) => setIsOleh(checked)} />
          <Typography>כן</Typography>
        </Stack>
      </FormControl>

      {isOleh && (
        <>
          <Autocomplete
            fullWidth
            options={allCountries}
            value={allCountries.find((opt) => opt.value === aliyahCountry) || null}
            onChange={(_, value) => setAliyahCountry(value ? value.value : '')}
            renderInput={(parameters) => (
              <TextField {...parameters} required label="מאיזו מדינה עלית?" variant="outlined" />
            )}
            noOptionsText="לא נמצאו מדינות"
          />

          <MyDatePicker
            value={aliyahYear}
            onChange={setAliyahYear}
            label="באיזו שנה עלית לישראל?"
            required
            minDate={dayjs('2010')}
            views={['year']}
          />
        </>
      )}

      <FormControl component="fieldset" required>
        <FormLabel component="legend">האם הוריך גרים בחו"ל?</FormLabel>
        <Stack direction="row" spacing={2}>
          <RadioGroup
            row
            name="parentsAbroad"
            value={parentsAbroad}
            onChange={(_, value) => setParentsAbroad(value)}
          >
            <FormControlLabel value="both" control={<Radio />} label="כן, שניהם" />
            <FormControlLabel value="one" control={<Radio />} label="כן, אחד מהם" />
            <FormControlLabel value="none" control={<Radio />} label="לא" />
          </RadioGroup>
        </Stack>
      </FormControl>
    </Stack>
  );
};
