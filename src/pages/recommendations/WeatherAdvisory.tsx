import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Paper, useTheme } from "@mui/material";
import DashboardCard from "../../components/ui/DashboardCard";
import {
  Cloud,
  WbSunny,
  Opacity,
  Air,
  WarningAmber,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { forecast } from "../../services/dashboard";
import { useAuth } from "../../context/AuthContext";

const WeatherAdvisory: React.FC = () => {
  const theme = useTheme();
  const [forecastData, setforecastData] = useState<any>(null);
  const [forecastLoading, setforecastLoading] = useState(true);
  const { userProfile } = useAuth();
  const Dforecast = React.useMemo(() => {
    if (!forecastData?.list) return [];

    const daily = forecastData.list.filter((item: any) =>
      item.dt_txt.includes("12:00:00"),
    );

    return daily.slice(0, 5).map((item: any) => ({
      day: new Date(item.dt * 1000).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      description: item.weather[0].description,
    }));
  }, [forecastData]);
  useEffect(() => {
    if (!userProfile?.lat || !userProfile?.lon) return;

    async function loadForecast() {
      try {
        setforecastLoading(true);
        const data = await forecast(userProfile.lat, userProfile.lon);
        console.log("Forecast data:", data);
        setforecastData(data);
      } catch (error) {
        console.error("Unable to load forecast data:", error);
      } finally {
        setforecastLoading(false);
      }
    }
    loadForecast();
  }, []);
  const current = forecastData?.list?.[0];
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Weather Advisory
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Hyper-local forecasts and agriculture-specific alerts.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Current Weather */}
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Current Conditions">
            <Box sx={{ textAlign: "center", py: 3 }}>
              <Cloud
                sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 2 }}
              />
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {Math.round(current?.main?.temp ?? 0)}°C
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {current?.weather?.[0]?.description}
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "action.hover",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Opacity color="primary" />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ display: "block" }}
                      color="text.secondary"
                    >
                      Humidity
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {Math.round(current?.main?.humidity ?? 0)}%
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: "action.hover",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Air color="primary" />
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ display: "block" }}
                      color="text.secondary"
                    >
                      Wind
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {Math.round((current?.wind?.speed ?? 0) * 3.6)} km/h
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>

        {/* Forecast */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
          <DashboardCard title="5-Day Forecast">
            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                overflow: "hidden",
                pb: 2,
                width: "100%",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                scrollbarWidth: "none",
              }}
            >
              {Dforecast.map((day: any, index: any) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      minWidth: { xs: 100, sm: 120 },
                      textAlign: "center",
                      bgcolor: index === 0 ? "primary.main" : "action.hover",
                      color: index === 0 ? "white" : "inherit",
                      flexShrink: 0,
                      borderRadius: "16px",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 2 }}
                    >
                      {index === 0 ? "Today" : day.day}
                    </Typography>
                    {day.condition === "Sunny" ? (
                      <WbSunny
                        sx={{
                          fontSize: 40,
                          mb: 2,
                          color: index === 0 ? "white" : "#FFB400",
                        }}
                      />
                    ) : (
                      <Cloud
                        sx={{
                          fontSize: 40,
                          mb: 2,
                          color: index === 0 ? "white" : "primary.main",
                        }}
                      />
                    )}
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      {day.temp}°
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mt: 1, opacity: 0.9 }}
                    >
                      {day.condition}
                    </Typography>
                  </Paper>
                </motion.div>
              ))}
            </Box>
          </DashboardCard>

          <Box sx={{ mt: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: "warning.light",
                color: "warning.contrastText",
                borderRadius: "16px",
                display: "flex",
                gap: 2,
              }}
            >
              <WarningAmber sx={{ fontSize: 32 }} />
              <Box>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 700, mb: 0.5 }}
                >
                  Spraying Advisory
                </Typography>
                <Typography variant="body2">
                  High probability of rain on Wednesday. Delay pesticide
                  application to avoid runoff and product waste.
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WeatherAdvisory;
