import React from 'react';
import { Box, Container, Accordion, AccordionSummary, AccordionDetails, Typography, useTheme } from '@mui/material';
import  ExpandMore  from '@mui/icons-material/ExpandMore';
import SectionTitle from '../ui/SectionTitle';

const faqs = [
  {
    question: "Do I need an internet connection to use AgroTech AI?",
    answer: "While an internet connection is required for live updates and the AI assistant, the app caches your daily schedule and offline recommendations so you can access crucial information while in the field."
  },
  // {
  //   question: "Is the app available in local languages?",
  //   answer: "Currently, we support English, Pidgin, Hausa, Yoruba, and Igbo. We are working on adding more local dialects to ensure accessibility for all farmers."
  // },
  {
    question: "How accurate is the weather advisory?",
    answer: "We use a combination of satellite imagery, local weather stations, and AI modeling to provide hyper-local forecasts that are significantly more accurate for your specific farm location than general weather apps."
  },
  {
    question: "How does the AI pest detection work?",
    answer: "Simply take a clear photo of the affected plant using your smartphone. Our computer vision model, trained on thousands of crop diseases specific to West Africa, will identify the issue and suggest treatments."
  },
  {
    question: "Is my farm data secure?",
    answer: "Yes. Your data is encrypted and completely private. We never share your personal farm data or location with third parties without your explicit consent."
  }
];

const FAQSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box id="faq" sx={{ py: { xs: 8, md: 16 }, bgcolor: theme.palette.mode === 'dark' ? '#121212' : '#F8FAF8' }}>
      <Container maxWidth="md">
        <SectionTitle 
          title="Frequently Asked Questions" 
          subtitle="Everything you need to know about the product and how it works."
        />

        <Box sx={{ mt: 4 }}>
          {faqs.map((faq, index) => (
            <Accordion 
              key={index}
              elevation={0}
              sx={{
                bgcolor: 'transparent',
                borderBottom: `1px solid ${theme.palette.divider}`,
                '&:before': { display: 'none' },
                '&:last-child': { borderBottom: 0 }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: 'primary.main' }} />}
                sx={{ py: 2, px: 0 }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 0, pb: 4 }}>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default FAQSection;
