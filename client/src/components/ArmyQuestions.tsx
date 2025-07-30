import React, { useEffect, useState } from 'react';
import {
  Stack,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  MenuItem,
} from '@mui/material';
import { MyDatePicker } from './dates/MyDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import {
  FormQuestionLabels,
  type FormQuestionsProps as FormQuestionsProperties,
} from '../types/formQuestionsProps.type';
import { ServiceType, SoldierType } from '@righton/shared';

const LABEL_KEY = FormQuestionLabels.ARMY;

export const ArmyQuestions: React.FC<FormQuestionsProperties> = ({
  onSubmit,
  onValidityChange,
  answers,
  setAnswers,
}) => {
  const [enlistDate, setEnlistDate] = useState<Dayjs | null>(
    answers?.enlistDate ? dayjs(answers.enlistDate) : null
  );
  const [releaseDate, setReleaseDate] = useState<Dayjs | null>(
    answers?.releaseDate ? dayjs(answers.releaseDate) : null
  );
  const [serviceType, setServiceType] = useState(answers?.serviceType || '');
  const [monthsServed, setMonthsServed] = useState(answers?.monthsServed || 0);
  const [activityLevel, setActivityLevel] = useState(answers?.activityLevel || '');
  const [isCombat, setIsCombat] = useState(
    typeof answers?.isCombat === 'boolean' ? answers.isCombat : false
  );
  const [soldierType, setSoldierType] = useState(answers?.soldierType || '');

  useEffect(() => {
    const valid =
      !!enlistDate &&
      !!releaseDate &&
      !!serviceType &&
      !!monthsServed &&
      !!activityLevel &&
      !!soldierType;
    if (valid) {
      setAnswers(LABEL_KEY, {
        enlistDate: enlistDate.toISOString(),
        releaseDate: releaseDate.toISOString(),
        serviceType,
        monthsServed,
        activityLevel,
        isCombat,
        soldierType,
      });
    }
    onValidityChange(valid);
  }, [
    enlistDate,
    releaseDate,
    serviceType,
    monthsServed,
    activityLevel,
    soldierType,
    isCombat,
    onValidityChange,
    setAnswers,
  ]);

  useEffect(() => {
    if (enlistDate && releaseDate && releaseDate.isAfter(enlistDate)) {
      const today = dayjs();
      if (today.diff(enlistDate, 'month') < 24) {
        setServiceType(ServiceType.MANDATORY);
      } else if (today.diff(enlistDate, 'month') > 32) {
        setServiceType(ServiceType.CAREER);
      }

      const effectiveReleaseDate = releaseDate.isBefore(today) ? releaseDate : today;
      const months = effectiveReleaseDate.diff(enlistDate, 'month');
      if (months !== monthsServed) {
        setMonthsServed(months);
      }
    }
    // eslint-disable-next-line
  }, [enlistDate, releaseDate]);

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
        בחלק זה תתבקש למלא פרטים אודות שירותך הצבאי. אנא מלא את כל השדות הנדרשים בצורה מדויקת.
      </Typography>

      <MyDatePicker
        minDate={dayjs('2000')}
        required
        label="תאריך גיוס"
        value={enlistDate}
        onChange={setEnlistDate}
        views={['year', 'month']}
        openTo="year"
      />

      <MyDatePicker
        minDate={enlistDate || dayjs('2000')}
        maxDate={dayjs().add(3, 'year')}
        required
        label="תאריך שחרור"
        value={releaseDate}
        onChange={setReleaseDate}
        views={['year', 'month']}
        openTo="year"
      />

      <TextField
        required
        label="מספר חודשי שירות בפועל"
        type="number"
        value={monthsServed}
        onChange={(e) => setMonthsServed(Number.parseInt(e.target.value))}
        variant="outlined"
        fullWidth
      />

      <FormControl component="fieldset" required>
        <FormLabel component="legend">סוג השירות כיום</FormLabel>
        <RadioGroup row value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
          <FormControlLabel value={ServiceType.MANDATORY} control={<Radio />} label="שירות חובה" />
          <FormControlLabel value={ServiceType.CAREER} control={<Radio />} label="קבע" />
          <FormControlLabel value={ServiceType.VOLUNTEER} control={<Radio />} label="מתנדב/ת" />
          <FormControlLabel
            value={ServiceType.RESERVE}
            control={<Radio />}
            label="שירות מילואים פעיל"
            disabled={!releaseDate || releaseDate.isAfter(dayjs())}
          />
          <FormControlLabel
            value={ServiceType.RELEASED_NO_RESERVE}
            control={<Radio />}
            label="משוחרר ללא מילואים"
            disabled={!releaseDate || releaseDate.isAfter(dayjs())}
          />
        </RadioGroup>
      </FormControl>

      <FormControl component="fieldset" required>
        <FormLabel component="legend">אופי השירות הסדיר</FormLabel>
        <RadioGroup
          row
          value={isCombat === null ? '' : isCombat ? 'combat' : 'noncombat'}
          onChange={(e) => setIsCombat(e.target.value === 'combat')}
        >
          <FormControlLabel value="combat" control={<Radio />} label="לוחמה" />
          <FormControlLabel value="noncombat" control={<Radio />} label="עורפי" />
        </RadioGroup>
      </FormControl>

      <TextField
        required
        select
        label="רמת פעילות"
        value={activityLevel}
        onChange={(e) => setActivityLevel(e.target.value)}
        variant="outlined"
        fullWidth
      >
        <MenuItem value="A">א</MenuItem>
        <MenuItem value="B">ב</MenuItem>
        <MenuItem value="C">ג</MenuItem>
        <MenuItem value="D">ד</MenuItem>
      </TextField>

      <FormControl component="fieldset" required>
        <FormLabel component="legend">האם אתה חייל בודד או חייל בודד מובהק?</FormLabel>
        <RadioGroup row onChange={(e) => setSoldierType(e.target.value)}>
          <FormControlLabel
            value={SoldierType.DISTINGUISHED_LONE_SOLDIER}
            control={<Radio />}
            label="חייל בודד מובהק"
          />
          <FormControlLabel
            value={SoldierType.LONE_SOLDIER}
            control={<Radio />}
            label="חייל בודד"
          />
          <FormControlLabel
            value={SoldierType.NOT_LONE_SOLDIER}
            control={<Radio />}
            label="איני חייל בודד"
          />
        </RadioGroup>
      </FormControl>
    </Stack>
  );
};
