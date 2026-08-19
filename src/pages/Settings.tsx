import React from 'react';
import { Box, Typography, Grid, Paper, Switch, FormControlLabel, Button, Divider } from '@mui/material';
import DashboardCard from '../components/ui/DashboardCard';

const Settings: React.FC = () => {
  return (
    <Box maxWidth="lg" mx="auto">
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>Settings</Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <DashboardCard title="Notifications">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Weather Alerts" />
              <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Pest & Disease Warnings" />
              <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Market Price Updates" />
              <FormControlLabel control={<Switch color="primary" />} label="Daily Farm Summary Email" />
              <FormControlLabel control={<Switch defaultChecked color="primary" />} label="Task Reminders" />
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <DashboardCard title="App Preferences">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>Language</Typography>
                <Button variant="outlined" size="small" sx={{ mr: 1 }}>English</Button>
                <Button variant="text" size="small" sx={{ mr: 1, color: 'text.secondary' }}>Pidgin</Button>
                <Button variant="text" size="small" sx={{ color: 'text.secondary' }}>Hausa</Button>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>Measurement Units</Typography>
                <Button variant="outlined" size="small" sx={{ mr: 1 }}>Metric (kg, ha, °C)</Button>
                <Button variant="text" size="small" sx={{ color: 'text.secondary' }}>Imperial</Button>
              </Box>
            </Box>
          </DashboardCard>

          <Box sx={{ mt: 3 }}>
            <DashboardCard title="Account Security">
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="outlined" color="primary">Change Password</Button>
                <Button variant="outlined" color="error">Delete Account</Button>
              </Box>
            </DashboardCard>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
