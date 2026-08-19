import React from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <GlassCard sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(46, 125, 50, 0.1) 0%, rgba(139, 195, 74, 0.1) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
            mb: 3,
            '& svg': { fontSize: 24 }
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="h3" sx={{ mb: 2, fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ flexGrow: 1, lineHeight: 1.6 }}>
          {description}
        </Typography>
      </GlassCard>
    </motion.div>
  );
};

export default FeatureCard;
