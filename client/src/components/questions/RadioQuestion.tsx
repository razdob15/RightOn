import React from 'react';
import { FormControl, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';

export interface Option {
  value: string;
  label: string;
}

interface RadioQuestionProps {
  question: string;
  value: string;
  options?: Option[];
  onChange: (value: string) => void;
}

export const RadioQuestion: React.FC<RadioQuestionProps> = ({
  question,
  value,
  options,
  onChange,
}) => {
  return (
    <FormControl component="fieldset" fullWidth>
      <Typography variant="h6" gutterBottom>
        {question}
      </Typography>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options?.map((option, idx) => (
          <FormControlLabel
            key={idx}
            value={option.value}
            control={<Radio />}
            label={option.label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}; 