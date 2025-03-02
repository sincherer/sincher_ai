import React from 'react';
import { Container, AppBar, Toolbar, Typography, ThemeProvider, createTheme } from '@mui/material';
import ChatInterface from './components/ChatInterface';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            Personal AI Assistant
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <ChatInterface />
      </Container>
    </ThemeProvider>
  );
}

export default App;