import React from 'react';
import { Card, useTheme, type CardProps } from '@mui/material';

interface GlassCardProps extends CardProps {
  children: React.ReactNode;
  dark?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, dark, sx, ...props }) => {
  const theme = useTheme();
  const isDark = dark || theme.palette.mode === 'dark';

  return (
    <Card
      className={isDark ? 'glass-card-dark' : 'glass-card'}
      sx={{
        backgroundColor: 'transparent',
        backgroundImage: 'none',
        boxShadow: 'none',
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

export default GlassCard;
