import React from 'react';
import { Box, Typography, Grid, Paper, Button, IconButton, Chip } from '@mui/material';
import DashboardCard from '../components/ui/DashboardCard';
import ChevronLeft  from '@mui/icons-material/ChevronLeft';
import ChevronRight  from '@mui/icons-material/ChevronRight';
import CheckCircle  from '@mui/icons-material/CheckCircle';
import RadioButtonUnchecked  from '@mui/icons-material/RadioButtonUnchecked';

const tasks = [
  { id: 1, date: '12', day: 'Mon', title: 'Apply Urea Top Dressing', crop: 'Maize Field A', completed: false, type: 'fertilizer' },
  { id: 2, date: '14', day: 'Wed', title: 'Scout for Fall Armyworm', crop: 'Maize Field A & B', completed: false, type: 'scouting' },
  { id: 3, date: '18', day: 'Sun', title: 'Weeding', crop: 'Cassava Plot 1', completed: false, type: 'maintenance' },
];

const FarmPlanner: React.FC = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Farm Planner</Typography>
          <Typography variant="body1" color="text.secondary">Smart scheduling for optimal farm operations.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          New Task
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <DashboardCard 
            title="August 2024" 
            action={
              <Box>
                <IconButton size="small"><ChevronLeft /></IconButton>
                <IconButton size="small"><ChevronRight /></IconButton>
              </Box>
            }
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {tasks.map(task => (
                <Paper key={task.id} elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ textAlign: 'center', minWidth: 60, pr: 2, borderRight: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary" display="block">{task.day}</Typography>
                    <Typography variant="h5" color="primary.main" fontWeight={700}>{task.date}</Typography>
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600}>{task.title}</Typography>
                    <Typography variant="body2" color="text.secondary">{task.crop}</Typography>
                  </Box>
                  <Chip 
                    label={task.type} 
                    size="small" 
                    sx={{ 
                      textTransform: 'capitalize',
                      bgcolor: task.type === 'fertilizer' ? 'secondary.light' : task.type === 'scouting' ? 'warning.light' : 'info.light',
                      color: task.type === 'fertilizer' ? 'secondary.contrastText' : task.type === 'scouting' ? 'warning.contrastText' : 'info.contrastText'
                    }} 
                  />
                  <IconButton color={task.completed ? 'primary' : 'default'}>
                    {task.completed ? <CheckCircle /> : <RadioButtonUnchecked />}
                  </IconButton>
                </Paper>
              ))}
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <DashboardCard title="AI Suggested Schedule">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Based on weather forecasts and crop growth stage, we recommend scheduling these activities:
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderLeft: '4px solid', borderLeftColor: 'primary.main', borderRadius: '4px 12px 12px 4px' }}>
                <Typography variant="subtitle2" fontWeight={600}>Irrigation</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Expected dry spell next week. Increase irrigation frequency for Soybeans.</Typography>
                <Button size="small" variant="outlined">Add to Calendar</Button>
              </Paper>
              
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderLeft: '4px solid', borderLeftColor: 'warning.main', borderRadius: '4px 12px 12px 4px' }}>
                <Typography variant="subtitle2" fontWeight={600}>Harvesting Prep</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Maize harvest window opens in 14 days. Ensure storage facilities are ready.</Typography>
                <Button size="small" variant="outlined">Add to Calendar</Button>
              </Paper>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FarmPlanner;
