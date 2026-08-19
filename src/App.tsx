import { useMemo, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
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
const PestAdvisor = lazy(
  () => import("./pages/recommendations/PestAdvisor"),
);
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
                <Route
                  path="/recommendations/pest"
                  element={<PestAdvisor />}
                />
                <Route
                  path="/yield-prediction"
                  element={<YieldPrediction />}
                />
                <Route path="/farm-planner" element={<FarmPlanner />} />
                <Route
                  path="/market-advisory"
                  element={<MarketAdvisory />}
                />
                <Route path="/records" element={<FarmRecords />} />
                <Route
                  path="/notifications"
                  element={<Notifications />}
                />
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
// import { useState, useMemo } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ThemeProvider, CssBaseline } from "@mui/material";
// import { lightTheme, darkTheme } from "./theme/theme";

// // Layouts
// import AppLayout from "./components/layout/AppLayout";
// import AuthLayout from "./components/layout/AuthLayout";

// // Pages - Marketing
// import Landing from "./pages/Landing";

// // Pages - Auth
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import ForgotPassword from "./pages/ForgotPassword";

// // Pages - App
// import Dashboard from "./pages/Dashboard";
// import CropRecommendation from "./pages/recommendations/CropRecommendation";
// import WeatherAdvisory from "./pages/recommendations/WeatherAdvisory";
// import FertilizerAdvisor from "./pages/recommendations/FertilizerAdvisor";
// import PestAdvisor from "./pages/recommendations/PestAdvisor";
// import YieldPrediction from "./pages/YieldPrediction";
// import FarmPlanner from "./pages/FarmPlanner";
// import MarketAdvisory from "./pages/MarketAdvisory";
// import FarmRecords from "./pages/FarmRecords";
// import Notifications from "./pages/Notifications";
// import AIAssistant from "./pages/AIAssistant";
// import Profile from "./pages/Profile";
// import Settings from "./pages/Settings";
// import FarmerOnboarding from "./pages/FarmerOnboarding";
// import NotFound from "./pages/NotFound";
// import ProtectedRoute from "./pages/protecteroutes";


// function App() {
//   const [mode, setMode] = useState<"light" | "dark">("light");

//   const theme = useMemo(
//     () => (mode === "light" ? lightTheme : darkTheme),
//     [mode],
//   );

//   const toggleTheme = () => {
//     setMode((prev) => (prev === "light" ? "dark" : "light"));
//   };

//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <BrowserRouter>
//         <Routes>
//           {/* Public / Marketing */}
//           <Route
//             path="/"
//             element={<Landing toggleTheme={toggleTheme} mode={mode} />}
//           />

//           {/* Auth */}
//           <Route element={<AuthLayout />}>
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//           </Route>

//           {/* Onboarding */}
//           <Route element={<ProtectedRoute/>}>
//             <Route path="/onboarding" element={<FarmerOnboarding />} />
//           </Route>

//           {/* Protected App Routes */}
//           <Route element={<ProtectedRoute />}>
//             <Route
//               element={<AppLayout toggleTheme={toggleTheme} mode={mode} />}
//             >
//               <Route
//                 path="/dashboard"
//                 element={<Dashboard />}
//               />
//               <Route
//                 path="/recommendations/crop"
//                 element={
//                   <CropRecommendation
//                     // recommmendationData={userProfile?.recommendations}
//                   />
//                 }
//               />
//               <Route
//                 path="/recommendations/weather"
//                 element={<WeatherAdvisory />}
//               />
//               <Route
//                 path="/recommendations/fertilizer"
//                 element={<FertilizerAdvisor />}
//               />
//               <Route path="/recommendations/pest" element={<PestAdvisor />} />
//               <Route path="/yield-prediction" element={<YieldPrediction />} />
//               <Route path="/farm-planner" element={<FarmPlanner />} />
//               <Route path="/market-advisory" element={<MarketAdvisory />} />
//               <Route path="/records" element={<FarmRecords />} />
//               <Route path="/notifications" element={<Notifications />} />
//               <Route path="/ai-assistant" element={<AIAssistant />} />
//               <Route path="/profile" element={<Profile />} />
//               <Route path="/settings" element={<Settings />} />
//             </Route>
//           </Route>

//           {/* 404 */}
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }

// export default App;
