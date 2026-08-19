import React from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  light?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ title, subtitle, align = 'center', light = false }) => {
  return (
    <Box sx={{ mb: 6, textAlign: align }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h2"
          component="h2"
          sx={{
            color: light ? '#fff' : 'text.primary',
            mb: 2,
            fontSize: { xs: '1.5rem',sm:"2rem", md: '2.5rem' },
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>
        {subtitle && (
          <Typography
            variant="subtitle1"
            sx={{
              color: light ? 'rgba(255,255,255,0.8)' : 'text.secondary',
              maxWidth: '600px',
              mx: align === 'center' ? 'auto' : 0,
              fontSize: '1.125rem',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </motion.div>
    </Box>
  );
};

export default SectionTitle;
