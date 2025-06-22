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
  Checkbox,
} from '@mui/material';

export const HousingQuestions: React.FC<{
  onSubmit: () => void;
  onValidityChange: (valid: boolean) => void;
}> = ({ onSubmit, onValidityChange }) => {
  const [housingStatus, setHousingStatus] = useState('');
  const [receivesArmyAssistance, setReceivesArmyAssistance] = useState(false);
  const [distanceToBase, setDistanceToBase] = useState<number | ''>('');
  const [currentHousing, setCurrentHousing] = useState('');

  useEffect(() => {
    const valid = !!housingStatus && distanceToBase !== '' && !!currentHousing;
    onValidityChange(valid);
  }, [housingStatus, receivesArmyAssistance, distanceToBase, currentHousing, onValidityChange]);

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
        בחלק זה תתבקש למלא פרטים אודות מגוריך. אנא מלא את כל השדות הנדרשים בצורה מדויקת.
      </Typography>

      <FormControl component="fieldset" required>
        <FormLabel component="legend">סטטוס מגורים</FormLabel>
        <RadioGroup row value={housingStatus} onChange={(e) => setHousingStatus(e.target.value)}>
          <FormControlLabel value="owner" control={<Radio />} label="בעל דירה" />
          <FormControlLabel value="renter" control={<Radio />} label="שוכר דירה" />
          <FormControlLabel value="none" control={<Radio />} label="ללא דירה" />
        </RadioGroup>
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            checked={receivesArmyAssistance}
            onChange={(e) => setReceivesArmyAssistance(e.target.checked)}
          />
        }
        label='האם אתה מקבל סיוע בדיור מצה"ל?'
      />

      {housingStatus === 'none' && (
        <TextField
          required
          select
          label="תנאי מגורים נוכחיים"
          value={currentHousing}
          onChange={(e) => setCurrentHousing(e.target.value)}
          variant="outlined"
          fullWidth
        >
          <MenuItem value="parents">בית הורים</MenuItem>
          <MenuItem value="soldierHouse">בית החייל</MenuItem>
          <MenuItem value="kibbutz">קיבוץ</MenuItem>
          <MenuItem value="base">מגורים בבסיס</MenuItem>
          <MenuItem value="other">אחר</MenuItem>
        </TextField>
      )}

      <TextField
        required
        label='מרחק ממקום המגורים לבסיס (בק"מ)'
        type="number"
        value={distanceToBase}
        onChange={(e) => setDistanceToBase(e.target.value === '' ? '' : Number(e.target.value))}
        variant="outlined"
        fullWidth
        inputProps={{ min: 0 }}
      />
    </Stack>
  );
};
