import { Card, Typography } from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, Tab, Button, Box } from '@mui/material';
import { GeneralQuestions } from './GeneralQuestions';
import { AliyahQuestions } from './AliyahQuestions';
import { ArmyQuestions } from './ArmyQuestions';
import { HousingQuestions } from './HousingQuestions';

export const HebrewMain: React.FC = () => {
  const updateAnswers = useCallback((label: string, data: any) => {
    setAnswers((prev: any) => ({ ...prev, [label]: data }));
  }, []);

  // TODO: Change the order of the tabs to be more logical
  const tabs = [
    {
      label: 'כללי',
      componentFunc: (
        onSubmit: () => void,
        onValidityChange: (valid: boolean) => void,
        answers: any,
        setAnswers: React.Dispatch<React.SetStateAction<any>>
      ) => (
        <GeneralQuestions
          onSubmit={onSubmit}
          onValidityChange={onValidityChange}
          answers={answers.general || {}}
          setAnswers={updateAnswers}
        />
      ),
    },
    {
      label: 'עלייה',
      componentFunc: (
        onSubmit: () => void,
        onValidityChange: (valid: boolean) => void,
        answers: any,
        setAnswers: React.Dispatch<React.SetStateAction<any>>
      ) => (
        <AliyahQuestions
          onSubmit={onSubmit}
          onValidityChange={onValidityChange}
          answers={answers.aliyah || {}}
          setAnswers={updateAnswers}
        />
      ),
    },
    {
      label: 'שירות צבאי',
      componentFunc: (
        onSubmit: () => void,
        onValidityChange: (valid: boolean) => void,
        answers: any,
        setAnswers: React.Dispatch<React.SetStateAction<any>>
      ) => (
        <ArmyQuestions
          onSubmit={onSubmit}
          onValidityChange={onValidityChange}
          answers={answers.army || {}}
          setAnswers={updateAnswers}
        />
      ),
    },
    {
      label: 'דיור',
      componentFunc: (onSubmit: () => void, onValidityChange: (valid: boolean) => void) => (
        <HousingQuestions
          onSubmit={onSubmit}
          onValidityChange={onValidityChange}
          answers={answers.housing || {}}
          setAnswers={updateAnswers}
        />
      ),
    },
  ];

  const [tabIndex, setTabIndex] = useState(0);
  const [tabMaxVisitedIndex, setTabMaxVisitedIndex] = useState(0);
  const [isCurrentPageValid, setIsCurrentPageValid] = useState(false);
  // Add state for answers (example, adjust as needed)
  const [answers, setAnswers] = useState<any>({});

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

  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);
  // Load from localStorage on mount
  useEffect(() => {
    const savedTabIndex = localStorage.getItem('righton_tabIndex');
    const savedTabMaxVisitedIndex = localStorage.getItem('righton_tabMaxVisitedIndex');
    const savedAnswers = localStorage.getItem('righton_answers');
    if (savedTabIndex) setTabIndex(Number(savedTabIndex));
    if (savedTabMaxVisitedIndex) setTabMaxVisitedIndex(Number(savedTabMaxVisitedIndex));
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));

    setIsLocalStorageLoaded(true);
  }, []);

  // Save to localStorage when relevant state changes
  useEffect(() => {
    if (isLocalStorageLoaded) {
      localStorage.setItem('righton_tabIndex', tabIndex.toString());
      localStorage.setItem('righton_tabMaxVisitedIndex', tabMaxVisitedIndex.toString());
      localStorage.setItem('righton_answers', JSON.stringify(answers));
    }
  }, [tabIndex, tabMaxVisitedIndex, answers, isLocalStorageLoaded]);

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
          {tabs[tabIndex] &&
            tabs[tabIndex]?.componentFunc(
              handlePageSubmit,
              setIsCurrentPageValid,
              answers,
              setAnswers
            )}
        </Box>
        <Button variant="contained" onClick={handlePageSubmit} disabled={!isCurrentPageValid}>
          {tabIndex === tabs.length - 1 ? 'סיום' : 'הבא'}
        </Button>
      </Box>
    </Card>
  );
};
