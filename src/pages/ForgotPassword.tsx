import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import Email from "@mui/icons-material/Email";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { Link as RouterLink } from "react-router-dom";
import GlassCard from "../components/ui/GlassCard";

const ForgotPassword: React.FC = () => {
  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock reset
    alert("Password reset link sent to your email.");
  };

  return (
    <GlassCard sx={{ p: { xs: 3, md: 5 }, width: "100%", maxWidth: 450 }}>
      <Box sx={{ mb: 3 }}>
        <RouterLink
          to="/login"
          style={{
            color: "inherit",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            fontSize: "0.9rem",
          }}
        >
          <ArrowBack fontSize="small" /> Back to login
        </RouterLink>
      </Box>

      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
        Reset password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Enter your email address and we'll send you a link to reset your
        password.
      </Typography>

      <form onSubmit={handleReset}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            fullWidth
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

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 1, py: 1.5 }}
          >
            Send Reset Link
          </Button>
        </Box>
      </form>
    </GlassCard>
  );
};

export default ForgotPassword;
