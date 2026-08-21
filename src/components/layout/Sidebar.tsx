import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import Box from "@mui/material/Box";
import { Link as RouterLink, useLocation } from "react-router-dom";
import Dashboard from "@mui/icons-material/Dashboard";
import CloudQueue from "@mui/icons-material/CloudQueue";
import BugReport from "@mui/icons-material/BugReport";
import WaterDrop from "@mui/icons-material/WaterDrop";
import TrendingUp from "@mui/icons-material/TrendingUp";
import EventNote from "@mui/icons-material/EventNote";
import Storefront from "@mui/icons-material/Storefront";
import Description from "@mui/icons-material/Description";
import Notifications from "@mui/icons-material/Notifications";
import SmartToy from "@mui/icons-material/SmartToy";
import Person from "@mui/icons-material/Person";
import Settings from "@mui/icons-material/Settings";
import Grass from "@mui/icons-material/Grass";

const drawerWidth = 280;

interface SidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const navGroups = [
  {
    title: "Overview",
    items: [{ name: "Dashboard", path: "/dashboard", icon: <Dashboard /> }],
  },
  {
    title: "AI Advisory",
    items: [
      {
        name: "Crop Recommendation",
        path: "/recommendations/crop",
        icon: <Grass />,
      },
      {
        name: "Weather Advisory",
        path: "/recommendations/weather",
        icon: <CloudQueue />,
      },
      {
        name: "Fertilizer Advisor",
        path: "/recommendations/fertilizer",
        icon: <WaterDrop />,
        disabled: true, // Disabled for now, can be enabled later
      },
      {
        name: "Pest Advisor",
        path: "/recommendations/pest",
        icon: <BugReport />,
        disabled: true, // Disabled for now, can be enabled later
      },
      {
        name: "Yield Prediction",
        path: "/yield-prediction",
        icon: <TrendingUp />,
        disabled: true, // Disabled for now, can be enabled later
      },
      {
        name: "Market Advisory",
        path: "/market-advisory",
        icon: <Storefront />,
        disabled: true, // Disabled for now, can be enabled later
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        name: "Farm Planner",
        path: "/farm-planner",
        icon: <EventNote />,
        disabled: true,
      },
      {
        name: "Farm Records",
        path: "/records",
        icon: <Description />,
        disabled: true,
      },
      {
        name: "AI Assistant",
        path: "/ai-assistant",
        icon: <SmartToy />,
        disabled: true,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        name: "Notifications",
        path: "/notifications",
        icon: <Notifications />,
        disabled: true,
      },
      { name: "Profile", path: "/profile", icon: <Person /> },
      {
        name: "Settings",
        path: "/settings",
        icon: <Settings />,
        disabled: true,
      },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  mobileOpen,
  handleDrawerToggle,
}) => {
  const theme = useTheme();
  const location = useLocation();

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
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
          }}
        >
          A
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
          AgroTech <span style={{ color: theme.palette.primary.main }}>AI</span>
        </Typography>
      </Box>

      <Box
        sx={{
          overflow: "auto",
          flexGrow: 1,
          px: 2,
          pb: 4,
          scrollbarWidth: "none",

          msOverflowStyle: "none",

          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {navGroups.map((group, index) => (
          <Box
            key={group.title}
            sx={{ mb: index === navGroups.length - 1 ? 0 : 3 }}
          >
            <Typography
              variant="caption"
              sx={{
                px: 2,
                pb: 1,
                display: "block",
                fontWeight: 600,
                color: "text.secondary",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {group.title}
            </Typography>
            <List disablePadding>
              {group.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.name} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      disabled={item.disabled}
                      component={RouterLink}
                      to={item.path}
                      onClick={() => {
                        if (window.innerWidth < 900) {
                          handleDrawerToggle();
                        }
                      }}
                      sx={{
                        borderRadius: "10px",
                        bgcolor: isActive
                          ? `${theme.palette.primary.main}1A`
                          : "transparent",
                        color: isActive ? "primary.main" : "text.primary",
                        "&:hover": {
                          bgcolor: isActive
                            ? `${theme.palette.primary.main}26`
                            : "action.hover",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 40,
                          color: isActive ? "primary.main" : "text.secondary",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.name}
                        // primaryTypographyProps={{
                        //   fontSize: '0.9rem',
                        //   fontWeight: isActive ? 600 : 500
                        // }}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* <Box sx={{ p: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: "12px",
            bgcolor: "primary.main",
            color: "#fff",
            textAlign: "center",
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Premium Plan
          </Typography>
          <Typography
            variant="body2"
            sx={{ fontSize: "0.8rem", mb: 2, opacity: 0.9 }}
          >
            Get full access to satellite imagery & API.
          </Typography>
          <Box
            sx={{
              bgcolor: "rgba(255,255,255,0.2)",
              py: 1,
              borderRadius: "6px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              "&:hover": { bgcolor: "rgba(255,255,255,0.3)" },
            }}
          >
            Upgrade Now
          </Box>
        </Box>
      </Box> */}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
        position: { md: "sticky" }, // ← add
        top: { md: 0 }, // ← add
        height: { md: "100vh" }, // ← add
        alignSelf: "flex-start",
      }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "none",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
