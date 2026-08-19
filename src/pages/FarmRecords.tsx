import React from 'react';
import { Box, Typography, Grid, Paper, Button, TextField, InputAdornment } from '@mui/material';
import DashboardCard from '../components/ui/DashboardCard';
import { Add, Search, ReceiptLong, AccountBalanceWallet } from '@mui/icons-material';

const FarmRecords: React.FC = () => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Farm Records</Typography>
          <Typography variant="body1" color="text.secondary">Manage your inventory, expenses, and farm inputs securely.</Typography>
        </Box>
        <Button variant="contained" startIcon={<Add />}>
          Add Record
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <DashboardCard title="Summary">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: '12px' }}>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>Total Expenses (YTD)</Typography>
                <Typography variant="h4" fontWeight={700}>₦1,245,000</Typography>
              </Paper>
              <Paper elevation={0} sx={{ p: 2, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: '12px' }}>
                <Typography variant="caption" sx={{ opacity: 0.9 }}>Total Revenue (YTD)</Typography>
                <Typography variant="h4" fontWeight={700}>₦3,850,000</Typography>
              </Paper>
            </Box>
          </DashboardCard>
        </Grid>

        <Grid item xs={12} md={8}>
          <DashboardCard 
            title="Recent Transactions" 
            action={
              <TextField 
                size="small" 
                placeholder="Search records..." 
                InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
              />
            }
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                { date: 'Aug 10', desc: 'NPK Fertilizer Purchase', category: 'Input', amount: '-₦145,000', type: 'expense' },
                { date: 'Aug 05', desc: 'Tractor Rental', category: 'Equipment', amount: '-₦40,000', type: 'expense' },
                { date: 'Jul 28', desc: 'Cassava Sales (Batch 1)', category: 'Revenue', amount: '+₦450,000', type: 'income' },
                { date: 'Jul 15', desc: 'Labor Payment', category: 'Labor', amount: '-₦85,000', type: 'expense' },
              ].map((record, i) => (
                <Paper key={i} elevation={0} sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'divider', borderRadius: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: '8px' }}>
                      {record.type === 'income' ? <AccountBalanceWallet color="success" /> : <ReceiptLong color="error" />}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{record.desc}</Typography>
                      <Typography variant="caption" color="text.secondary">{record.date} • {record.category}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700} color={record.type === 'income' ? 'success.main' : 'error.main'}>
                    {record.amount}
                  </Typography>
                </Paper>
              ))}
            </Box>
            <Button fullWidth sx={{ mt: 2 }}>View All Records</Button>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FarmRecords;
