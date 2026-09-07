import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
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
  const {
    userData,
    loading,
    userProfile,
    profileLoading,
    profileError,
    refreshProfile,
  } = useAuth();
  const navigate = useNavigate();
  const fetchedFor = useRef<string | null>(null);

  // Tracks which error instance we've already reacted to, so a persisting
  // error doesn't re-trigger the redirect on every re-render.
  const handledErrorRef = useRef<Error | null>(null);

  useEffect(() => {
    if (!loading && userData?.uid && fetchedFor.current !== userData.uid) {
      fetchedFor.current = userData.uid;
      refreshProfile();
    }
  }, [loading, userData?.uid]);

  useEffect(() => {
    if (profileError && handledErrorRef.current !== profileError) {
      handledErrorRef.current = profileError;

      const message =
        profileError.message ||
        "Could not load your farm data. Please sign in again.";
      navigate("/login", {
        replace: true,
        state: { authErrorMessage: message },
      });
    }

    if (!profileError) {
      handledErrorRef.current = null;
    }
  }, [profileError, navigate]);

  if (loading) return <FullPageLoader message="Checking your session..." />;
  if (!profileError && (profileLoading || !userProfile)) {
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
        alignItems: "flex-start",
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
          {userProfile ? <Outlet /> : null}
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;
