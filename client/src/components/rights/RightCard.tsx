import { Card, CardContent, Typography } from '@mui/material';
import type { Right } from '../../types/rights';

type Properties = {
  right: Right;
};

export const RightCard = ({ right }: Properties) => {
  return (
    <Card key={right.rightName} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {right.rightName}
        </Typography>
        <Typography variant="body1">{right.details}</Typography>
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
  );
};
