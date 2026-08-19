import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import FeaturesSection from '../components/sections/FeaturesSection';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import TestimonialsSection from '../components/sections/TestimonialsSection';
import FAQSection from '../components/sections/FAQSection';
import CTASection from '../components/sections/CTASection';

interface LandingProps {
  toggleTheme: () => void;
  mode: 'light' | 'dark';
}

const Landing: React.FC<LandingProps> = ({ toggleTheme, mode }) => {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar toggleTheme={toggleTheme} mode={mode} />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Hero />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
      </Box>
      <Footer />
    </Box>
  );
};

export default Landing;
