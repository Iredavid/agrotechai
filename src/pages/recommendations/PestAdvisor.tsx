import React from 'react';
import { Box, Typography, Grid, Button, Paper, Alert } from '@mui/material';
import DashboardCard from '../../components/ui/DashboardCard';
import { BugReport, CameraAlt, Upload } from '@mui/icons-material';

const PestAdvisor: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Pest & Disease Advisor</Typography>
        <Typography variant="body1" color="text.secondary">Upload photos of affected plants for AI-powered diagnosis.</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DashboardCard title="AI Diagnosis">
            <Box
              sx={{
                border: '2px dashed',
                borderColor: 'divider',
                borderRadius: '16px',
                p: 6,
                textAlign: 'center',
                bgcolor: 'action.hover',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.selected'
                }
              }}
            >
              <CameraAlt sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Upload or take a picture</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Focus on the affected leaves or pests.
              </Typography>
              <Button variant="contained" startIcon={<Upload />}>
                Select Image
              </Button>
            </Box>

            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>Recent Scans</Typography>
              <Paper elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, border: '1px solid', borderColor: 'divider' }}>
                <Box sx={{ width: 60, height: 60, borderRadius: '8px', bgcolor: '#e0e0e0', backgroundImage: 'url(https://images.unsplash.com/photo-1595841696677-6479bc3f6251?auto=format&fit=crop&w=100&q=80)', backgroundSize: 'cover' }} />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Fall Armyworm detected</Typography>
                  <Typography variant="caption" color="text.secondary">Maize Field A • 2 days ago</Typography>
                </Box>
                <Button size="small" variant="outlined">View</Button>
              </Paper>
            </Box>
          </DashboardCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DashboardCard title="Active Threats in Your Area">
            <Alert severity="error" icon={<BugReport />} sx={{ mb: 3, borderRadius: '12px' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>High Risk: Fall Armyworm</Typography>
              <Typography variant="body2">Reports of infestations in neighboring farms. Preventative spraying recommended.</Typography>
            </Alert>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Treatment Protocol</Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>Organic Approach</Typography>
                <Typography variant="body2" color="text.secondary">Apply Neem oil extract or Bacillus thuringiensis (Bt) during early morning or late evening.</Typography>
              </Paper>
              
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'error.main', mb: 1 }}>Chemical Approach</Typography>
                <Typography variant="body2" color="text.secondary">Use Emamectin benzoate or Spinetoram based insecticides. Ensure to follow safety guidelines.</Typography>
              </Paper>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PestAdvisor;
