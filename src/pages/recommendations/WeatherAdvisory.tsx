import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  IconButton,
  Skeleton,
  Typography,
  Grid,
  Paper,
  useTheme,
} from "@mui/material";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import DashboardCard from "../../components/ui/DashboardCard";
import Cloud from "@mui/icons-material/Cloud";
import WbSunny from "@mui/icons-material/WbSunny";
import Opacity from "@mui/icons-material/Opacity";
import Air from "@mui/icons-material/Air";
import { motion } from "framer-motion";
import { forecast } from "../../services/dashboard";
import { useAuth } from "../../context/AuthContext";
import WeatherAdvisoryNote from "../../components/WeatherAdvisoryNote";

const WeatherAdvisory: React.FC = () => {
  const theme = useTheme();
  const [forecastData, setforecastData] = useState<any>(null);
  const [forecastLoading, setforecastLoading] = useState(true);
  const { userProfile } = useAuth();
  const [forecastError, setForecastError] = useState<string | null>(null);
  const forecastRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({
    previous: false,
    next: false,
  });
  const latitude = userProfile?.lat;
  const longitude = userProfile?.lon;
  const updateScrollState = useCallback(() => {
    const element = forecastRef.current;
    if (!element) return;
    setScrollState({
      previous: element.scrollLeft > 1,
      next: element.scrollLeft + element.clientWidth < element.scrollWidth - 1,
    });
  }, []);
  const scrollForecast = (direction: number) => {
    const element = forecastRef.current;
    if (!element) return;
    element.scrollBy({
      left: direction * element.clientWidth,
      behavior: "smooth",
    });
  };
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
    let cancelled = false;
    const lat = Number(latitude);
    const lon = Number(longitude);
    setforecastData(null);
    if (
      latitude == null ||
      longitude == null ||
      !Number.isFinite(lat) ||
      !Number.isFinite(lon) ||
      Math.abs(lat) > 90 ||
      Math.abs(lon) > 180
    ) {
      setForecastError(
        "Save a valid farm location to load the weather forecast.",
      );
      setforecastLoading(false);
      return;
    }
    async function loadForecast() {
      setforecastLoading(true);
      setForecastError(null);
      try {
        const data = await forecast(lat, lon);
        if (!cancelled) setforecastData(data);
      } catch {
        if (!cancelled)
          setForecastError(
            "Could not load the weather forecast. Please try again later.",
          );
      } finally {
        if (!cancelled) setforecastLoading(false);
      }
    }
    void loadForecast();
    return () => {
      cancelled = true;
    };
  }, [latitude, longitude]);
  useEffect(() => {
    const element = forecastRef.current;
    if (!element) return;
    element.scrollLeft = 0;
    updateScrollState();
    const observer = new ResizeObserver(updateScrollState);
    observer.observe(element);
    return () => observer.disconnect();
  }, [Dforecast, updateScrollState]);
  const current = forecastData?.list?.[0];
  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
          Weather Advisory
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Hyper-local forecasts and agriculture-specific alerts.
        </Typography>
      </Box>

      {forecastError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {forecastError}
        </Alert>
      )}
      <Grid
        container
        spacing={3}
        sx={{ minWidth: 0, alignItems: "flex-start" }}
      >
        {/* Current Weather */}
        <Grid size={{ xs: 12, md: 4 }} sx={{ minWidth: 0 }}>
          <DashboardCard title="Current Conditions">
            <Box sx={{ textAlign: "center", py: 2, minHeight: 182 }}>
              <Cloud
                sx={{ fontSize: 80, color: theme.palette.primary.main, mb: 2 }}
              />
              <Typography variant="h2" sx={{ fontWeight: 700 }}>
                {forecastLoading ? (
                  <Skeleton width={130} sx={{ mx: "auto" }} />
                ) : current ? (
                  `${Math.round(current.main.temp)}°C`
                ) : (
                  "—"
                )}
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {forecastLoading ? (
                  <Skeleton width={160} sx={{ mx: "auto" }} />
                ) : (
                  current?.weather?.[0]?.description || "Unavailable"
                )}
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid size={{ xs: 6, md: 12, lg: 6 }} sx={{ minWidth: 0 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    minWidth: 0,
                    flexWrap: "wrap",
                    bgcolor: "action.hover",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Opacity color="primary" />
                  <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
                    <Typography
                      variant="caption"
                      sx={{ display: "block" }}
                      color="text.secondary"
                    >
                      Humidity
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {current ? `${Math.round(current.main.humidity)}%` : "—"}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid size={{ xs: 6, md: 12, lg: 6 }} sx={{ minWidth: 0 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    minWidth: 0,
                    flexWrap: "wrap",
                    bgcolor: "action.hover",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <Air color="primary" />
                  <Box sx={{ minWidth: 0, overflowWrap: "anywhere" }}>
                    <Typography
                      variant="caption"
                      sx={{ display: "block" }}
                      color="text.secondary"
                    >
                      Wind
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {current
                        ? `${Math.round((current.wind?.speed ?? 0) * 3.6)} km/h`
                        : "—"}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </DashboardCard>
        </Grid>

        {/* Forecast */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ minWidth: 0 }}>
          <DashboardCard
            title="5-Day Forecast"
            action={
              <Box sx={{ display: "flex", flexShrink: 0 }}>
                <IconButton
                  size="small"
                  aria-label="Previous forecast days"
                  disabled={!scrollState.previous || forecastLoading}
                  onClick={() => scrollForecast(-1)}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label="Next forecast days"
                  disabled={!scrollState.next || forecastLoading}
                  onClick={() => scrollForecast(1)}
                >
                  <ChevronRight />
                </IconButton>
              </Box>
            }
          >
            <Box
              ref={forecastRef}
              role="region"
              aria-label="Five-day weather forecast"
              tabIndex={0}
              onScroll={updateScrollState}
              sx={{
                display: "flex",
                gap: 2,
                mt: 2,
                overflowX: "auto",
                overflowY: "hidden",
                minWidth: 0,
                minHeight: 220,
                scrollSnapType: "x proximity",
                overscrollBehaviorX: "contain",
                WebkitOverflowScrolling: "touch",
                pb: 2,
                width: "100%",
                scrollbarWidth: "thin",
              }}
            >
              {forecastLoading &&
                Array.from({ length: 5 }, (_, index) => (
                  <Skeleton
                    key={index}
                    variant="rounded"
                    width={120}
                    height={200}
                    sx={{ flexShrink: 0 }}
                  />
                ))}
              {!forecastLoading && Dforecast.length === 0 && (
                <Typography color="text.secondary">
                  Forecast unavailable.
                </Typography>
              )}
              {Dforecast.map((day: any, index: any) => (
                <motion.div
                  key={index}
                  style={{ flex: "0 0 auto", scrollSnapAlign: "start" }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      width: { xs: 104, sm: 120 },
                      height: "100%",
                      overflowWrap: "anywhere",
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
                    {day.condition === "Clear" ? (
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
            <WeatherAdvisoryNote
              advisory={forecastData?.weather_advisory}
              loading={forecastLoading}
              error={forecastError}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WeatherAdvisory;
