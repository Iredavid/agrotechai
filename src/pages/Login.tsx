import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Email from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import { signIn } from "../services/auth";
import { getData } from "../services/onboarding";
import { useQueryClient } from "@tanstack/react-query";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isFormValid = isValidEmail && formData.password.length >= 8;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setloading(true);
    setError("");

    try {
      await signIn(formData);
      console.log("Registration successful:");
            queryClient.prefetchQuery({
              queryKey: ["onboarding-options"],
              queryFn: async () => {
                const [soil, irrigation, states] = await Promise.all([
                  getData("soil"),
                  getData("irrigation"),
                  getData("states"),
                ]);
      
                return { soil, irrigation, states };
              },
            });
      navigate("/dashboard");
    } catch (error: any) {
      console.log("CAUGHT ERROR:", error); // add this
      console.error("Registration failed:", error);
      const errorMessage = error.message;
      setError(errorMessage);
    } finally {
      setloading(false);
    }
  };

  return (
    <GlassCard sx={{ p: { xs: 3, md: 5 }, width: "100%", maxWidth: 450 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: 700, mb: 1, textAlign: "center" }}
      >
        Welcome back
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Enter your details to access your farm dashboard.
      </Typography>

      <form onSubmit={handleLogin}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            marginBottom: 1,
          }}
        >
          <TextField
            required
            fullWidth
            name="email"
            type="email"
            helperText={
              formData.email.length > 0 && !isValidEmail
                ? "Please enter a valid email address"
                : ""
            }
            error={formData.email.length > 0 && !isValidEmail}
            value={formData.email}
            onChange={handleChange}
            label="Email Address"
            variant="outlined"
            placeholder="farmer@example.com"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            required
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            error={formData.password.length > 0 && formData.password.length < 8}
            helperText={
              formData.password.length > 0 && formData.password.length < 8
                ? "Password must be at least 8 characters"
                : ""
            }
            onChange={handleChange}
            variant="outlined"
            placeholder="••••••••"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <RouterLink
              to="/forgot-password"
              style={{
                fontSize: "0.85rem",
                color: "#2E7D32",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Forgot password?
            </RouterLink>
          </Box>

          <Button
            disabled={!isFormValid}
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            loading={loading}
            sx={{ mt: 1, py: 1.5 }}
          >
            Sign In
          </Button>

          {/* <Divider sx={{ my: 1 }}>
            <Typography variant="caption" color="text.secondary">OR</Typography>
          </Divider>

          <Button variant="outlined" size="large" fullWidth sx={{ py: 1.5, color: 'text.primary', borderColor: 'divider' }}>
            Continue with Google
          </Button> */}

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <RouterLink
              to="/register"
              style={{
                color: "#2E7D32",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign up
            </RouterLink>
          </Typography>
        </Box>
      </form>
    </GlassCard>
  );
};

export default Login;
