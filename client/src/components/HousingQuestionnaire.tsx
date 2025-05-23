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


export const HousingQuestionnaire: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const dispatch = useAppDispatch();
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
        "question": "When did you enlist to the IDF?",
        "value": new Date(userStatus.service.enlistmentDate).toISOString().split('T')[0],
        "onChange": (value: number) => {
          dispatch(updateEnlistmentDate(value));
        },
        "type": "date"
      },
      {
        "question": "Have you been discharged? If yes, when? (Leave empty if still serving)",
        "value": new Date(userStatus.service.enlistmentDate).toISOString().split('T')[0],
        "onChange": (value: number) => {
          dispatch(updateDutyEndDate(value))
        },
        "type": "date"
      }
    ]
  }, [userStatus.service.enlistmentDate, dispatch]);

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
        type: "radio",
        question: "What type of lone soldier are you?",
        value: userStatus.soldierType,
        onChange: (value: string) => {
          dispatch(updateSoldierType(value as SoldierType));
        },
        options: [
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
  }, [userStatus.housing.housingStatus, dispatch]);

  const renderQuestions = (questions: any[]) => {
    return questions.map((question, index) => (
      <Box key={index} sx={{ mb: 3 }}>
        {question.type === "date" ? (
          <DateQuestion
            question={question.question}
            value={question.value}
            onChange={question.onChange}
          />
        ) : (
          <RadioQuestion
            question={question.question}
            value={question.value || ''}
            options={question.options}
            onChange={question.onChange}
          />
        )}
      </Box>
    ));
  };



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
          Housing Rights Questionnaire
        </Typography>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 4 }}>
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} disabled={activeTab < index} />
          ))}
        </Tabs>

        <Paper sx={{ p: 3, mb: 3, height: '100%', overflow: 'auto' }}>
          {questionsByTabMapper[tabs[activeTab].label].map((question: Question, index) => (

            <Box key={index} sx={{ mb: 3 }}>
              <QuestionComp
                type={question.type}
                question={question.question}
                value={question.value}
                options={question?.options}
                onChange={question.onChange}
              />
            </Box>
          ))}
          {renderQuestions(questionsByTabMapper[tabs[activeTab].label])}
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