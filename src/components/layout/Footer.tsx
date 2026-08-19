import React from 'react';
import { Box, Container, Grid, Typography, IconButton, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Twitter, LinkedIn, GitHub, Instagram } from '@mui/icons-material';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#1B1B1B',
        color: '#fff',
        pt: { xs: 8, md: 12 },
        pb: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={8}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #2E7D32 0%, #8BC34A 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '20px'
                }}
              >
                A
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                AgroTech <span style={{ color: '#8BC34A' }}>AI</span>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 4, maxWidth: 300, lineHeight: 1.6 }}>
              Empowering Nigerian farmers with AI-driven insights for smarter, more profitable agriculture.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#8BC34A' } }}>
                <Twitter />
              </IconButton>
              <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#8BC34A' } }}>
                <LinkedIn />
              </IconButton>
              <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#8BC34A' } }}>
                <GitHub />
              </IconButton>
              <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#8BC34A' } }}>
                <Instagram />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
              Product
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <RouterLink to="/features" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Features</RouterLink>
              <RouterLink to="/pricing" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Pricing</RouterLink>
              <RouterLink to="/case-studies" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Case Studies</RouterLink>
              <RouterLink to="/reviews" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Reviews</RouterLink>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
              Resources
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <RouterLink to="/blog" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Blog</RouterLink>
              <RouterLink to="/guides" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Guides</RouterLink>
              <RouterLink to="/help-center" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Help Center</RouterLink>
              <RouterLink to="/api" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>API Docs</RouterLink>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
              Company
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <RouterLink to="/about" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>About Us</RouterLink>
              <RouterLink to="/careers" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Careers</RouterLink>
              <RouterLink to="/contact" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Contact</RouterLink>
              <RouterLink to="/partners" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Partners</RouterLink>
            </Box>
          </Grid>

          <Grid item xs={6} md={2}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 3 }}>
              Legal
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <RouterLink to="/privacy" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</RouterLink>
              <RouterLink to="/terms" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</RouterLink>
              <RouterLink to="/cookies" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.9rem' }}>Cookie Policy</RouterLink>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.1)', mt: 8, pt: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>
            &copy; {new Date().getFullYear()} AgroTech AI. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)' }}>Made with ❤️ in Nigeria</Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
