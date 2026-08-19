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
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";
import { register } from "../services/auth";
import { useQueryClient } from "@tanstack/react-query";
import { getData } from "../services/onboarding";


const Register: React.FC = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

  const isFormValid =
    formData.fullName.trim().length >= 2 &&
    isValidEmail &&
    formData.password.length >= 8;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setloading(true);
    setError("");

    try {
      await register(formData);
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
      navigate("/onboarding");
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
        // variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          mb: 1,
          textAlign: "center",
          fontSize: { xs: "2rem", md: "2.5rem" },
        }}
      >
        Create an account
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 4, textAlign: "center" }}
      >
        Start your journey to smarter farming today.
      </Typography>

      <form onSubmit={handleRegister}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            required
            fullWidth
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            variant="outlined"
            placeholder="John Doe"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            fullWidth
            required
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            variant="outlined"
            error={formData.email.length > 0 && !isValidEmail}
            helperText={
              formData.email.length > 0 && !isValidEmail
                ? "Enter a valid email address"
                : ""
            }
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
            onChange={handleChange}
            variant="outlined"
            error={formData.password.length > 0 && formData.password.length < 8}
            helperText={
              formData.password.length > 0 && formData.password.length < 8
                ? "Password must be at least 8 characters"
                : ""
            }
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
                      type="button"
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

          <Button
            type="submit"
            disabled={!isFormValid}
            variant="contained"
            size="large"
            fullWidth
            loading={loading}
            sx={{ mt: 1, py: 1.5 }}
          >
            Create Account
          </Button>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <RouterLink
              to="/login"
              style={{
                color: "#2E7D32",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Sign In
            </RouterLink>
          </Typography>
        </Box>
      </form>
    </GlassCard>
  );
};

export default Register;
