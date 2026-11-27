import React, { useEffect, useState } from "react";
import {
  Alert,
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
import CheckCircle from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import { Link, Link as RouterLink } from "react-router-dom";
import { formatLabel, getWeather } from "../services/dashboard";
import { getOverview, timeAgo, type Overview } from "../services/planner";
import { useAuth } from "../context/AuthContext";

/** "Today", "Tomorrow", "Yesterday", otherwise e.g. "Mon, 12 May". */
const friendlyDate = (iso: string): string => {
  const target = new Date(`${iso}T00:00:00`);
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const days = Math.round((target.getTime() - start.getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days === -1) return "Yesterday";
  return target.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
};

const Dashboard: React.FC<any> = () => {
  const theme = useTheme();
  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const { userData, userProfile } = useAuth();
  // console.log(userData?.uid);
  console.log(userData, userProfile);

  // Next tasks, insights and recent activity come from ONE request to the
  // backend (no AI call there, so it is cheap to run on every dashboard load).
  const [overview, setOverview] = useState<Overview | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  const firstName =
    (userData?.displayName ?? "").trim().split(/\s+/)[0] || "farmer";

  useEffect(() => {
    async function loadWeather() {
      try {
        setWeatherLoading(true);
        const data = await getWeather(userProfile.lat, userProfile.lon);
        // console.log("Weather data:", data);
        setWeather(data);
      } catch (error) {
        console.error("Unable to load weather data:", error);
      } finally {
        setWeatherLoading(false);
      }
    }
    loadWeather();
  }, []);

  useEffect(() => {
    if (!userProfile) return;
    let cancelled = false;
    setOverviewLoading(true);
    setOverviewError(null);
    getOverview({
      lat: userProfile.lat,
      lon: userProfile.lon,
      top_crop: userProfile.recommendations?.[0]?.crop,
      irrigation_type: userProfile.irrigation_type_used,
      features: userProfile.features_used,
      farm_health_score: userProfile.farm_health_score,
      soil_moisture: userProfile.soil_moisture,
    })
      .then((data) => {
        if (!cancelled) setOverview(data);
      })
      .catch((e: Error) => {
        if (!cancelled) setOverviewError(e.message);
      })
      .finally(() => {
        if (!cancelled) setOverviewLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userProfile?.lat, userProfile?.lon]);

  type HealthStatusColor = "primary" | "warning" | "error";

  const getHealthStatus = (
    score: number,
  ): {
    status: string;
    color: HealthStatusColor;
    message: string;
  } => {
    if (score >= 80) {
      return {
        status: "Excellent",
        color: "primary",
        message: "Your health condition is excellent.",
      };
    }

    if (score >= 60) {
      return {
        status: "Good",
        color: "warning",
        message: "Your health condition is moderate.",
      };
    }

    // if (score >= 40) {
    //   return {
    //     status: "Fair",
    //     color: "warning",
    //     message: "Your health condition needs some attention.",
    //   };
    // }

    return {
      status: "Poor",
      color: "error",
      message: "Your health condition needs attention.",
    };
  };

  const insightStyle = (level: "warning" | "info" | "success") =>
    level === "warning"
      ? { bg: "warning.light", fg: "warning.contrastText" }
      : level === "success"
        ? { bg: "primary.light", fg: "primary.contrastText" }
        : { bg: "info.light", fg: "info.contrastText" };

  const taskChip = (status: "overdue" | "due_today" | "upcoming") =>
    status === "overdue"
      ? { label: "Overdue", color: "error" as const }
      : status === "due_today"
        ? { label: "Due now", color: "primary" as const }
        : { label: "Upcoming", color: "default" as const };

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
            Welcome back, {firstName}. Here's what's happening on your farm.
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          className="self-start md:self-center"
          component={Link}
          to="/ai-assistant"
        >
          {/* Icon on xs/sm screens */}
          <SmartToy sx={{ display: { xs: "block", lg: "none" } }} />

          {/* Text on md+ screens */}
          <Box component="span" sx={{ display: { xs: "none", lg: "block" } }}>
            Ask AI Assistant
          </Box>
        </Button>
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
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ mb: 0 }}>
                    Status:{" "}
                    <span
                      style={{
                        color:
                          theme.palette[
                            getHealthStatus(userProfile?.farm_health_score ?? 0)
                              .color
                          ].main,
                        textTransform: "capitalize",
                      }}
                    >
                      {
                        getHealthStatus(userProfile?.farm_health_score ?? 0)
                          .status
                      }
                    </span>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      mb: 2,
                      color: "text.secondary",
                    }}
                  >
                    {
                      getHealthStatus(userProfile?.farm_health_score ?? 0)
                        .message
                    }
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
              action={
                <Button component={RouterLink} to="/farm-planner" size="small">
                  View All
                </Button>
              }
            >
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {overviewLoading && (
                  <>
                    <Skeleton variant="rounded" height={72} />
                    <Skeleton variant="rounded" height={72} />
                  </>
                )}

                {!overviewLoading && overviewError && (
                  <Alert severity="warning">
                    Could not load insights right now.
                  </Alert>
                )}

                {!overviewLoading &&
                  !overviewError &&
                  overview?.insights.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      No alerts right now. Create a plan in the Farm Planner to
                      get advice tailored to your crop and weather.
                    </Typography>
                  )}

                {!overviewLoading &&
                  overview?.insights.map((insight) => {
                    const { bg, fg } = insightStyle(insight.level);
                    return (
                      <Box
                        key={insight.id}
                        sx={{
                          p: 2,
                          bgcolor: bg,
                          color: fg,
                          borderRadius: "12px",
                          display: "flex",
                          gap: 1.5,
                        }}
                      >
                        {insight.type === "weather" ? (
                          insight.level === "warning" ? (
                            <Warning />
                          ) : (
                            <Cloud />
                          )
                        ) : insight.type === "planting" ? (
                          <LocalFlorist />
                        ) : (
                          <TrendingUp />
                        )}
                        <Box>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            {insight.title}
                          </Typography>
                          <Typography variant="body2" sx={{ opacity: 0.9 }}>
                            {insight.message}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
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
                {overviewLoading && (
                  <>
                    <Skeleton variant="rounded" height={64} />
                    <Skeleton variant="rounded" height={64} />
                    <Skeleton variant="rounded" height={64} />
                  </>
                )}

                {!overviewLoading && overviewError && (
                  <Alert severity="warning">
                    Could not load your tasks right now.
                  </Alert>
                )}

                {!overviewLoading &&
                  !overviewError &&
                  overview?.next_tasks.length === 0 && (
                    <Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 1.5 }}
                      >
                        {overview.plans_count === 0
                          ? "You have no plans yet. Pick a crop and a planting date and the planner will schedule your season."
                          : "All caught up. Nothing is waiting on you."}
                      </Typography>
                      {overview.plans_count === 0 && (
                        <Button
                          component={RouterLink}
                          to="/farm-planner"
                          variant="outlined"
                          size="small"
                        >
                          Create a plan
                        </Button>
                      )}
                    </Box>
                  )}

                {!overviewLoading &&
                  overview?.next_tasks.map((task) => {
                    const chip = taskChip(task.status);
                    return (
                      <Box
                        key={`${task.plan_id}-${task.id}`}
                        component={RouterLink}
                        to="/farm-planner"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          p: 1.5,
                          border: `1px solid ${theme.palette.divider}`,
                          borderRadius: "12px",
                          textDecoration: "none",
                          color: "inherit",
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
                          {task.type === "fertilizer" ||
                          task.type === "amendment" ? (
                            <LocalFlorist fontSize="small" color="secondary" />
                          ) : (
                            <TrendingUp fontSize="small" color="primary" />
                          )}
                        </Box>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 600 }}
                          >
                            {task.title}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatLabel(task.crop)}
                            {task.plot_name
                              ? ` · ${task.plot_name}`
                              : ""} · {friendlyDate(task.date)}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={chip.label}
                          color={chip.color}
                        />
                      </Box>
                    );
                  })}
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
                {overviewLoading && (
                  <>
                    <Skeleton variant="rounded" height={56} />
                    <Skeleton variant="rounded" height={56} />
                    <Skeleton variant="rounded" height={56} />
                  </>
                )}

                {!overviewLoading && overviewError && (
                  <Alert severity="warning">
                    Could not load recent activity right now.
                  </Alert>
                )}

                {!overviewLoading &&
                  !overviewError &&
                  overview?.activity.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Nothing here yet. Creating a plan or completing a task
                      will show up in this feed.
                    </Typography>
                  )}

                {!overviewLoading &&
                  overview?.activity.map((activity, index) => (
                    <Box
                      key={activity.id}
                      sx={{ display: "flex", gap: 2, position: "relative" }}
                    >
                      {index !== overview.activity.length - 1 && (
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
                        ) : activity.type === "success" ? (
                          <CheckCircle fontSize="small" />
                        ) : (
                          <TrendingUp fontSize="small" />
                        )}
                      </Avatar>
                      <Box sx={{ pb: 1 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {activity.title}
                        </Typography>
                        {activity.description && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 0.5 }}
                          >
                            {activity.description}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          {timeAgo(activity.time)}
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
