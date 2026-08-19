import React from "react";
import { Box, Container, Grid, Typography, useTheme } from "@mui/material";
import SectionTitle from "../ui/SectionTitle";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Connect Your Farm",
    description:
      "Input your farm location, size, and basic soil characteristics. We support farms of all sizes across Nigeria.",
  },
  {
    number: "02",
    title: "AI Analysis",
    description:
      "Our system analyzes decades of local agricultural data, current weather patterns, and market trends.",
  },
  {
    number: "03",
    title: "Receive Insights",
    description:
      "Get actionable daily recommendations on what to plant, when to water, and how to protect your crops.",
  },
  {
    number: "04",
    title: "Maximize Yield",
    description:
      "Follow the guided plans, track your progress, and see your farm's productivity and profitability grow.",
  },
];

const HowItWorksSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      id="how-it-works"
      sx={{
        py: { xs: 10, md: 16 },
         pb:{xs:5},
        bgcolor: theme.palette.mode === "dark" ? "#121212" : "#F8FAF8",
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          title="From data to harvest in four steps."
          subtitle="Complex AI technology simplified into an intuitive daily workflow for farmers."
        />

        <Box sx={{ mt: 8, position: "relative" }}>
          {/* Connecting Line */}
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${theme.palette.primary.main}, transparent)`,
              display: { xs: "none", md: "block" },
              zIndex: 0,
            }}
          />

          <Grid container spacing={4}>
            {steps.map((step, index) => (
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
                key={index}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Box sx={{ position: "relative", zIndex: 1, height: "100%" }}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "1.2rem",
                        mb: 3,
                        mx: { xs: 0, md: "auto" },
                        boxShadow: "0 0 0 8px rgba(46, 125, 50, 0.1)",
                      }}
                    >
                      {step.number}
                    </Box>
                    <GlassCard
                      sx={{
                        p: 3,
                        textAlign: { xs: "left", md: "center" },
                        height: "calc(100% - 72px)",
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                        {step.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ lineHeight: 1.6 }}
                      >
                        {step.description}
                      </Typography>
                    </GlassCard>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HowItWorksSection;
