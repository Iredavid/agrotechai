import React from 'react';
import { Box, IconButton, InputBase, Avatar, Badge, useTheme } from '@mui/material';
import  Menu  from '@mui/icons-material/Menu';
import  Search  from '@mui/icons-material/Search';
import  Notifications  from '@mui/icons-material/Notifications';
import  DarkMode  from '@mui/icons-material/DarkMode';
import  LightMode  from '@mui/icons-material/LightMode';

import { Link as RouterLink } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

interface TopbarProps {
  handleDrawerToggle: () => void;
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

const Topbar: React.FC<TopbarProps> = ({ handleDrawerToggle, toggleTheme, mode }) => {
  const theme = useTheme();
  const { userData, userProfile } = useAuth();

  return (
    <Box
      sx={{
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: { xs: 2, md: 4 },
        bgcolor: 'background.paper',
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: 'sticky',
        top: 0,
        zIndex: 1100,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: 'none' } }}
        >
          <Menu />
        </IconButton>

        <Box
          sx={{
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            bgcolor: mode === 'light' ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.05)',
            px: 2,
            py: 1,
            borderRadius: '12px',
            width: 300,
          }}
        >
          <Search sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search farm records, tasks..."
            sx={{ flex: 1, fontSize: '0.9rem' }}
          />
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
        <IconButton onClick={toggleTheme} size="small">
          {mode === 'dark' ? <LightMode fontSize="small" /> : <DarkMode fontSize="small" />}
        </IconButton>
        
        <IconButton component={RouterLink} to={"/notifications"}>
          <Badge badgeContent={3} color="error">
            <Notifications sx={{ color: 'text.secondary' }} />
          </Badge>
        </IconButton>
        
        <Box component={RouterLink} to={"/profile"} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, ml: 1 }}>
          <Avatar 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer" 
            sx={{ width: 36, height: 36, border: `2px solid ${theme.palette.primary.main}` }}
          />
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Box sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{userData?.displayName || 'John Doe'}</Box>
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{userProfile?.farmName || 'Oyo State Farm'}</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
