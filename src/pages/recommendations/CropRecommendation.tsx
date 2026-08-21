import React from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  LinearProgress,
  Chip,
} from "@mui/material";
import DashboardCard from "../../components/ui/DashboardCard";
import Grass from "@mui/icons-material/Grass";
import Spa from "@mui/icons-material/Spa";
import TrendingUp from "@mui/icons-material/TrendingUp";

import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { formatLabel } from "../../services/dashboard";

const CropRecommendation: React.FC = () => {
  const { userProfile } = useAuth();
  console.log("userProfile:", userProfile);
  const getPhDisplay = (ph: number) => {
    if (ph < 5.5) return { label: "Acidic", progress: 30 };
    if (ph < 6.5) return { label: "Slightly Acidic", progress: 60 };
    if (ph <= 7.5) return { label: "Optimal", progress: 90 };
    return { label: "Alkaline", progress: 50 };
  };
  const getNutrientDisplay = (value: number, type: "N" | "P" | "K") => {
    const ranges = {
      N: { low: 500, medium: 1200, high: 1800 },
      P: { low: 10, medium: 25, high: 50 },
      K: { low: 40, medium: 80, high: 120 },
    };

    const r = ranges[type];

    if (value < r.low) {
      return { label: "Low", progress: 25 };
    }
    if (value < r.medium) {
      return { label: "Medium", progress: 60 };
    }
    return { label: "High", progress: 90 };
  };
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Crop Recommendation
        </Typography>
        <Typography variant="body1" color="text.secondary">
          AI-driven suggestions based on your soil profile and local climate
          data.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, lg: 4 }} className="h-fit">
          <DashboardCard title="Soil Profile Analyzed">
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">Nitrogen (N)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {getNutrientDisplay(userProfile.features_used.N, "N").label}{" "}
                    ({userProfile.features_used.N.toFixed(0)} mg/kg)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    getNutrientDisplay(userProfile.features_used.N, "N")
                      .progress
                  }
                  color="primary"
                />
              </Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">Phosphorus (P)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {getNutrientDisplay(userProfile.features_used.P, "P").label}{" "}
                    ({userProfile.features_used.P.toFixed(0)} mg/kg)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    getNutrientDisplay(userProfile.features_used.P, "P")
                      .progress
                  }
                  color="secondary"
                />
              </Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">Potassium (K)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {getNutrientDisplay(userProfile.features_used.K, "K").label}{" "}
                    ({userProfile.features_used.K.toFixed(0)} mg/kg)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    getNutrientDisplay(userProfile.features_used.K, "K")
                      .progress
                  }
                  color="error"
                />
              </Box>
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2">pH Level</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {getPhDisplay(userProfile.features_used.ph).label} (
                    {userProfile.features_used.ph.toFixed(1)})
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={getPhDisplay(userProfile.features_used.ph).progress}
                  color="success"
                />
              </Box>
            </Box>
          </DashboardCard>
        </Grid>
        {/* Recommendation Cards */}
        {userProfile?.recommendations.map((insight: any, index: number) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              style={{ height: "100%" }}
            >
              <DashboardCard
                title={formatLabel(insight.crop)}
                action={
                  <Chip
                    label={`${insight.confidence}% Match`}
                    color={insight.confidence > 85 ? "success" : "primary"}
                    size="small"
                  />
                }
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <TrendingUp fontSize="small" color="action" />
                    <Typography variant="body2">
                      Expected Yield:{" "}
                      <strong>{insight.estimated_production_t}</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Spa fontSize="small" color="action" />
                    <Typography variant="body2">
                      Time to Harvest:{" "}
                      <strong>{insight.time_to_harvest.display}</strong>
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Grass fontSize="small" color="action" />
                    <Typography variant="body2">
                      Market Demand:{" "}
                      <strong style={{ textTransform: "capitalize" }}>
                        {insight.marketDemand}
                      </strong>
                    </Typography>
                  </Box>
                  <Button variant="outlined" fullWidth sx={{ mt: 1 }}>
                    View Planting Guide
                  </Button>
                </Box>
              </DashboardCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CropRecommendation;
