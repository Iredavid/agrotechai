import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField,
  Grid,
  MenuItem,
  useTheme,
  InputAdornment,
  Alert,
  CircularProgress,
  Collapse,
} from "@mui/material";
import  Agriculture  from "@mui/icons-material/Agriculture";
import  Landscape  from "@mui/icons-material/Landscape";
import  WaterDrop  from "@mui/icons-material/WaterDrop";
import  MyLocation  from "@mui/icons-material/MyLocation";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import { useAuth } from "../context/AuthContext";
import { getCoordinates, getData, getLongLat } from "../services/onboarding";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface FarmerFormData {
  farmName: string;
  farmSize: string;
  soilType: string;
  state: string;
  irrigationMethod: string;
  lat: number | null;
  lon: number | null;
}

const FarmerOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [formData, setFormData] = useState<FarmerFormData>({
    farmName: "",
    farmSize: "",
    soilType: "loam",
    state: "",
    irrigationMethod: "none",
    lat: null,
    lon: null,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["onboarding-options"],
    queryFn: async () => {
      const [soil, irrigation, states] = await Promise.all([
        getData("soil"),
        getData("irrigation"),
        getData("states"),
      ]);

      return {
        soil,
        irrigation,
        states,
      };
    },
  });
  const queryClient = useQueryClient();

  const soilOptions = useMemo(() => data?.soil ?? [], [data]);

  const irrigationOptions = useMemo(() => data?.irrigation ?? [], [data]);

  const stateOptions = useMemo(
    () => (data?.states ?? []).map((s: string) => s),
    [data],
  );
  const stateValue = stateOptions.includes(formData.state)
    ? formData.state
    : "";

  const getSoilTextureFromCoordinates = async (lat: number, lon: number) => {
    return queryClient.fetchQuery({
      queryKey: ["soil-texture", lat, lon],
      queryFn: async () => {
        const res = await fetch(
          `${API_BASE}/soil-texture?lat=${lat}&lon=${lon}`,
        );

        if (!res.ok) throw new Error("Failed");

        return res.json();
      },
      staleTime: 1000 * 60 * 60,
    });
  };

  const getStateFromCoordinates = async (lat: number, lon: number) => {
    return queryClient.fetchQuery({
      queryKey: ["reverse-geocode", lat, lon],
      queryFn: async () => {
        const res = await fetch(
          `${API_BASE}/reverse-geocode?lat=${lat}&lon=${lon}`,
        );

        if (!res.ok) throw new Error("Failed");

        return res.json();
      },
      staleTime: 1000 * 60 * 60,
    });
  };
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const { userData, userProfile } = useAuth();

  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  }>();

  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationConfirmed, setLocationConfirmed] = useState<string | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [satelliteSoilSuggestion, setSatelliteSoilSuggestion] = useState<
    string | null
  >(null);
  useEffect(() => {
    // console.log("userProfile changed:", userProfile);
    if (!userProfile) return;
    setFormData((prev) => ({
      ...prev,
      farmName: userProfile.farmName ?? prev.farmName,
      farmSize: userProfile.farm_size_ha?.toString() ?? prev.farmSize,
      soilType: userProfile.manual_soil_texture ?? prev.soilType,

      state: userProfile.state ?? prev.state,
      irrigationMethod: userProfile.irrigation_type ?? prev.irrigationMethod,
    }));
  }, [userProfile]);
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "state") {
      setLocation(undefined);
      setLocationConfirmed(null);
      setLocationError(null);
    }
  };

  const handleUseMyLocation = async () => {
    setLocationError(null);
    setLocationConfirmed(null);

    if (!navigator.geolocation) {
      setLocationError(
        "Location isn't supported on this device/browser -- please select your state manually.",
      );
      return;
    }

    setLocating(true);
    if (!navigator.geolocation) {
      throw new Error("Geolocation is not supported by this browser");
    }
    try {
      const coords = await getCoordinates();
      setLocation(coords);

      const data = await getStateFromCoordinates(
        coords?.latitude,
        coords?.longitude,
      );
      const soilData = await getSoilTextureFromCoordinates(
        coords?.latitude,
        coords?.longitude,
      );
      const detectedName: string = data || "";
      const match = stateOptions.find(
        (s: any) => s.toLowerCase() === detectedName.toLowerCase(),
      );
      const detectedUsdaClass: string = soilData?.usda_class || "";
      const soilMatch = soilOptions.find(
        (opt: any) =>
          opt.value.toLowerCase() === detectedUsdaClass.toLowerCase(),
      );
      setFormData((prev) => ({
        ...prev,
        lat: coords?.latitude,
        lon: coords?.longitude,
        state: match ? match : prev.state,
        soilType: soilMatch ? soilMatch.value : prev.soilType,
      }));
      setSatelliteSoilSuggestion(soilData?.usda_class ?? null);
      setLocationConfirmed(
        match
          ? `Detected: ${match} State`
          : `Detected coordinates, but couldn't match a state automatically -- please confirm below.`,
      );
    } catch (err) {
      setLocating(false);
        // console.log(err);
      const error = err as GeolocationPositionError;

      switch (error.code) {
        case error.PERMISSION_DENIED:
          setLocationError(
            "Location access was denied -- please select your state manually.",
          );
          break;

        case error.POSITION_UNAVAILABLE:
          setLocationError("Your location could not be determined.");
          break;

        case error.TIMEOUT:
          setLocationError("Location request timed out. Please try again.");
          break;

        default:
          setLocationError(
            "An unexpected error occurred while getting your location.",
          );
      }
      setLocationError(
        err instanceof Error
          ? err.message
          : "Couldn't reach the location service. Please select your state manually.",
      );
    } finally {
      setLocating(false);
    }
  };

  const isFormValid =
    formData.farmName.trim().length > 0 &&
    Number(formData.farmSize) > 0 &&
    formData.state.length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      let coords = location;

      if (!coords) {
        coords = await getLongLat(formData.state);
        setLocation(coords);
      }

      // console.log(
      //   coords?.latitude,
      //   coords?.longitude,
      //   Number(formData.farmSize),
      //   formData.soilType,
      //   formData.irrigationMethod,
      // );
      const farmData = {
        lat: coords?.latitude,
        lon: coords?.longitude,
        farm_size_ha: Number(formData.farmSize),
        manual_soil_texture: formData.soilType,
        irrigation_type: formData.irrigationMethod,
      };
      const res = await fetch(`${API_BASE}/addUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmName: formData.farmName,
          farmData,
          userId: userData?.uid,
        }),
      });
      if (!res.ok)
        throw new Error("Couldn't save your farm profile. Please try again.");
      navigate("/dashboard");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        bgcolor: "background.default",
        px: 3,
        py: 3,
      }}
    >
      {/* Brand */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "left",
          gap: 1.5,
          mb: 4,
          marginRight: "auto",
        }}
      >
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 0.5,
            background: "linear-gradient(135deg, #2E7D32 0%, #8BC34A 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: "18px",
            boxShadow: "0 8px 20px rgba(46, 125, 50, 0.25)",
          }}
        >
          A
        </Box>
        <Typography sx={{ fontSize: "1.25rem", fontWeight: 700 }}>
          AgroTech{" "}
          <Box component="span" sx={{ color: theme.palette.primary.main }}>
            AI
          </Box>
        </Typography>
      </Box>
      <Box sx={{ maxWidth: 820, width: "100%" }}>
        <GlassCard
          sx={{
            px: { xs: 1, sm: 4, md: 6 },
            py: { xs: 3, sm: 5 },
          }}
        >
          <Typography
            variant="h4"
            align="center"
            sx={{
              fontSize: { xs: "1.5rem", md: "2.2rem" },
              mb: 1,
              fontWeight: 800,
            }}
          >
            Set up your farm profile
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            sx={{ maxWidth: 550, mx: "auto", mb: 4 }}
          >
            Help AgroTech AI understand your farm so we can provide personalized
            recommendations and insights.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <TextField
                name="farmName"
                value={formData.farmName}
                onChange={handleChange}
                fullWidth
                required
                variant="outlined"
                label="Farm Name"
                placeholder="e.g. Green Valley Farm"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Agriculture fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                name="farmSize"
                value={formData.farmSize}
                onChange={handleChange}
                fullWidth
                required
                type="number"
                label="Farm Size"
                placeholder="e.g. 5"
                variant="outlined"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">hectares</InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>

            {/* State + Use My Location */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  select
                  name="state"
                  value={stateValue}
                  onChange={handleChange}
                  fullWidth
                  required
                  label="State"
                  variant="outlined"
                >
                  {stateValue === "" && (
                    <MenuItem value="" disabled>
                      Select your state
                    </MenuItem>
                  )}
                  {stateOptions.map((s: any) => (
                    <MenuItem key={s} value={s}>
                      {s} State
                    </MenuItem>
                  ))}
                </TextField>
                <Button
                  onClick={handleUseMyLocation}
                  disabled={locating}
                  variant="outlined"
                  sx={{ borderRadius: 3, px: 2, minWidth: 56, flexShrink: 0 }}
                  title="Use my location"
                >
                  {locating ? (
                    <CircularProgress size={20} />
                  ) : (
                    <MyLocation fontSize="small" />
                  )}
                </Button>
              </Box>
              <Collapse in={!!locationConfirmed}>
                <Alert severity="success" sx={{ mt: 1, borderRadius: 2 }}>
                  {locationConfirmed}
                </Alert>
              </Collapse>
              <Collapse in={!!locationError}>
                <Alert severity="warning" sx={{ mt: 1, borderRadius: 2 }}>
                  {locationError}
                </Alert>
              </Collapse>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="soilType"
                disabled={isLoading}
                value={formData.soilType}
                onChange={handleChange}
                fullWidth
                label="Soil Type"
                variant="outlined"
                helperText={
                  satelliteSoilSuggestion
                    ? `Satellite suggested: ${satelliteSoilSuggestion}`
                    : undefined
                }
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Landscape fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                {soilOptions.map((opt: any) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                name="irrigationMethod"
                value={formData.irrigationMethod}
                onChange={handleChange}
                fullWidth
                label="Primary Irrigation Method"
                variant="outlined"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <WaterDrop fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                {irrigationOptions.map((opt: any) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <Collapse in={!!submitError}>
            <Alert severity="error" sx={{ mt: 3, borderRadius: 2 }}>
              {submitError}
            </Alert>
          </Collapse>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || submitting}
              variant="contained"
              size="large"
              sx={{ borderRadius: 0.5, px: 5, py: 1.3, fontWeight: 700 }}
            >
              {submitting ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Complete Setup"
              )}
            </Button>
          </Box>
        </GlassCard>
      </Box>
    </Box>
  );
};

export default FarmerOnboarding;
