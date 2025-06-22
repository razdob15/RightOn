import { Card, Typography } from '@mui/material';
import React, { useState } from 'react';
import { Tabs, Tab, Button, Box } from '@mui/material';
import { GeneralQuestions } from './GeneralQuestions';
import { AliyahQuestions } from './AliyahQuestions';
import { ArmyQuestions } from './ArmyQuestions';
import { HousingQuestions } from './HousingQuestions';

export const HebrewMain: React.FC = () => {
  // TODO: Change the order of the tabs to be more logical
  const tabs = [
    {
      label: 'כללי',
      componentFunc: (onSubmit: () => void, onValidityChange: (valid: boolean) => void) => (
        <GeneralQuestions onSubmit={onSubmit} onValidityChange={onValidityChange} />
      ),
    },
    {
      label: 'עלייה',
      componentFunc: (onSubmit: () => void, onValidityChange: (valid: boolean) => void) => (
        <AliyahQuestions onSubmit={onSubmit} onValidityChange={onValidityChange} />
      ),
    },
    {
      label: 'שירות צבאי',
      componentFunc: (onSubmit: () => void, onValidityChange: (valid: boolean) => void) => (
        <ArmyQuestions onSubmit={onSubmit} onValidityChange={onValidityChange} />
      ),
    },
    {
      label: 'דיור',
      componentFunc: (onSubmit: () => void, onValidityChange: (valid: boolean) => void) => (
        <HousingQuestions onSubmit={onSubmit} onValidityChange={onValidityChange} />
      ),
    },
  ];

  const [tabIndex, setTabIndex] = useState(0);
  const [tabMaxVisitedIndex, setTabMaxVisitedIndex] = useState(0);
  const [isCurrentPageValid, setIsCurrentPageValid] = useState(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
    setTabMaxVisitedIndex(Math.max(tabMaxVisitedIndex, newValue));
  };

  const handlePageSubmit = () => {
    // You can add validation or data collection here
    if (tabIndex < tabs.length - 1) {
      setTabIndex(tabIndex + 1);
      setTabMaxVisitedIndex(Math.max(tabMaxVisitedIndex, tabIndex + 1));
    } else {
      // Final submit logic here
      console.log('שאלון הושלם!');
    }
  };

  return (
    <Card sx={{ minHeight: '700px', width: '80%' }} elevation={5}>
      <Box sx={{ textAlign: 'rtl', p: 3 }}>
        <Typography variant="h4" textAlign={'center'} gutterBottom>
          RightOn
        </Typography>
        <Typography variant="body1" gutterBottom>
          ברוכים הבאים ל-RightOn, המערכת שתעזור לכם לממש את זכויותיכם כלוחמי צה"ל בודדים.
        </Typography>
        <Typography variant="body1">
          אנא מלאו את השאלון כדי שנוכל להתאים את הזכויות הרלוונטיות עבורכם.
        </Typography>
        <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth" sx={{ mb: 2 }}>
          {tabs.map(({ label }, idx) => (
            <Tab key={label} label={label} disabled={idx > tabMaxVisitedIndex} />
          ))}
        </Tabs>
        <Box sx={{ minHeight: 100, mb: 2 }}>
          {tabs[tabIndex] && tabs[tabIndex]?.componentFunc(handlePageSubmit, setIsCurrentPageValid)}
        </Box>
        <Button variant="contained" onClick={handlePageSubmit} disabled={!isCurrentPageValid}>
          {tabIndex === tabs.length - 1 ? 'סיום' : 'הבא'}
        </Button>
      </Box>
    </Card>
  );
};
