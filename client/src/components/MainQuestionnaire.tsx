import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Container,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Right,
  rightsData,
} from '../types/rights';
import { HousingStatus, SoldierType } from '../types/user-status';
import { AppTab } from '../enums/app-tab.enum';
import { DateQuestion } from './questions/DateQuestion';
import { RadioQuestion } from './questions/RadioQuestion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  updateHousingStatus,
  updateSoldierType,
  updateEnlistmentDate,
  updateDutyEndDate,
} from '../store/slices/userStatusSlice';
import { QuestionComp } from './questions/QuestionComp';
import { Question } from '../types/questions';


export const MainQuestionnaire: React.FC = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const userStatus = useAppSelector((state) => state.userStatus);

  const tabs = [
    { label: AppTab.GENERAL },
    { label: AppTab.HOUSING },
  ];

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getMatchingRights = useCallback((): Right[] => {
    return rightsData.filter(right =>
      right.eligibleSoldierType.includes(userStatus.soldierType) &&
      right.isEligible(userStatus)
    );
  }, [userStatus.soldierType]);


  const generalQuestionsList: Question[] = useMemo(() => {
    return [
      {
        "type": "date",
        "question": "When did you enlist to the IDF?",
        "value": new Date(userStatus.service.enlistmentDate).getTime(),
        "onChange": (value: number) => {
          console.log('value', value);
          dispatch(updateEnlistmentDate(value));
        },
      },
      {
        "type": "date",
        "question": "Have you been discharged? If yes, when? (Leave empty if still serving)",
        "value": userStatus.service?.dutyEndDate ? new Date(userStatus.service?.dutyEndDate).getTime() : new Date().getTime(),
        "onChange": (value: number) => {
          dispatch(updateDutyEndDate(value))
        },
      }
    ]
  }, [userStatus.service.enlistmentDate, userStatus.service.dutyEndDate, dispatch]);

  const housingQuestionsList: Question[] = useMemo(() => {
    return [
      {
        type: "radio",
        question: "What is your current housing situation?",
        value: userStatus.housing.housingStatus,
        onChange: (value: string) => {
          dispatch(updateHousingStatus(value as HousingStatus));
        },
        options: [
          {
            "value": HousingStatus.RENTS,
            "label": "I rent an apartment"
          },
          {
            "value": HousingStatus.OWNS,
            "label": "I own an apartment"
          },
          {
            "value": HousingStatus.NO_HOUSE,
            "label": "Neither rent nor own"
          }
        ]
      },
      {
        type: "radio",
        question: "What type of lone soldier are you?",
        value: userStatus.soldierType,
        onChange: (value: string) => {
          dispatch(updateSoldierType(value as SoldierType));
        },
        options: [
          {
            "value": SoldierType.DISTINGUISHED_LONE_SOLDIER,
            "label": "Distinguished Lone Soldier (parents reside permanently abroad)"
          },
          {
            "value": SoldierType.LONE_SOLDIER,
            "label": "Lone Soldier (other circumstances)"
          }
        ]
      },
    ]
  }, [userStatus.housing.housingStatus, dispatch]);


  const questionsByTabMapper = useMemo(() => {
    return {
      [AppTab.GENERAL]: generalQuestionsList,
      [AppTab.HOUSING]: housingQuestionsList,
    }
  }, [generalQuestionsList, housingQuestionsList])

  const matchingRights = getMatchingRights();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Questionnaire
        </Typography>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} disabled={activeTab < index} />
          ))}
        </Tabs>

        <Paper sx={{ p: 3, mb: 3, height: '100%', overflow: 'auto' }}>
          {questionsByTabMapper[tabs[activeTab].label].map((question: Question, index: number) => (
            <Box key={index} sx={{ mb: 3 }}>
              <QuestionComp
                question={question}
              />
            </Box>
          ))}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => setActiveTab(prev => prev + 1)}
            disabled={activeTab >= tabs.length}
          >
            Next
          </Button>
        </Box>

        {activeTab === tabs.length && (
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