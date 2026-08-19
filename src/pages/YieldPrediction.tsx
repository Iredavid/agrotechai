import React from "react";
import { Box, Typography, Grid, Paper, Button, useTheme } from "@mui/material";
import DashboardCard from "../components/ui/DashboardCard";
import { TrendingUp, Assessment } from "@mui/icons-material";
import { motion } from "framer-motion";

const YieldPrediction: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Yield Prediction
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI forecasts based on current crop health, weather patterns, and
          historical data.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DashboardCard title="Estimated Harvest">
              <Box sx={{ textAlign: "center", py: 3 }}>
                <Typography
                  variant="h2"
                  sx={{ fontWeight: 700, color: "primary.main", mb: 1 }}
                >
                  4.5
                  <span
                    style={{
                      fontSize: "1.5rem",
                      color: theme.palette.text.secondary,
                    }}
                  >
                    {" "}
                    tons/ha
                  </span>
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "success.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 0.5,
                    fontWeight: 600,
                  }}
                >
                  <TrendingUp fontSize="small" /> +12% vs last season
                </Typography>
              </Box>

              <Box
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: "action.hover",
                  borderRadius: "12px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Crop
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Maize (Oba Super 6)
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Planted
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    May 15, 2024
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Expected Harvest
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Sep 10 - Sep 20, 2024
                  </Typography>
                </Box>
              </Box>
            </DashboardCard>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <DashboardCard
              title="Yield Growth Projection"
              action={
                <Button size="small" startIcon={<Assessment />}>
                  Detailed Report
                </Button>
              }
            >
              <Box
                sx={{
                  height: 300,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 2,
                  pt: 4,
                  pb: 2,
                  position: "relative",
                }}
              >
                {/* Mock Chart */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    pb: 4,
                  }}
                >
                  {[4, 3, 2, 1, 0].map((val) => (
                    <Box
                      key={val}
                      sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ width: 20 }}
                      >
                        {val}t
                      </Typography>
                      <Box
                        sx={{
                          flexGrow: 1,
                          height: 1,
                          bgcolor: "divider",
                          borderTop: "1px dashed",
                        }}
                      />
                    </Box>
                  ))}
                </Box>

                {/* Bars */}
                {["Month 1", "Month 2", "Month 3", "Month 4 (Proj)"].map(
                  (month, i) => (
                    <Box
                      key={month}
                      sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        zIndex: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: "60%",
                          height: `${(i + 1) * 22}%`,
                          bgcolor: i === 3 ? "secondary.main" : "primary.main",
                          opacity: i === 3 ? 0.7 : 1,
                          borderRadius: "8px 8px 0 0",
                          transition: "height 1s ease-out",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ mt: 1, color: "text.secondary" }}
                      >
                        {month}
                      </Typography>
                    </Box>
                  ),
                )}
              </Box>
            </DashboardCard>
          </motion.div>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <DashboardCard title="Factors Affecting Yield">
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "12px",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "success.main", fontWeight: 600, mb: 1 }}
                    >
                      Positive Impact
                    </Typography>
                    <Typography variant="body2">
                      • Optimal rainfall in early vegetative stage (+5%)
                    </Typography>
                    <Typography variant="body2">
                      • Timely fertilizer application (+3%)
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: "12px",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ color: "error.main", fontWeight: 600, mb: 1 }}
                    >
                      Negative Impact
                    </Typography>
                    <Typography variant="body2">
                      • Mild pest infestation in Week 4 (-2%)
                    </Typography>
                    <Typography variant="body2">
                      • Slightly lower than average soil pH (-1%)
                    </Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      bgcolor: "primary.light",
                      color: "primary.contrastText",
                      borderRadius: "12px",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      AI Recommendation
                    </Typography>
                    <Typography variant="body2">
                      Apply potassium-rich foliar spray within the next 5 days
                      to boost grain filling and potentially increase yield by
                      another 2-4%.
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </DashboardCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default YieldPrediction;
