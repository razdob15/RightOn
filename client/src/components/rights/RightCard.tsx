import { Card, CardContent, Typography } from '@mui/material';
import type { Right } from '@righton/shared';

type Properties = {
  right: Right;
};

export const RightCard = ({ right }: Properties) => {
  return (
    <Card key={right.name} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {right.name}
        </Typography>
        <Typography variant="body1">{right.description}</Typography>
        <Typography variant="body2" color="text.secondary">
          Granting Organization: {right.provider}
        </Typography>
        {right.contact && (
          <Typography variant="body2" color="text.secondary">
            Contact: {right.contact}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};
