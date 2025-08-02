import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import URLShortenerPage from './pages/URLShortenerPage';
import StatisticsPage from './pages/StatisticsPage';
import RedirectPage from './pages/RedirectPage';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
});

function App() {
  const [links, setLinks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError('');
      const res = await fetch('http://localhost:5000/api/statistics');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setLinks(data);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      setError('Unable to connect to server. Please make sure the backend is running on port 5000.');
      setLinks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addLink = (newLink) => {
    setLinks(prev => [...prev, newLink]);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                🔗 URL Shortener
              </Typography>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/"
              >
                Shorten URLs
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/statistics"
              >
                Statistics
              </Button>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Routes>
              <Route 
                path="/" 
                element={
                  <URLShortenerPage 
                    onAdd={addLink} 
                    links={links}
                  />
                } 
              />
              <Route 
                path="/statistics" 
                element={
                  <StatisticsPage 
                    links={links}
                    onRefresh={fetchStats}
                  />
                } 
              />
              <Route 
                path="/:shortCode" 
                element={<RedirectPage />} 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;

