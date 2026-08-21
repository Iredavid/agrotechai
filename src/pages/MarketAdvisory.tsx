import React from 'react';
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button } from '@mui/material';
import DashboardCard from '../components/ui/DashboardCard';
import { mockMarket } from '../utils/mockData';
import TrendingUp from '@mui/icons-material/TrendingUp';
import TrendingDown from '@mui/icons-material/TrendingDown';
import TrendingFlat from '@mui/icons-material/TrendingFlat';


const MarketAdvisory: React.FC = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Market Advisory</Typography>
        <Typography variant="body1" color="text.secondary">Real-time commodity prices and AI-powered market trends.</Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <DashboardCard title="Current Market Prices (Local Hub)">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Commodity</TableCell>
                    <TableCell>Price (NGN)</TableCell>
                    <TableCell>Unit</TableCell>
                    <TableCell>Trend</TableCell>
                    <TableCell align="right">Change (7d)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockMarket.map((item) => (
                    <TableRow key={item.commodity}>
                      <TableCell sx={{ fontWeight: 600 }}>{item.commodity}</TableCell>
                      <TableCell>₦{item.price.toLocaleString()}</TableCell>
                      <TableCell>{item.unit}</TableCell>
                      <TableCell>
                        <Chip 
                          icon={item.trend === 'up' ? <TrendingUp /> : item.trend === 'down' ? <TrendingDown /> : <TrendingFlat />}
                          label={item.trend}
                          size="small"
                          color={item.trend === 'up' ? 'success' : item.trend === 'down' ? 'error' : 'default'}
                          sx={{ textTransform: 'capitalize' }}
                        />
                      </TableCell>
                      <TableCell align="right" sx={{ color: item.change > 0 ? 'success.main' : item.change < 0 ? 'error.main' : 'text.primary', fontWeight: 600 }}>
                        {item.change > 0 ? '+' : ''}{item.change}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <DashboardCard title="Price Forecast (Next 30 Days)">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: '12px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>Maize (White)</Typography>
                    <Typography variant="body2" color="text.secondary">High Confidence Prediction</Typography>
                  </Box>
                  <Chip label="Bullish" color="success" size="small" />
                </Box>
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  Prices are expected to rise by 5-8% in the coming month due to high demand from feed mills and slightly lower early-season yields in northern producing states.
                </Typography>
                <Typography variant="subtitle2" sx={{ mt: 2, color: 'primary.main', fontWeight: 600 }}>
                  AI Advice: Hold stock if storage allows.
                </Typography>
              </Paper>
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <DashboardCard title="Market Demands">
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Buyers looking for produce in your region:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>AgroFeed Mills Ltd</Typography>
                  <Typography variant="caption" color="text.secondary">Looking for: Soybeans (50+ tons)</Typography>
                </Box>
                <Button size="small" variant="outlined">Contact</Button>
              </Paper>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" fontWeight={600}>Lagos Fresh Markets</Typography>
                  <Typography variant="caption" color="text.secondary">Looking for: Cassava Tubers (Any qty)</Typography>
                </Box>
                <Button size="small" variant="outlined">Contact</Button>
              </Paper>
            </Box>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MarketAdvisory;
