import React, { useState } from 'react';
import 'dayjs/locale/he'; // <-- Add this line
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';

export const MyDatePicker: React.FC<{
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
  label: string;
  required?: boolean;
  views?: Array<'year' | 'month' | 'day'>;
  minDate: Dayjs;
  maxDate?: Dayjs;
  openTo?: 'year' | 'month' | 'day';
}> = ({
  value,
  onChange,
  label,
  required = false,
  views = ['year'],
  minDate,
  maxDate = dayjs(),
  openTo = 'year',
}) => {
  // Internal handler to ensure only valid dates are passed up
  const handleChange = (newValue: Dayjs | null) => {
    if (newValue && newValue.isValid()) {
      onChange(newValue);
    } else {
      onChange(null);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="he">
      <DatePicker
        openTo={openTo}
        views={views}
        label={label}
        value={value && value.isValid() ? value : null}
        onChange={handleChange}
        slotProps={{
          textField: {
            fullWidth: true,
            required: required,
            inputProps: { style: { textAlign: 'right' } },
            sx: {
              '& .MuiPickersSectionList-root': {
                direction: 'rtl',
                justifyContent: 'flex-end',
              },
            },
          },
        }}
        minDate={minDate}
        maxDate={maxDate}
      />
    </LocalizationProvider>
  );
};
