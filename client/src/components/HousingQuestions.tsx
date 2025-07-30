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
import {
  FormQuestionLabels,
  type FormQuestionsProps as FormQuestionsProperties,
} from '../types/formQuestionsProps.type';
import { HousingStatus } from '@righton/shared';

const LABEL_KEY = FormQuestionLabels.HOUSING;

export const HousingQuestions: React.FC<FormQuestionsProperties> = ({
  onSubmit,
  onValidityChange,
  answers,
  setAnswers,
}) => {
  const [housingStatus, setHousingStatus] = useState(answers?.housingStatus || '');
  const [receivesArmyAssistance, setReceivesArmyAssistance] = useState(
    typeof answers?.receivesArmyAssistance === 'boolean' ? answers.receivesArmyAssistance : false
  );
  const [distanceToBase, setDistanceToBase] = useState(
    typeof answers?.distanceToBase === 'number' ? answers.distanceToBase : 0
  );
  const [currentHousing, setCurrentHousing] = useState(answers?.currentHousing || '');

  useEffect(() => {
    setAnswers(LABEL_KEY, {
      housingStatus,
      receivesArmyAssistance,
      distanceToBase,
      currentHousing,
    });
    const valid = housingStatus !== HousingStatus.NONE || (!!housingStatus && !!currentHousing);
    onValidityChange(valid);
  }, [
    housingStatus,
    receivesArmyAssistance,
    distanceToBase,
    currentHousing,
    setAnswers,
    onValidityChange,
  ]);

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
        בחלק זה תתבקש למלא פרטים אודות מגוריך. אנא מלא את כל השדות הנדרשים בצורה מדויקת.
      </Typography>

      <FormControl component="fieldset" required>
        <FormLabel component="legend">סטטוס מגורים</FormLabel>
        <RadioGroup row value={housingStatus} onChange={(e) => setHousingStatus(e.target.value)}>
          <FormControlLabel value={HousingStatus.OWNS} control={<Radio />} label="בעל דירה" />
          <FormControlLabel value={HousingStatus.RENTS} control={<Radio />} label="שוכר דירה" />
          <FormControlLabel value={HousingStatus.NONE} control={<Radio />} label="ללא דירה" />
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

      {housingStatus === HousingStatus.NONE && (
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
        onChange={(e) =>
          setDistanceToBase(e.target.value === '' ? 0 : Number.parseInt(e.target.value))
        }
        variant="outlined"
        fullWidth
        inputProps={{ min: 0 }}
      />
    </Stack>
  );
};
