import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Avatar,
  Chip,
  useTheme,
  CircularProgress,
  Skeleton,
} from "@mui/material";
import DashboardCard from "../components/ui/DashboardCard";
import Cloud from "@mui/icons-material/Cloud";
import WaterDrop from "@mui/icons-material/WaterDrop";
import LocalFlorist from "@mui/icons-material/LocalFlorist";
import TrendingUp from "@mui/icons-material/TrendingUp";
import Warning from "@mui/icons-material/Warning";
import SmartToy from "@mui/icons-material/SmartToy";
import { mockHealth, mockTasks, recentActivity } from "../utils/mockData";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { getWeather } from "../services/dashboard";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC<any> = () => {
  const theme = useTheme();
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const { userData, userProfile } = useAuth();
  console.log(userData?.uid);

  useEffect(() => {
    async function loadWeather() {
      try {
        setWeatherLoading(true);
        const data = await getWeather(userProfile.lat, userProfile.lon);
        console.log("Weather data:", data);
        setWeather(data);
      } catch (error) {
        console.error("Unable to load weather data:", error);
      } finally {
        setWeatherLoading(false);
      }
    }
    loadWeather();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, John. Here's what's happening on your farm.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          className="self-start md:self-center"
        >
          {/* Icon on xs/sm screens */}
          <SmartToy sx={{ display: { xs: "block", lg: "none" } }} />

          {/* Text on md+ screens */}
          <Box component="span" sx={{ display: { xs: "none", lg: "block" } }}>
            Ask AI Assistant
          </Box>
        </Button>
        {/* <button
          onClick={() => {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                const longitude = position.coords.longitude;
                const latitude = position.coords.latitude;
                // console.log(position.coords.latitude);
                // console.log(position.coords.longitude);
                function getGeographicalDirection(
                  latitude: number,
                  longitude: number,
                ) {
                  const latitudeDirection = latitude >= 0 ? "North" : "South";
                  const longitudeDirection = longitude >= 0 ? "East" : "West";

                  return `${latitudeDirection}, ${longitudeDirection}`;
                }

                console.log(getGeographicalDirection(latitude, longitude));
                // North, East

                const response = await fetch(
                  "http://127.0.0.1:8000/crop-recommendation",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      lat: latitude,
                      lon: longitude,
                      farm_size_ha: 5,
                      soil_texture: "loam",
                    }),
                  },
                );
                const data = await response.json();
                console.log(data);
                // setWeather(data);
              },
              (error) => {
                console.error(error);
              },
            );
          }}
        >
          📍
        </button> */}
      </Box>

      <Grid container spacing={3}>
        {/* Farm Health Summary */}
        <Grid
          size={{
            xs: 12,
            md: 7,
            lg: 8,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <DashboardCard title="Farm Health Score">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  flexWrap: "wrap",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    {/* Background circle */}
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={120}
                      thickness={8}
                      sx={{
                        color: "grey.200",
                      }}
                    />

                    {/* Progress circle */}
                    <CircularProgress
                      variant="determinate"
                      value={Math.round(userProfile?.farm_health_score ?? 0)}
                      size={120}
                      thickness={8}
                      sx={{
                        color:
                          Math.round(userProfile?.farm_health_score ?? 0) >= 80
                            ? "primary.main"
                            : Math.round(userProfile?.farm_health_score ?? 0) >=
                                60
                              ? "warning.main"
                              : "error.main",
                        position: "absolute",
                        left: 0,
                      }}
                    />

                    {/* Center content */}
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 800,
                          // lineHeight: 1,
                        }}
                      >
                        {Math.round(userProfile?.farm_health_score ?? 0)}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      color: "text.secondary",
                      textAlign: "center",
                    }}
                  >
                    {Math.round(userProfile?.farm_health_score ?? 0) >= 80
                      ? "Excellent condition"
                      : Math.round(userProfile?.farm_health_score ?? 0) >= 60
                        ? "Moderate condition"
                        : "Needs attention"}
                  </Typography>
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Status:{" "}
                    <span
                      style={{
                        color: theme.palette.primary.main,
                        textTransform: "capitalize",
                      }}
                    >
                      {mockHealth.status}
                    </span>
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid
                      size={{
                        xs: 6,
                        sm: 4,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Soil Moisture
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {userProfile?.soil_moisture}%
                      </Typography>
                    </Grid>
                    <Grid
                      size={{
                        xs: 6,
                        sm: 4,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Nitrogen
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {Math.round(userProfile?.features_used?.N)} mg/kg
                      </Typography>
                    </Grid>
                    <Grid
                      size={{
                        xs: 6,
                        sm: 4,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        pH Level
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {userProfile?.features_used?.ph.toFixed(1)}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </DashboardCard>
          </motion.div>
        </Grid>

        {/* Weather Widget */}
        <Grid
          size={{
            xs: 12,
            md: 5,
            lg: 4,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <DashboardCard title="Weather">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  mb: 3,
                }}
              >
                <Box>
                  {weatherLoading ? (
                    <>
                      <Skeleton variant="text" width={100} height={50} />
                      <Skeleton variant="text" width={140} />
                    </>
                  ) : (
                    <>
                      <Typography variant="h3" sx={{ fontWeight: 700 }}>
                        {Math.round(weather?.main?.temp ?? 0)}°C
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {weather?.weather?.[0]?.description ?? "--"}
                      </Typography>
                    </>
                  )}
                </Box>

                {weatherLoading ? (
                  <Skeleton variant="circular" width={80} height={80} />
                ) : (
                  weather?.weather?.[0]?.icon && (
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                      width={80}
                      height={80}
                    />
                  )
                )}
              </Box>

              <Grid
                container
                spacing={1}
                sx={{
                  bgcolor: (mode) =>
                    mode.palette.mode === "light"
                      ? "rgba(0,0,0,0.02)"
                      : "rgba(255,255,255,0.02)",
                  p: 1.5,
                  borderRadius: "12px",
                }}
              >
                {[
                  weather?.main?.humidity ? `${weather.main.humidity}%` : "--",
                  weather?.rain?.["1h"] ? `${weather.rain["1h"]}mm` : "0mm",
                  weather?.wind?.speed
                    ? `${Math.round(weather.wind.speed * 3.6)} km/h`
                    : "--",
                ].map((value, index) => (
                  <Grid
                    key={index}
                    size={{ xs: 4 }}
                    sx={{
                      textAlign: "center",
                      ...(index === 1 && {
                        borderLeft: `1px solid ${theme.palette.divider}`,
                        borderRight: `1px solid ${theme.palette.divider}`,
                      }),
                    }}
                  >
                    {index === 0 && (
                      <WaterDrop fontSize="small" color="primary" />
                    )}
                    {index === 1 && <Cloud fontSize="small" color="primary" />}
                    {index === 2 && (
                      <TrendingUp fontSize="small" color="primary" />
                    )}

                    {weatherLoading ? (
                      <Skeleton
                        variant="text"
                        width={40}
                        sx={{ mx: "auto", mt: 0.5 }}
                      />
                    ) : (
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {value}
                      </Typography>
                    )}
                  </Grid>
                ))}
              </Grid>
            </DashboardCard>
          </motion.div>
        </Grid>

        {/* Actionable Insights */}
        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <DashboardCard
              title="AI Insights"
              action={<Button size="small">View All</Button>}
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "warning.light",
                    color: "warning.contrastText",
                    borderRadius: "12px",
                    display: "flex",
                    gap: 1.5,
                  }}
                >
                  <Warning />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Heavy Rain Expected
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Delay fertilizer application on Plot B for 48 hours.
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                    borderRadius: "12px",
                    display: "flex",
                    gap: 1.5,
                  }}
                >
                  <LocalFlorist />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Optimal Planting Window
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Soil moisture is ideal for Maize planting this week.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </DashboardCard>
          </motion.div>
        </Grid>

        {/* Tasks */}
        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <DashboardCard
              title="Upcoming Tasks"
              action={
                <Button
                  component={RouterLink}
                  to={"/farm-planner"}
                  size="small"
                >
                  Schedule
                </Button>
              }
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {mockTasks.slice(0, 3).map((task) => (
                  <Box
                    key={task.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1.5,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: "12px",
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "8px",
                        bgcolor: "action.hover",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {task.type === "treatment" ? (
                        <LocalFlorist fontSize="small" color="secondary" />
                      ) : (
                        <TrendingUp fontSize="small" color="primary" />
                      )}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {task.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {task.date}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={task.status}
                      color={
                        task.status === "in-progress" ? "primary" : "default"
                      }
                      sx={{ textTransform: "capitalize" }}
                    />
                  </Box>
                ))}
              </Box>
            </DashboardCard>
          </motion.div>
        </Grid>

        {/* Activity Feed */}
        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <DashboardCard title="Recent Activity">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {recentActivity.map((activity, index) => (
                  <Box
                    key={activity.id}
                    sx={{ display: "flex", gap: 2, position: "relative" }}
                  >
                    {index !== recentActivity.length - 1 && (
                      <Box
                        sx={{
                          position: "absolute",
                          left: 19,
                          top: 40,
                          bottom: -20,
                          width: 2,
                          bgcolor: "divider",
                        }}
                      />
                    )}
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor:
                          activity.type === "alert"
                            ? "error.main"
                            : activity.type === "success"
                              ? "primary.main"
                              : "info.main",
                      }}
                    >
                      {activity.type === "alert" ? (
                        <Warning fontSize="small" />
                      ) : (
                        <TrendingUp fontSize="small" />
                      )}
                    </Avatar>
                    <Box sx={{ pb: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {activity.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </DashboardCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
