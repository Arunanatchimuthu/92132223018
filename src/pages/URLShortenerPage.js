import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import { useLogger } from '../context/LoggerContext';

const URLShortenerPage = ({ onAdd, links }) => {
  const [urls, setUrls] = useState([
    { url: '', expiry: '', code: '', isLoading: false, message: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { log, logError, logWarning } = useLogger();

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { url: '', expiry: '', code: '', isLoading: false, message: '' }]);
      log(`Added new URL field. Total fields: ${urls.length + 1}`);
    } else {
      logWarning('Maximum number of URL fields (5) reached');
    }
  };

  const removeUrlField = (index) => {
    if (urls.length > 1) {
      setUrls(urls.filter((_, i) => i !== index));
      log(`Removed URL field at index ${index}. Remaining fields: ${urls.length - 1}`);
    } else {
      logWarning('Cannot remove the last URL field');
    }
  };

  const updateUrl = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validateInputs = () => {
    const errors = [];
    urls.forEach((urlData, index) => {
      if (urlData.url && !validateUrl(urlData.url)) {
        errors.push(`Row ${index + 1}: Invalid URL format`);
      }
      if (urlData.expiry && (isNaN(urlData.expiry) || urlData.expiry < 1)) {
        errors.push(`Row ${index + 1}: Expiry must be a positive number`);
      }
      if (urlData.code && !/^[a-zA-Z0-9_-]+$/.test(urlData.code)) {
        errors.push(`Row ${index + 1}: Custom code must be alphanumeric with hyphens/underscores only`);
      }
    });
    return errors;
  };

  const handleShorten = async (index) => {
    const urlData = urls[index];
    if (!urlData.url) {
      updateUrl(index, 'message', 'URL is required');
      logWarning(`URL shortening attempted without URL at index ${index}`);
      return;
    }

    const errors = validateInputs();
    if (errors.length > 0) {
      updateUrl(index, 'message', errors.join(', '));
      logError(`Validation errors for URL shortening at index ${index}`, errors);
      return;
    }

    updateUrl(index, 'isLoading', true);
    updateUrl(index, 'message', '');

    const payload = {
      originalUrl: urlData.url,
      expiry: urlData.expiry ? parseInt(urlData.expiry) : 30,
      customCode: urlData.code || undefined
    };

    log(`Sending request to shorten URL: ${urlData.url} (index: ${index})`);

    try {
      const res = await fetch('http://localhost:5000/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        onAdd(data);
        log(`Successfully shortened URL: ${urlData.url} -> ${data.shortCode}`);
        updateUrl(index, 'message', 'URL shortened successfully!');
        updateUrl(index, 'url', '');
        updateUrl(index, 'expiry', '');
        updateUrl(index, 'code', '');
      } else {
        logError(`Failed to shorten URL: ${urlData.url}`, data.error);
        updateUrl(index, 'message', data.error);
      }
    } catch (error) {
      logError(`Network error while shortening URL: ${urlData.url}`, error);
      updateUrl(index, 'message', 'Network error. Please try again.');
    } finally {
      updateUrl(index, 'isLoading', false);
    }
  };

  const handleShortenAll = async () => {
    setIsSubmitting(true);
    const validUrls = urls.filter(urlData => urlData.url.trim());
    
    if (validUrls.length === 0) {
      logWarning('Attempted to shorten all URLs but no valid URLs found');
      setIsSubmitting(false);
      return;
    }

    log(`Starting bulk URL shortening for ${validUrls.length} URLs`);

    for (let i = 0; i < validUrls.length; i++) {
      if (validUrls[i].url) {
        await handleShorten(i);
      }
    }
    
    log(`Completed bulk URL shortening operation`);
    setIsSubmitting(false);
  };

  return (
    <Box className="card-animation">
      <Typography variant="h4" gutterBottom className="gradient-text">
        Shorten URLs
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Create up to 5 shortened URLs at once. Each URL can have custom expiry time and shortcode.
      </Typography>

      <Paper elevation={2} sx={{ p: 3, mb: 3 }} className="hover-lift">
        {urls.map((urlData, index) => (
          <Card key={index} sx={{ mb: 2, border: '1px solid #e0e0e0' }} className="hover-lift">
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Long URL"
                    placeholder="https://example.com/very-long-url"
                    value={urlData.url}
                    onChange={(e) => updateUrl(index, 'url', e.target.value)}
                    error={urlData.message && !urlData.message.includes('successfully')}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Expiry (minutes)"
                    placeholder="30"
                    type="number"
                    value={urlData.expiry}
                    onChange={(e) => updateUrl(index, 'expiry', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    label="Custom Code"
                    placeholder="my-code"
                    value={urlData.code}
                    onChange={(e) => updateUrl(index, 'code', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleShorten(index)}
                    disabled={urlData.isLoading || !urlData.url}
                    startIcon={urlData.isLoading ? <CircularProgress size={20} /> : null}
                  >
                    {urlData.isLoading ? 'Shortening...' : 'Shorten'}
                  </Button>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    onClick={() => removeUrlField(index)}
                    disabled={urls.length === 1}
                  >
                    Remove
                  </Button>
                </Grid>
              </Grid>
              
              {urlData.message && (
                <Alert 
                  severity={urlData.message.includes('successfully') ? 'success' : 'error'}
                  sx={{ mt: 2 }}
                  className={urlData.message.includes('successfully') ? 'success-bounce' : ''}
                >
                  {urlData.message}
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={addUrlField}
            disabled={urls.length >= 5}
          >
            Add Another URL
          </Button>
          <Button
            variant="contained"
            onClick={handleShortenAll}
            disabled={isSubmitting || urls.every(urlData => !urlData.url)}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Shortening All...' : 'Shorten All URLs'}
          </Button>
        </Box>
      </Paper>

      {links.length > 0 && (
        <>
          <Divider sx={{ my: 3 }} />
          <Typography variant="h5" gutterBottom className="gradient-text">
            Recently Created URLs
          </Typography>
          <Grid container spacing={2}>
            {links.slice(-3).reverse().map((link, index) => (
              <Grid item xs={12} md={4} key={link.shortCode}>
                <Card className="hover-lift card-animation" style={{ animationDelay: `${index * 0.1}s` }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {link.shortCode}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {link.originalUrl}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Expires: {new Date(link.expiresAt).toLocaleString()}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Clicks: {link.clicks.length}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default URLShortenerPage; 