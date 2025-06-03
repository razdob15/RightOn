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
import { HousingStatus, SoldierType, UserStatus } from '../types/user-status';
import { TabName } from '../enums/app-tab.enum';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  updateHousingStatus,
  updateSoldierType,
  updateEnlistmentDate,
  updateDutyEndDate,
} from '../store/slices/userStatusSlice';
import { QuestionComp } from './questions/QuestionComp';
import { Question } from '../types/questions';
import { AppTab } from '../types/tab.type';

export const MainQuestionnaire: React.FC = () => {
  const dispatch = useAppDispatch();
  const [currentTabId, setCurrentTabId] = useState<number>(0);
  const userStatus = useAppSelector((state) => state.userStatus);


  const getMatchingRights = useCallback((): Right[] => {
    return rightsData.filter(right =>
      right.eligibleSoldierType.includes(userStatus.soldierType) &&
      right.isEligible(userStatus)
    );
  }, [userStatus.soldierType]);
  const matchingRights = getMatchingRights();



  const generalQuestionsList: Question[] = useMemo(() => ([
    {
      "type": "date",
      "question": "When did you enlist to the IDF?",
      "value": userStatus.service.enlistmentDate ? new Date(userStatus.service.enlistmentDate).getTime() : undefined,
      "onChange": (value: number) => {
        dispatch(updateEnlistmentDate(value));
      },
    },
    {
      "type": "date",
      "question": "Have you been discharged? If yes, when? (Leave empty if still serving)",
      "value": userStatus.service?.dutyEndDate ? new Date(userStatus.service?.dutyEndDate).getTime() : undefined,
      "onChange": (value: number) => {
        dispatch(updateDutyEndDate(value))
      },
    }
  ]),
    [userStatus.service?.enlistmentDate, userStatus.service?.dutyEndDate, dispatch]);

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
  }, [userStatus.soldierType, userStatus.housing.housingStatus, dispatch]);



  const tabs: AppTab[] = useMemo(() => {
    return [
      {
        label: TabName.GENERAL,
        validation: (userStatus: UserStatus) => {
          return Boolean(userStatus.service.dutyEndDate && userStatus.service.enlistmentDate && userStatus.service.enlistmentDate < userStatus.service.dutyEndDate)
        },
        questions: generalQuestionsList
      },

      {
        label: TabName.HOUSING,
        validation: () => true,
        questions: housingQuestionsList
      },
      {
        label: TabName.SUMMARY,
        rights: matchingRights
      }

    ]
  }, [generalQuestionsList,
    housingQuestionsList,
    userStatus.service.dutyEndDate,
    userStatus.service.enlistmentDate,
    matchingRights
  ])

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTabId(newValue);
  };




  const currentTab = useMemo(
    () => tabs[currentTabId],
    [tabs, currentTabId]
  )

  return (
    <Container maxWidth="md">

      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          RightsOn
        </Typography>

        <Tabs value={currentTabId} onChange={handleTabChange} sx={{ mb: 4 }}>
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} disabled={currentTabId < index} />
          ))}
        </Tabs>

        {currentTab.questions !== undefined &&
          <Paper sx={{ p: 3, mb: 3, height: '100%', overflow: 'auto' }}>
            {currentTab.questions?.map((question: Question, index: number) => (
              <Box key={index} sx={{ mb: 3 }}>
                <QuestionComp
                  question={question}
                />
              </Box>
            ))}
          </Paper>
        }

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => setCurrentTabId(prev => prev + 1)}
            disabled={currentTabId >= tabs.length || !currentTab.validation?.(userStatus)}
          >
            Next
          </Button>
        </Box>

        {currentTabId === tabs.length && (
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