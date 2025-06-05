import React, { useState } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material'
import { MainQuestionnaire } from './components/MainQuestionnaire'

const theme = createTheme({
  palette: {
    mode: 'dark', // Set the theme mode to dark
    primary: {
      main: '#90caf9', // Lighter blue for dark mode primary
    },
    secondary: {
      main: '#f48fb1', // Lighter pink for dark mode secondary
    },
  },
})

function App() {
  const [view, setView] = useState<'form' | 'chat'>('chat')

  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: 'form' | 'chat' | null
  ) => {
    if (newView !== null) {
      setView(newView)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Lone Soldier Rights Portal
          </Typography>
          {/* <ToggleButtonGroup
            color="standard"
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="view mode"
            sx={{
              bgcolor: 'white',
              '& .MuiToggleButton-root.Mui-selected': {
                bgcolor: 'rgba(255, 255, 255, 0.8)',
              }
            }}
          >
            <ToggleButton value="chat">
              Chat View
            </ToggleButton>
            <ToggleButton value="form">
              Form View
            </ToggleButton>
          </ToggleButtonGroup> */}
        </Toolbar>
      </AppBar>
      <Container>
        <MainQuestionnaire />
      </Container>
    </ThemeProvider>
  )
}

export default App
