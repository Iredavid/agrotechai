import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface DashboardCardProps {
  title: string | React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, action, children, noPadding = false }) => {
  return (
    <Card sx={{ minWidth: 0, height: 'fit', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{minWidth: 0, p: 3, pb: noPadding ? 0 : 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: "100%", }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.125rem' }}>
          {title}
        </Typography>
        {action && <Box>{action}</Box>}
      </Box>
      <CardContent sx={{ p: noPadding ? 0 : 3, pt: 0, flexGrow: 1, '&:last-child': { pb: noPadding ? 0 : 3 } }}>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
