import React from "react";
import { Box, Button, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { ArrowForward } from "@mui/icons-material";

const Hero: React.FC = () => {
  return (
    <Box
      sx={{
        position: "relative",
        pt: { xs: 16, md: 15 },
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

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Grid
          container
          sx={{
            gap: { xs: 6, md: 4, lg: 0 },
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
                  mb: 5,
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
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
                {/* <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    py: 1.5,
                    px: 3,
                    fontSize: "1.1rem",
                    borderColor: "primary.main",
                    color: "primary.main",
                  }}
                >
                  View Demo
                </Button> */}
              </Box>
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
            >
              <Box
                sx={{
                  position: "relative",
                  width: { xs: "330px", sm: "450px", md: "100%", xxs: "100px" },
                  height: { xs: 300, md: 450 },
                  borderRadius: "24px",
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.5)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "visible",
                }}
              >
                {/* Placeholder for dashboard mockup */}
                <Box
                  sx={{
                    width: "90%",
                    height: "85%",
                    borderRadius: "16px",
                    bgcolor: "#f5f5f5",
                    border: "1px solid rgba(0,0,0,0.05)",
                    boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Mock Navbar */}
                  <Box
                    sx={{
                      height: 48,
                      borderBottom: "1px solid #e0e0e0",
                      display: "flex",
                      alignItems: "center",
                      px: 2,
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#ff5f56",
                      }}
                    />
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#ffbd2e",
                      }}
                    />
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: "#27c93f",
                      }}
                    />
                  </Box>
                  {/* Mock Content */}
                  <Box sx={{ flexGrow: 1, p: 3, display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        width: "30%",
                        height: "100%",
                        bgcolor: "#e0e0e0",
                        borderRadius: "8px",
                      }}
                    />
                    <Box
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          height: "40%",
                          bgcolor: "#e0e0e0",
                          borderRadius: "8px",
                        }}
                      />
                      <Box sx={{ display: "flex", gap: 2, height: "60%" }}>
                        <Box
                          sx={{
                            flex: 1,
                            bgcolor: "#e0e0e0",
                            borderRadius: "8px",
                          }}
                        />
                        <Box
                          sx={{
                            flex: 1,
                            bgcolor: "#e0e0e0",
                            borderRadius: "8px",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Floating Widgets */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 40,
                    right: -20,
                    width: 140,
                    height: 80,
                    bgcolor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    p: 1.5,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Expected Yield
                  </Typography>
                  <Typography
                    variant="h6"
                    color="primary.main"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    +24.5%
                  </Typography>
                </Box>
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 60,
                    left: {xs:-15, sm:-30},
                    width: 200,
                    height: 70,
                    bgcolor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
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
                    }}
                  >
                    💧
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                      }}
                    >
                      Soil Moisture
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                      }}
                    >
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
