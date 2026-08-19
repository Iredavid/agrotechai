import React from "react";
import { Box, Container, Grid, useTheme } from "@mui/material";
import SectionTitle from "../ui/SectionTitle";
import FeatureCard from "../ui/FeatureCard";
import {
  Grass,
  CloudQueue,
  BugReport,
  TrendingUp,
  EventNote,
  SmartToy,
} from "@mui/icons-material";

const features = [
  {
    title: "Crop Recommendation",
    description:
      "AI-driven suggestions for the best crops to plant based on your specific soil data, location, and season.",
    icon: <Grass />,
  },
  {
    title: "Weather Advisory",
    description:
      "Hyper-local weather forecasts and alerts tailored to agricultural needs, helping you plan watering and harvesting.",
    icon: <CloudQueue />,
  },
  {
    title: "Pest Detection",
    description:
      "Early warning systems and identification tools for pests and diseases, protecting your yield before damage occurs.",
    icon: <BugReport />,
  },
  {
    title: "Yield Prediction",
    description:
      "Advanced machine learning models forecast your expected harvest, allowing for better market planning.",
    icon: <TrendingUp />,
  },
  {
    title: "Farm Planner",
    description:
      "Smart scheduling for all farm activities, from planting to harvesting, ensuring optimal resource allocation.",
    icon: <EventNote />,
  },
  {
    title: "AI Assistant",
    description:
      "24/7 agricultural expert in your pocket. Ask any farming question and get immediate, science-backed answers.",
    icon: <SmartToy />,
  },
];

const FeaturesSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      id="features"
      sx={{
        py: { xs: 10, md: 16 },
        pb:{xs:5},
        bgcolor: theme.palette.mode === "dark" ? "#0a0a0a" : "#ffffff",
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          title="Everything you need to grow smarter."
          subtitle="A comprehensive suite of AI tools designed specifically for the challenges of modern Nigerian agriculture."
        />

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 4,
              }}
              key={index}
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                delay={index * 0.1}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
