import React from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";

const CTASection: React.FC = () => {
  return (
    <Box sx={{ pb: { xs: 8, md: 16 }, px: 2 }}>
      <Container
        sx={{
          px: 0,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box
            sx={{
              maxWidth: "991px",
              marginInline: "auto",
              borderRadius: "32px",
              bgcolor: "primary.main",
              background: "linear-gradient(135deg, #1B5E20 0%, #43A047 100%)",
              color: "white",
              p: { xs: 4, md: 8 },
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 24px 48px rgba(46, 125, 50, 0.25)",
            }}
          >
            {/* Background pattern */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                backgroundSize: "32px 32px",
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
                }}
              >
                Ready to transform your farm?
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 5,
                  fontWeight: 400,
                  opacity: 0.9,
                  maxWidth: "600px",
                  mx: "auto",
                  fontSize: { xs: "1rem", md: "1.5rem" },
                }}
              >
                Join the platform bringing artificial intelligence to Nigerian
                agriculture. Increase yield, reduce waste, and farm smarter
                today.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: "white",
                    color: "primary.dark",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                    py: 1.5,
                    px: 4,
                    fontSize: "1.1rem",
                  }}
                >
                  Create Free Account
                </Button>
              </Box>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default CTASection;
