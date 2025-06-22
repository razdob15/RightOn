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

export const ArmyQuestions: React.FC<{
  onSubmit: () => void;
  onValidityChange: (valid: boolean) => void;
}> = ({ onSubmit, onValidityChange }) => {
  const [enlistDate, setEnlistDate] = useState<Dayjs | null>(null);
  const [releaseDate, setReleaseDate] = useState<Dayjs | null>(null);
  const [serviceType, setServiceType] = useState('');
  const [monthsServed, setMonthsServed] = useState(0);
  const [activityLevel, setActivityLevel] = useState('');
  const [isCombat, setIsCombat] = useState(false);

  useEffect(() => {
    const valid =
      !!enlistDate && !!releaseDate && !!serviceType && !!monthsServed && !!activityLevel;
    onValidityChange(valid);
  }, [enlistDate, releaseDate, serviceType, monthsServed, activityLevel, onValidityChange]);

  useEffect(() => {
    if (enlistDate && releaseDate && releaseDate.isAfter(enlistDate)) {
      const today = dayjs();
      if (today.diff(enlistDate, 'month') < 24) {
        setServiceType('mandatory');
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
      alignContent={'start'}
      alignItems={'start'}
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
        views={['year', 'month', 'day']}
      />

      <MyDatePicker
        minDate={enlistDate || dayjs('2000')}
        maxDate={dayjs().add(3, 'year')}
        required
        label="תאריך שחרור"
        value={releaseDate}
        onChange={setReleaseDate}
        views={['year', 'month', 'day']}
      />

      <TextField
        required
        label="מספר חודשי שירות בפועל"
        type="number"
        value={monthsServed}
        onChange={(e) => setMonthsServed(parseInt(e.target.value))}
        variant="outlined"
        fullWidth
      />

      <FormControl component="fieldset" required>
        <FormLabel component="legend">סוג השירות כיום</FormLabel>
        <RadioGroup row value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
          <FormControlLabel value="mandatory" control={<Radio />} label="שירות חובה" />
          <FormControlLabel value="career" control={<Radio />} label="קבע" />
          <FormControlLabel value="volunteer" control={<Radio />} label="מתנדב/ת" />
          <FormControlLabel
            value="reserve"
            control={<Radio />}
            label="מילואים"
            disabled={!releaseDate || releaseDate.isAfter(dayjs())}
          />
          <FormControlLabel
            value="released"
            control={<Radio />}
            label="משוחרר ללא מילואים פעיל"
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
    </Stack>
  );
};
