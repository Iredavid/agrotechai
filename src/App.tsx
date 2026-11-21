import { useMemo, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  CircularProgress,
} from "@mui/material";
import { lightTheme, darkTheme } from "./theme/theme";

// Layouts
import AppLayout from "./components/layout/AppLayout";
import AuthLayout from "./components/layout/AuthLayout";
import ProtectedRoute from "./pages/protecteroutes";

// Lazy load all pages
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const FarmerOnboarding = lazy(() => import("./pages/FarmerOnboarding"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const CropRecommendation = lazy(
  () => import("./pages/recommendations/CropRecommendation"),
);
const WeatherAdvisory = lazy(
  () => import("./pages/recommendations/WeatherAdvisory"),
);
const FertilizerAdvisor = lazy(
  () => import("./pages/recommendations/FertilizerAdvisor"),
);
const PestAdvisor = lazy(() => import("./pages/recommendations/PestAdvisor"));
const YieldPrediction = lazy(() => import("./pages/YieldPrediction"));
const FarmPlanner = lazy(() => import("./pages/FarmPlanner"));
const MarketAdvisory = lazy(() => import("./pages/MarketAdvisory"));
const FarmRecords = lazy(() => import("./pages/FarmRecords"));
const Notifications = lazy(() => import("./pages/Notifications"));
const AIAssistant = lazy(() => import("./pages/AIAssistant"));
const Profile = lazy(() => import("./pages/Profile"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading screen
const PageLoader = () => (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress />
  </Box>
);

function App() {
  const [mode, setMode] = useState<"light" | "dark">("light");

  const theme = useMemo(
    () => (mode === "light" ? lightTheme : darkTheme),
    [mode],
  );

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public */}
            <Route
              path="/"
              element={<Landing toggleTheme={toggleTheme} mode={mode} />}
            />

            {/* Auth */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Onboarding */}
            <Route element={<ProtectedRoute />}>
              <Route path="/onboarding" element={<FarmerOnboarding />} />
            </Route>

            {/* Protected App */}
            <Route element={<ProtectedRoute />}>
              <Route
                element={<AppLayout toggleTheme={toggleTheme} mode={mode} />}
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route
                  path="/recommendations/crop"
                  element={<CropRecommendation />}
                />
                <Route
                  path="/recommendations/weather"
                  element={<WeatherAdvisory />}
                />
                <Route
                  path="/recommendations/fertilizer"
                  element={<FertilizerAdvisor />}
                />
                <Route path="/recommendations/pest" element={<PestAdvisor />} />
                <Route path="/yield-prediction" element={<YieldPrediction />} />
                <Route path="/farm-planner" element={<FarmPlanner />} />
                <Route path="/market-advisory" element={<MarketAdvisory />} />
                <Route path="/records" element={<FarmRecords />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
