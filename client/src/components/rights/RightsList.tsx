import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionSummary, Box, Typography } from '@mui/material';
import { Right, rightsData } from '../../types/rights';
import { RightSubject } from '../../types/user-status';
import { RightCard } from './RightCard';
import { useAppSelector } from '../../store/hooks';
import { useMemo } from 'react';

export const RightsList = () => {
  const userStatus = useAppSelector((state) => state.userStatus);

  const matchingRights = useMemo((): Right[] => {
    return rightsData.filter(
      (right) =>
        right.eligibleSoldierType.includes(userStatus.soldierType) && right.isEligible(userStatus)
    );
  }, [rightsData, userStatus]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        {matchingRights.length > 0 ? 'Your Eligible Rights:' : 'No matching rights found'}
      </Typography>

      {Object.entries(
        matchingRights.reduce(
          (acc, right) => {
            (acc[right.subject] = acc[right.subject] || []).push(right);
            return acc;
          },
          {} as Record<RightSubject, Right[]>
        )
      ).map(([subject, rightsInSubject]) => (
        <Accordion key={subject} sx={{ mb: 4 }} defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              {subject.replace('_', ' ')}
            </Typography>
          </AccordionSummary>
          <Box key={subject} sx={{ mb: 4 }}>
            {rightsInSubject.map((right) => (
              <RightCard right={right} />
            ))}
          </Box>
        </Accordion>
      ))}
    </Box>
  );
};
