import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  Paper,
  CircularProgress
} from '@mui/material';
import { ContentCopy, Refresh, Link as LinkIcon } from '@mui/icons-material';
import { useLogger } from '../context/LoggerContext';

const StatisticsPage = ({ links, onRefresh }) => {
  const { log, logWarning } = useLogger();

  const copyToClipboard = (text) => {
    try {
      navigator.clipboard.writeText(text);
      log(`Copied short URL to clipboard: ${text}`);
    } catch (error) {
      logWarning(`Failed to copy URL to clipboard: ${text}`);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getShortUrl = (shortCode) => {
    return `http://localhost:3000/${shortCode}`;
  };

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const handleRefresh = () => {
    log('Statistics page refresh requested');
    onRefresh();
  };

  return (
    <Box className="card-animation">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" className="gradient-text">
          URL Statistics
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          className="hover-lift"
        >
          Refresh
        </Button>
      </Box>

      {links.length === 0 ? (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }} className="hover-lift">
          <LinkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} className="loading-pulse" />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No shortened URLs yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first shortened URL to see statistics here.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {links.map((link, index) => (
            <Grid item xs={12} key={link.shortCode}>
              <Card elevation={2} className="hover-lift card-animation" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom className="gradient-text">
                        {link.shortCode}
                      </Typography>
                      <Chip 
                        label={isExpired(link.expiresAt) ? 'Expired' : 'Active'} 
                        color={isExpired(link.expiresAt) ? 'error' : 'success'}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip 
                        label={`${link.clicks.length} clicks`} 
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    <Tooltip title="Copy short URL">
                      <IconButton 
                        onClick={() => copyToClipboard(getShortUrl(link.shortCode))}
                        size="small"
                        className="hover-lift"
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Short URL:
                      </Typography>
                      <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                        {getShortUrl(link.shortCode)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Original URL:
                      </Typography>
                      <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                        {link.originalUrl}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Created:
                      </Typography>
                      <Typography variant="body2">
                        {formatDate(link.createdAt)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Expires:
                      </Typography>
                      <Typography variant="body2" color={isExpired(link.expiresAt) ? 'error' : 'inherit'}>
                        {formatDate(link.expiresAt)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Total Clicks:
                      </Typography>
                      <Typography variant="body2">
                        {link.clicks.length}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Status:
                      </Typography>
                      <Typography variant="body2" color={isExpired(link.expiresAt) ? 'error' : 'success'}>
                        {isExpired(link.expiresAt) ? 'Expired' : 'Active'}
                      </Typography>
                    </Grid>
                  </Grid>

                  {link.clicks.length > 0 && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom className="gradient-text">
                        Click History
                      </Typography>
                      <List dense>
                        {link.clicks.map((click, clickIndex) => (
                          <ListItem key={clickIndex} sx={{ px: 0 }} className="hover-lift">
                            <ListItemText
                              primary={
                                <Typography variant="body2">
                                  <strong>{formatDate(click.timestamp)}</strong>
                                </Typography>
                              }
                              secondary={
                                <Typography variant="body2" color="text.secondary">
                                  Source: {click.source} | Location: {click.location}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default StatisticsPage; 