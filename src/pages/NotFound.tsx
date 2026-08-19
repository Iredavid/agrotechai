import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', p: 3 }}>
      <Typography variant="h1" sx={{ fontWeight: 800, color: 'primary.main', fontSize: { xs: '6rem', md: '8rem' } }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
        The page you are looking for doesn't exist or has been moved. 
      </Typography>
      <Button component={RouterLink} to="/" variant="contained" size="large">
        Return to Home
      </Button>
    </Box>
  );
};

export default NotFound;
