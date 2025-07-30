import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import type { Right } from '@righton/shared';
import { useEffect, useState } from 'react';

export const Rights = () => {
  const [answers, setAnswers] = useState<any>({});
  const [rights, setRights] = useState<Right[]>([]);
  const [isLocalStorageLoaded, setIsLocalStorageLoaded] = useState(false);

  useEffect(() => {
    const savedAnswers = localStorage.getItem('righton_answers');
    if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
    setIsLocalStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLocalStorageLoaded) return;

    const fetchRights = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        if (!backendUrl) {
          console.error('VITE_BACKEND_URL is not defined');
          return;
        }

        const response = await fetch(`${backendUrl}/rights/customized`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(answers),
        });
        if (!response.ok) {
          throw new Error('Failed to submit user data');
        }
        const responseJson = await response.json();
        setRights(responseJson);
      } catch (error) {
        console.error('Error fetching rights:', error);
      }
    };

    fetchRights();
  }, [isLocalStorageLoaded, answers]);

  // Group rights by category
  const groupedRights = rights.reduce(
    (groups, right) => {
      const category = right.category || 'אחר';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(right);
      return groups;
    },
    {} as Record<string, Right[]>
  );

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      {rights.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          לא נמצאו זכויות מתאימות עבורך
        </Typography>
      ) : (
        Object.entries(groupedRights).map(([category, categoryRights]) => (
          <Accordion key={category} sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
            <AccordionSummary>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: '100%' }}
              >
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.dark' }}>
                  {category}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    bgcolor: 'primary.main',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {categoryRights.length} זכויות
                </Typography>
              </Stack>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
              <Stack spacing={1}>
                {categoryRights.map((right) => (
                  <Accordion key={right.name} sx={{ bgcolor: '#ffffff', boxShadow: 1 }}>
                    <AccordionSummary>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        {right.name}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Stack spacing={1}>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                          {right.description}
                        </Typography>

                        {right.provider && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>ארגון מעניק:</strong> {right.provider}
                          </Typography>
                        )}

                        {right.eligibility && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>תנאי זכאות:</strong> {right.eligibility}
                          </Typography>
                        )}

                        {right.contact && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>איש קשר:</strong> {right.contact}
                          </Typography>
                        )}

                        {right.source && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>מקור:</strong> {right.source}
                          </Typography>
                        )}

                        {right.implementationProcess && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>תהליך יישום:</strong> {right.implementationProcess}
                          </Typography>
                        )}

                        {right.additionalInfo && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>מידע נוסף:</strong> {right.additionalInfo}
                          </Typography>
                        )}

                        {right.link && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <a
                              href={right.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#1976d2', textDecoration: 'underline' }}
                            >
                              למידע נוסף
                            </a>
                          </Typography>
                        )}
                      </Stack>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Stack>
  );
};
