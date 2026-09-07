import React, { useEffect, useState } from "react";
import {
  Outlet,
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Box,
  Container,
  Snackbar,
  Alert,
  Slide,
  type SlideProps,
} from "@mui/material";

// "Enters from the right" = the child slides in moving toward the left
// (MUI's `direction` describes the direction of travel, not the origin).
function SlideFromRight(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

const AuthLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // AppLayout redirects here (replace: true) with
    // state: { authErrorMessage } when the farm-profile fetch fails.
    // location.state survives the navigation that got us here, which is
    // exactly why this works where the old AppLayout-local toast state
    // didn't -- AppLayout had already unmounted by the time we'd want to
    // show it.
    const state = location.state as { authErrorMessage?: string } | null;
    if (state?.authErrorMessage) {
      setToastMessage(state.authErrorMessage);
      setToastOpen(true);

      // Clear the message out of history state once consumed, so it
      // doesn't reappear on a page refresh or when navigating back to
      // this entry (browser back/forward re-delivers the same state
      // object otherwise).
      navigate(location.pathname, { replace: true, state: null });
    }
    // Only re-run when the location actually changes (new navigation in
    // with new state) -- not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

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

      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        slots={{
          transition: SlideFromRight,
        }}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AuthLayout;
