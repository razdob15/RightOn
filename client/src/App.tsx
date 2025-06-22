import { AppBar, Toolbar, Container } from '@mui/material';
import { HebrewMain } from './components/HebrewMain';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

export const App = () => {
  const theme = () =>
    createTheme({
      direction: 'rtl',
      palette: {
        mode: 'light', // Set the theme mode to dark
        primary: {
          main: '#90caf9', // Lighter blue for dark mode primary
        },
        secondary: {
          main: '#f48fb1', // Lighter pink for dark mode secondary
        },
      },
    });

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme()}>
        <AppBar position="static">
          <Toolbar sx={{ height: '60px' }}>
            <img src="/logo.png" width={'40px'} style={{ marginInlineStart: '10px' }} />
          </Toolbar>
        </AppBar>
        <Container
          sx={{
            paddingTop: 2,
            paddingBottom: 2,
            alignContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* <MainQuestionnaire /> */}
          <HebrewMain />
        </Container>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
