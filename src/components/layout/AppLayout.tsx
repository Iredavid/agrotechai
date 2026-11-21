import React, { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  CircularProgress,
  CssBaseline,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../../context/AuthContext";
import FullPageLoader from "../FullPageLoader";

interface AppLayoutProps {
  toggleTheme: () => void;
  mode: "light" | "dark";
}
const API_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const initChat = async (profile: unknown): Promise<string> => {
  const res = await fetch(`${API_URL}/api/chat/init`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    body: JSON.stringify({ profile }),
  });
  if (!res.ok) throw new Error(`Init failed with status ${res.status}`);
  const data = await res.json();
  return data.session_id;
};
const AppLayout: React.FC<AppLayoutProps> = ({ toggleTheme, mode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [sessionId, setSessionId] = useState<string | null>(null);
  const [initializing, setInitializing] = useState(false);
  const [initError, setInitError] = useState(false);
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

  const hasProfile = !!userProfile;

  useEffect(() => {
    if (!userProfile) return;
    let cancelled = false;
    setInitializing(true);
    setInitError(false);

    initChat(userProfile)
      .then((id) => !cancelled && localStorage.setItem("chat_session_id", id))
      .catch((err) => {
        console.error("Chat init error:", err);
        if (!cancelled) setInitError(true);
      })
      .finally(() => !cancelled && setInitializing(false));

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasProfile]);

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
      <Snackbar
        open={initializing}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Paper
          elevation={6}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.5,
            borderRadius: "12px",
          }}
        >
          <CircularProgress size={18} />
          <Typography variant="body2">
            Loading your farm data into the assistant...
          </Typography>
        </Paper>
      </Snackbar>

      <Snackbar
        open={initError}
        autoHideDuration={6000}
        onClose={() => setInitError(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity="warning" onClose={() => setInitError(false)}>
          Couldn't load your farm data. I'll retry when you send a message.
        </Alert>
      </Snackbar>
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
