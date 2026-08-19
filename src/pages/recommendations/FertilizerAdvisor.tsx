import React from 'react';
import { Box, Typography, Grid, Button, Paper, TextField, InputAdornment } from '@mui/material';
import DashboardCard from '../../components/ui/DashboardCard';
import { Science, Calculate, Description } from '@mui/icons-material';

const FertilizerAdvisor: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Fertilizer Advisor</Typography>
        <Typography variant="body1" color="text.secondary">Calculate the exact nutrient requirements for your crop and soil type.</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <DashboardCard title="NPK Calculator">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
              <TextField 
                select 
                label="Target Crop" 
                defaultValue="maize"
                SelectProps={{ native: true }}
              >
                <option value="maize">Maize</option>
                <option value="cassava">Cassava</option>
                <option value="rice">Rice</option>
              </TextField>
              <TextField 
                label="Target Yield" 
                defaultValue="5"
                InputProps={{
                  endAdornment: <InputAdornment position="end">tons/ha</InputAdornment>,
                }}
              />
              <TextField 
                label="Farm Area" 
                defaultValue="2"
                InputProps={{
                  endAdornment: <InputAdornment position="end">hectares</InputAdornment>,
                }}
              />
              <Button variant="contained" size="large" startIcon={<Calculate />}>
                Calculate Requirement
              </Button>
            </Box>
          </DashboardCard>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <DashboardCard title="Recommendation Results">
            <Box sx={{ bgcolor: 'action.hover', p: 3, borderRadius: '12px', mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Science color="primary" /> Suggested Blend: NPK 15-15-15 + Urea
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700 }}>120</Typography>
                    <Typography variant="body2" color="text.secondary">kg/ha N</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h4" sx={{ color: 'secondary.main', fontWeight: 700 }}>60</Typography>
                    <Typography variant="body2" color="text.secondary">kg/ha P₂O₅</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper elevation={0} sx={{ p: 2, textAlign: 'center', border: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="h4" sx={{ color: 'error.main', fontWeight: 700 }}>40</Typography>
                    <Typography variant="body2" color="text.secondary">kg/ha K₂O</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Application Schedule</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper elevation={0} sx={{ p: 2, borderLeft: '4px solid', borderLeftColor: 'primary.main', bgcolor: 'background.paper' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Basal Application (At Planting)</Typography>
                <Typography variant="body2" color="text.secondary">Apply 400kg of NPK 15-15-15 per hectare.</Typography>
              </Paper>
              <Paper elevation={0} sx={{ p: 2, borderLeft: '4px solid', borderLeftColor: 'secondary.main', bgcolor: 'background.paper' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Top Dressing (4 weeks after planting)</Typography>
                <Typography variant="body2" color="text.secondary">Apply 130kg of Urea per hectare.</Typography>
              </Paper>
            </Box>
            
            <Button variant="outlined" startIcon={<Description />} sx={{ mt: 3 }}>
              Export PDF Report
            </Button>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FertilizerAdvisor;
