import React from "react";
import { Box, Button, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import ArrowForward from "@mui/icons-material/ArrowForward";
const Hero: React.FC = () => {
  return (
    <Box
      sx={{
        position: "relative",
        pt: { xs: 10, sm: 15, md: 15 },
        pb: { xs: 5, md: 10 },
        overflow: "hidden",
      }}
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: "-15%", md: "-20%" },
          right: { xs: "-35%", md: "-10%" },
          width: { xs: "120%", md: "70%" },
          height: { xs: "60%", md: "80%" },
          background:
            "radial-gradient(ellipse, rgba(139,195,74,0.12) 0%, rgba(139,195,74,0.04) 35%, transparent 75%)",
          filter: "blur(30px)",
          transform: "translateZ(0)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: { xs: "-15%", md: "-10%" },
          left: { xs: "-35%", md: "-10%" },
          width: { xs: "120%", md: "65%" },
          height: { xs: "60%", md: "70%" },
          background:
            "radial-gradient(ellipse, rgba(46,125,50,0.08) 0%, rgba(46,125,50,0.03) 35%, transparent 75%)",
          filter: "blur(30px)",
          transform: "translateZ(0)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <Container
        maxWidth="lg"
        sx={{ position: "relative", zIndex: 1, paddingTop: { xs: 2, md: 0 } }}
      >
        <Grid
          container
          sx={{
            gap: { xs: 4, md: 4, lg: 0 },
            alignItems: "center",
          }}
        >
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
            sx={{
              alignItems: "center",
              display: { xs: "flex", md: "block" },
              flexDirection: "column",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: {
                    xs: "2rem",
                    sm: "3rem",
                    md: "3rem",
                    lg: "3.5rem",
                  },
                  lineHeight: 1.1,
                  mb: 3,
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                Smarter farming,
                <br />
                <span className="text-gradient">powered by AI.</span>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  color: "text.secondary",
                  mb: 3,
                  maxWidth: "500px",
                  lineHeight: 1.6,
                }}
              >
                AgroTech AI analyzes soil data, weather patterns, and market
                trends to give Nigerian farmers actionable insights for maximum
                yield and profitability.
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{ py: 1.5, px: 3, fontSize: "1.1rem" }}
              >
                Start Farming Smarter
              </Button>
            </motion.div>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 5.5,
              lg: 6,
            }}
            sx={{
              display: { xs: "flex", md: "block" },
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "100%", sm: "500px", md: "100%" },
                  height: { xs: "350px", sm: "450px" },
                  borderRadius: "24px",
                  background: (theme) =>
                    theme.palette.mode === "dark"
                      ? "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)"
                      : "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)",
                  backdropFilter: "blur(20px)",
                  border: (theme) =>
                    `1px solid ${
                      theme.palette.mode === "dark"
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(255,255,255,0.5)"
                    }`,
                  boxShadow: (theme) =>
                    theme.palette.mode === "dark"
                      ? "0 20px 40px rgba(0,0,0,0.4)"
                      : "0 20px 40px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "visible",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: "90%",
                    height: "90%",
                    borderRadius: "16px",
                    overflow: "hidden",
                    cursor: "pointer",
                    isolation: "isolate",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                    transition: "box-shadow 0.35s ease",

                    "&:hover": {
                      boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
                    },

                    "&:hover .hero-photo": {
                      transform: "scale(1.035)",
                      filter: "saturate(1.08) contrast(1.03)",
                    },

                    "&:hover .hero-shine": {
                      transform: "translateX(322%)",
                    },
                  }}
                >
                  {/* Farmer photo */}
                  <Box
                    component="img"
                    className="hero-photo"
                    src="https://res.cloudinary.com/ffkfh5xr/image/upload/f_auto,q_auto/v1786130689/agricHero_rzf5cm.avif"
                    alt="Nigerian farmer using AgroTech AI in the field"
                    loading="eager"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center 30%",
                      display: "block",
                      transform: "scale(1)",
                      transformOrigin: "center center",
                      backfaceVisibility: "hidden",
                      willChange: "transform, filter",
                      transition:
                        "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), filter 0.4s ease",
                    }}
                  />

                  {/* Shine sweep */}
                  <Box
                    className="hero-shine"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: "-45%",
                      width: "45%",
                      height: "100%",

                      background:
                        "linear-gradient(110deg, transparent 0%, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0.06) 75%, transparent 100%)",

                      transform: "translateX(0)",
                      transition:
                        "transform 0.85s cubic-bezier(0.22, 1, 0.36, 1)",

                      pointerEvents: "none",
                      zIndex: 2,
                      willChange: "transform",
                    }}
                  />

                  {/* Bottom gradient */}
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.15) 100%)",
                      pointerEvents: "none",
                      zIndex: 1,
                    }}
                  />
                </Box>
                {/* Floating Widgets — unchanged */}
                <Box
                  sx={{
                    position: "absolute",
                    top: { xs: 30, sm: 40 },
                    right: { xs: -10, sm: -30 },
                    width: 180,
                    height: 70,
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 10px 30px rgba(0,0,0,0.5)"
                        : "0 10px 30px rgba(0,0,0,0.1)",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "8px",
                      bgcolor: "primary.light",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.5rem",
                    }}
                  >
                    🌾
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      Expected Yield
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      +24.5%
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: { xs: 30, sm: 60 },
                    left: { xs: -10, sm: -30 },
                    width: 180,
                    height: 70,
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    boxShadow: (theme) =>
                      theme.palette.mode === "dark"
                        ? "0 10px 30px rgba(0,0,0,0.5)"
                        : "0 10px 30px rgba(0,0,0,0.1)",
                    p: 1.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "8px",
                      bgcolor: "primary.light",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "1.5rem",
                    }}
                  >
                    💧
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block" }}
                    >
                      Soil Moisture
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Optimal (42%)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
