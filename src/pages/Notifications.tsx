import React from 'react';
import { Box, Typography, Paper, IconButton} from '@mui/material';
import DashboardCard from '../components/ui/DashboardCard';
import Info from '@mui/icons-material/Info';
import Cloud from '@mui/icons-material/Cloud';
import LocalFlorist from '@mui/icons-material/LocalFlorist';
import CheckCircle from '@mui/icons-material/CheckCircle';
import Delete from '@mui/icons-material/Delete';


const Notifications: React.FC = () => {
  return (
    <Box maxWidth="md" mx="auto">
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>Notifications</Typography>
          <Typography variant="body1" color="text.secondary">Stay updated with alerts and AI recommendations.</Typography>
        </Box>
        <Typography variant="body2" color="primary" sx={{ cursor: 'pointer', fontWeight: 600 }}>Mark all as read</Typography>
      </Box>

      <DashboardCard title="Recent" noPadding>
        {[
          { type: 'alert', title: 'Heavy Rain Warning', desc: 'Expected heavy rainfall in the next 24 hours. Secure harvested crops.', time: '2 hours ago', icon: <Cloud color="error" />, unread: true },
          { type: 'ai', title: 'New Planting Recommendation', desc: 'Soil conditions are now optimal for planting Soybeans.', time: '5 hours ago', icon: <LocalFlorist color="primary" />, unread: true },
          { type: 'info', title: 'Market Price Update', desc: 'Maize prices have increased by 5% in your region.', time: '1 day ago', icon: <Info color="info" />, unread: false },
          { type: 'success', title: 'Task Completed', desc: 'Soil analysis report has been generated successfully.', time: '2 days ago', icon: <CheckCircle color="success" />, unread: false },
        ].map((notif, i) => (
          <Paper key={i} elevation={0} sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', borderRadius: 0, display: 'flex', gap: 3, bgcolor: notif.unread ? 'action.hover' : 'transparent', '&:hover': { bgcolor: 'action.hover' } }}>
            <Box sx={{ pt: 0.5 }}>{notif.icon}</Box>
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="subtitle1" fontWeight={notif.unread ? 700 : 500}>{notif.title}</Typography>
                <Typography variant="caption" color="text.secondary">{notif.time}</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">{notif.desc}</Typography>
            </Box>
            <IconButton size="small"><Delete fontSize="small" /></IconButton>
          </Paper>
        ))}
      </DashboardCard>
    </Box>
  );
};

export default Notifications;
