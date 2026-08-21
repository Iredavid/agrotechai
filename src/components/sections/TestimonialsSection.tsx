import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Avatar,
  useTheme,
} from "@mui/material";
import SectionTitle from "../ui/SectionTitle";
import GlassCard from "../ui/GlassCard";
import  Star  from "@mui/icons-material/Star";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Oluwaseun Adebayo",
    role: "Maize Farmer, Oyo State",
    content:
      "Since using AgroTech AI's planting schedule, my maize yield has increased by 30%. The weather alerts have saved me from wasting expensive fertilizer twice.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Seun",
  },
  {
    name: "Chioma Nwosu",
    role: "Commercial Cassava Grower, Enugu",
    content:
      "The pest detection feature is incredible. I uploaded a picture of strange spots on my leaves, and the AI immediately identified it and suggested an organic treatment.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chioma",
  },
  {
    name: "Ibrahim Musa",
    role: "Cooperative Leader, Kaduna",
    content:
      "Our entire cooperative now uses the Market Advisory tool to know when to sell. We are no longer at the mercy of middlemen dictating prices.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ibrahim",
  },
];

const TestimonialsSection: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      id="testimonials"
      sx={{
        py: { xs: 8, md: 16 },
        bgcolor: theme.palette.mode === "dark" ? "#0a0a0a" : "#ffffff",
      }}
    >
      <Container maxWidth="lg">
        <SectionTitle
          title="Trusted by forward-thinking farmers."
          subtitle="Join thousands of farmers across Nigeria using data to secure their livelihood."
        />

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {testimonials.map((testimonial, index) => (
            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
              key={index}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ height: "100%" }}
              >
                <GlassCard
                  sx={{
                    p: 4,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{ display: "flex", gap: 0.5, mb: 3, color: "#FFB400" }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} fontSize="small" />
                    ))}
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{
                      mb: 4,
                      flexGrow: 1,
                      fontStyle: "italic",
                      lineHeight: 1.7,
                    }}
                  >
                    "{testimonial.content}"
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar
                      src={testimonial.avatar}
                      sx={{ width: 48, height: 48 }}
                    />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Box>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default TestimonialsSection;
