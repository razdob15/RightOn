import React, { useMemo, useState } from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Paper,
  Card,
  CardContent,
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Right,
  rightsData,
} from '../types/rights';
import { UserStatus, HousingStatus, SoldierType, ServiceType } from '../types/user-status';
import { subDays } from 'date-fns';

const dateToValue = (date: Date) => date.toISOString().split('T')[0]

export const HousingQuestionnaire: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [userStatus, setUserStatus] = useState<UserStatus>({
    soldierType: SoldierType.LONE_SOLDIER,
    service: {
      enlistmentDate: subDays(new Date(), 1),
      dutyEndDate: new Date(Date.now()),
      serviceType: ServiceType.MANDATORY
    },
    housing: {
      housingStatus: HousingStatus.NO_HOUSE,
      idfRentAssistance: false
    },
  });

  const tabs = [
    { label: 'General', value: 0 },
    { label: 'Housing', value: 1 },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getMatchingRights = (): Right[] => {
    return rightsData.filter(right =>
      right.eligibleSoldierType.includes(userStatus.soldierType) &&
      right.isEligible(userStatus)
    );
  };


  const generalQuestionsList = useMemo(() => {
    return [
      {
        "question": "When did you enlist to the IDF?",
        "value": userStatus.service.enlistmentDate,
        "onChange": (value: string) => setUserStatus(prev => ({
          ...prev,
          service: {
            ...prev.service,
            enlistmentDate: new Date(value)
          }
        })),
        "type": "date"
      },
      {
        "question": "Have you been discharged? If yes, when? (Leave empty if still serving)",
        "value": userStatus.service.dutyEndDate,
        "onChange": (value: string) => setUserStatus(prev => ({
          ...prev,
          service: {
            ...prev.service,
            dutyEndDate: value ? new Date(value) : undefined
          }
        })),
        "type": "date"
      }
    ]
  }, [userStatus.service]);

  const housingQuestionsList = useMemo(() => {
    return [
      {
        "question": "What is your current housing situation?",
        "value": userStatus.housing.housingStatus,
        "onChange": (value: string) => setUserStatus(prev => ({
          ...prev,
          housing: {
            ...prev.housing,
            housingStatus: value as HousingStatus
          }
        })),
        "options": [
          {
            "value": "RENTS",
            "label": "I rent an apartment"
          },
          {
            "value": "OWNS",
            "label": "I own an apartment"
          },
          {
            "value": "NO_HOUSE",
            "label": "Neither rent nor own"
          }
        ]
      },
      {
        "question": "What type of lone soldier are you?",
        "value": userStatus.soldierType,
        "onChange": (value: string) => setUserStatus(prev => ({
          ...prev,
          service: {
            ...prev.service,
            soldierType: value as SoldierType
          }
        })),
        "options": [
          {
            "value": "DISTINGUISHED_LONE_SOLDIER",
            "label": "Distinguished Lone Soldier (parents reside permanently abroad)"
          },
          {
            "value": "LONE_SOLDIER",
            "label": "Lone Soldier (other circumstances)"
          }
        ]
      },
    ]
  }, [userStatus.housing.housingStatus]);

  const renderQuestions = (questions: any[]) => {
    return questions.map((question, index) => (
      <FormControl component="fieldset" fullWidth key={index}>
        <Typography variant="h6" gutterBottom>
          {question.question}
        </Typography>
        {question.type ? (
          <TextField
            type={question.type}
            value={question.type === "date" ? (question.value ? dateToValue(question.value) : '') : question.value}
            onChange={(e) => question.onChange(e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        ) : (
          <RadioGroup
            value={question.value || ''}
            onChange={(e) => question.onChange(e.target.value)}
          >
            {question.options.map((option: any, idx: number) => (
              <FormControlLabel
                key={idx}
                value={option.value}
                control={<Radio />}
                label={option.label}
              />
            ))}
          </RadioGroup>
        )}
      </FormControl>
    ));
  };

  const matchingRights = getMatchingRights();
  const showResults = userStatus.service.enlistmentDate;

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Housing Rights Questionnaire
        </Typography>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
          {tabs.map((tab) => (
            <Tab key={tab.value} label={tab.label} />
          ))}
        </Tabs>

        <Paper sx={{ p: 3, mb: 3, height: '100%', overflow: 'auto' }}>
          {activeTab === 0 && renderQuestions(generalQuestionsList)}
          {activeTab === 1 && renderQuestions(housingQuestionsList)}
        </Paper>

        {showResults && (
          <Box>
            <Typography variant="h5" gutterBottom>
              {matchingRights.length > 0 ? 'Your Eligible Rights:' : 'No matching rights found'}
            </Typography>

            {matchingRights.map((right, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {right.rightName}
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {right.details}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Granting Organization: {right.grantingOrganization}
                  </Typography>
                  {right.contactPerson && (
                    <Typography variant="body2" color="text.secondary">
                      Contact: {right.contactPerson}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}; 