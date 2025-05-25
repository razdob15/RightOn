import React from 'react';
import { FormControl, TextField, Typography } from '@mui/material';

interface DateQuestionProps {
  question: string;
  value: Date | undefined;
  onChange: (value: number) => void;
}


export const DateQuestion: React.FC<DateQuestionProps> = ({
  question,
  value,
  onChange,
}) => {
  return (
    <FormControl component="fieldset" fullWidth>
      <Typography variant="h6" gutterBottom>
        {question}
      </Typography>
      <TextField
        type="date"
        value={value ? new Date(value).toISOString().split('T')[0] : ''}
        onChange={(e) => {
          const value = e.target.value;
          const year = Number(value.split('-')[0]);
          const month = Number(value.split('-')[1]);
          const day = Number(value.split('-')[2]);
          const date = new Date(year, month - 1, day);
          onChange(date.getTime());
        }}
        fullWidth
      />
    </FormControl>
  );
}; 