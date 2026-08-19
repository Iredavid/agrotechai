import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../../context/AuthContext";
import FullPageLoader from "../FullPageLoader";

interface AppLayoutProps {
  toggleTheme: () => void;
  mode: "light" | "dark";
}

const AppLayout: React.FC<AppLayoutProps> = ({ toggleTheme, mode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { userData, loading, userProfile, profileLoading, refreshProfile } =
    useAuth();
  const fetchedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!loading && userData?.uid && fetchedFor.current !== userData.uid) {
      fetchedFor.current = userData.uid;
      refreshProfile();
    }
  }, [loading, userData?.uid]);
  if (loading) return <FullPageLoader message="Checking your session..." />;
  if (profileLoading || !userProfile) {
    return <FullPageLoader message="Loading your farm data..." />;
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "flex-start", // ← add this

        bgcolor: "background.default",
      }}
    >
      <CssBaseline />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 260px)` },
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Topbar
          handleDrawerToggle={handleDrawerToggle}
          toggleTheme={toggleTheme}
          mode={mode}
        />
        <Box sx={{ flexGrow: 1, p: { xs: 2, md: 4 }, overflow: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
