import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Button,
  IconButton,
  useTheme,
  Drawer,
  List,
  ListItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import { motion } from "framer-motion";

interface NavbarProps {
  toggleTheme: () => void;
  mode: "light" | "dark";
}

const Navbar: React.FC<NavbarProps> = ({ toggleTheme, mode }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", path: "#features" },
    { name: "How It Works", path: "#how-it-works" },
    { name: "Testimonials", path: "#testimonials" },
    { name: "FAQ", path: "#faq" },
  ];

  const handleScrollTo = (id: string) => {
    setMobileOpen(false);
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          transition: "all 0.3s ease-in-out",
          background: scrolled
            ? mode === "light"
              ? "rgba(255, 255, 255, 0.8)"
              : "rgba(18, 18, 18, 0.8)"
            : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${theme.palette.divider}`
            : "1px solid transparent",
          padding: "16px 0",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Logo */}
            <RouterLink
              to="/"
              style={{
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "10px",
                  background:
                    "linear-gradient(135deg, #2E7D32 0%, #8BC34A 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              >
                A
              </Box>
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                AgroTech <span style={{ color: "#2E7D32" }}>AI</span>
              </span>
            </RouterLink>

            {/* Desktop Nav */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 4,
              }}
            >
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={(e) => {
                    e.preventDefault();
                    handleScrollTo(link.path);
                  }}
                  style={{
                    textDecoration: "none",
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    transition: "color 0.2s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.color = theme.palette.primary.main)
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.color = theme.palette.text.secondary)
                  }
                >
                  {link.name}
                </a>
              ))}
            </Box>

            {/* Actions */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 2,
              }}
            >
              <IconButton onClick={toggleTheme} color="inherit" size="small">
                {mode === "dark" ? (
                  <LightMode fontSize="small" />
                ) : (
                  <DarkMode fontSize="small" />
                )}
              </IconButton>
              <Button
                component={RouterLink}
                to="/login"
                variant="text"
                color="inherit"
              >
                Log In
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="primary"
              >
                Get Started
              </Button>
            </Box>

            {/* Mobile Menu Toggle */}
            <Box
              sx={{
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                gap: 1,
              }}
            >
              <IconButton onClick={toggleTheme} color="inherit" size="small">
                {mode === "dark" ? (
                  <LightMode fontSize="small" />
                ) : (
                  <DarkMode fontSize="small" />
                )}
              </IconButton>
              <IconButton onClick={() => setMobileOpen(true)} color="inherit">
                <MenuIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </motion.nav>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: {
                xs: "100%",
                sm: 400,
              },
              p: {
                xs: 3,
                sm: 4,
              },
              boxSizing: "border-box",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
              }}
            >
              A
            </Box>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              AgroTech
            </span>
          </Box>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.name} disablePadding sx={{ mb: 2 }}>
              <Button
                fullWidth
                variant="text"
                sx={{
                  justifyContent: "flex-start",
                  color: "text.primary",
                  fontSize: "1.1rem",
                }}
                onClick={() => handleScrollTo(link.path)}
              >
                {link.name}
              </Button>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            fullWidth
            size="large"
          >
            Log In
          </Button>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            fullWidth
            size="large"
          >
            Get Started
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
