import React from "react";
import { Outlet, Link as RouterLink } from "react-router-dom";
import { Box, Container } from "@mui/material";

const AuthLayout: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ p: 3 }}>
        <RouterLink
          to="/"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            width: "fit-content",
          }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              background: "linear-gradient(135deg, #2E7D32 0%, #8BC34A 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize: "18px",
              boxShadow: "0 8px 20px rgba(46, 125, 50, 0.25)",
            }}
          >
            A
          </Box>
          <span
            style={{ fontSize: "1.25rem", fontWeight: 700, color: "inherit" }}
          >
            AgroTech <span style={{ color: "#2E7D32" }}>AI</span>
          </span>
        </RouterLink>
      </Box>
      <Container
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Outlet />
      </Container>
    </Box>
  );
};

export default AuthLayout;
