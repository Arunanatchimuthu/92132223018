import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  Button
} from '@mui/material';
import { useLogger } from '../context/LoggerContext';

const RedirectPage = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [originalUrl, setOriginalUrl] = useState('');
  const { log } = useLogger();

  useEffect(() => {
    const resolveUrl = async () => {
      try {
        setIsLoading(true);
        log(`Attempting to resolve short code: ${shortCode}`);

        const response = await fetch(`http://localhost:5000/api/resolve/${shortCode}`);
        
        if (!response.ok) {
          throw new Error('Short URL not found or expired');
        }

        const data = await response.json();
        setOriginalUrl(data.originalUrl);
        
        log(`Successfully resolved ${shortCode} to ${data.originalUrl}`);
        
        // Redirect to the original URL after a short delay
        setTimeout(() => {
          window.location.href = data.originalUrl;
        }, 2000);

      } catch (error) {
        log(`Error resolving short code ${shortCode}: ${error.message}`);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    resolveUrl();
  }, [shortCode, log]);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center'
        }}
      >
        <CircularProgress size={60} sx={{ mb: 3 }} />
        <Typography variant="h5" gutterBottom>
          Redirecting...
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please wait while we redirect you to your destination.
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center'
        }}
      >
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Typography variant="h6" gutterBottom>
            Short URL Not Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            The short URL you're looking for doesn't exist or has expired.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            Create New URL
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/statistics')}
          >
            View Statistics
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center'
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 600 }}>
        <Typography variant="h5" gutterBottom>
          Redirecting to:
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            wordBreak: 'break-all', 
            mb: 3, 
            p: 2, 
            bgcolor: 'grey.100', 
            borderRadius: 1 
          }}
        >
          {originalUrl}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          You will be redirected automatically in a few seconds...
        </Typography>
        <Button
          variant="contained"
          onClick={() => window.location.href = originalUrl}
          sx={{ mr: 2 }}
        >
          Go Now
        </Button>
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
        >
          Cancel
        </Button>
      </Paper>
    </Box>
  );
};

export default RedirectPage; 