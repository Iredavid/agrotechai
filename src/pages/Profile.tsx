import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar,
  InputAdornment,
  Alert,
  Collapse,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Person from "@mui/icons-material/Person";
import Email from "@mui/icons-material/Email";
import Lock from "@mui/icons-material/Lock";
import Edit from "@mui/icons-material/Edit";
import DashboardCard from "../components/ui/DashboardCard";
import { useAuth } from "../context/AuthContext";
import { getData } from "../services/onboarding";
import { useQuery } from "@tanstack/react-query";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
  verifyBeforeUpdateEmail,
} from "firebase/auth";
import { mapFirebaseAccountError, updateUser } from "../services/auth";

interface AccountFormData {
  fullName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FarmFormData {
  farmSize: string;
  soilType: string;
  state: string;
}

const Profile: React.FC = () => {
  // const SOIL_TYPE_OPTIONS = await getData("soil");
  const { data, isLoading } = useQuery({
    queryKey: ["onboarding-options"],
    queryFn: async () => {
      const [soil] = await Promise.all([
        getData("soil"),
        // getData("irrigation"),
        // getData("states"),
      ]);

      return {
        soil,
        // irrigation,
        // states,
      };
    },
  });
  // const queryClient = useQueryClient();
  const soilOptions = useMemo(() => data?.soil ?? [], [data]);
  // const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const { userData, userProfile, refreshProfile } = useAuth();

  const [accountData, setAccountData] = useState<AccountFormData>({
    fullName: userData?.displayName ?? "",
    email: userData?.email ?? "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);

  const handleAccountChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setAccountData((prev) => ({ ...prev, [name]: value }));
    if (accountError) setAccountError(null);
    if (accountSuccess) setAccountSuccess(null);
  };
  const wantsEmailChange = accountData.email !== (userData?.email ?? "");
  const wantsPasswordChange = accountData.newPassword.length > 0;
  // Both email and password changes are "sensitive operations" in Firebase --
  // both throw auth/requires-recent-login without a fresh reauthentication.
  const wantsSensitiveChange = wantsEmailChange || wantsPasswordChange;

  const isAccountValid =
    accountData.fullName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountData.email) &&
    (!wantsSensitiveChange || accountData.currentPassword.length > 0) &&
    (!wantsPasswordChange ||
      (accountData.newPassword.length >= 6 &&
        accountData.newPassword === accountData.confirmPassword));

  const handleAccountSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isAccountValid || !userData) return;
    setSavingAccount(true);
    setSavingAccount(true);
    setAccountError(null);
    setAccountSuccess(null);
    try {
      if (wantsSensitiveChange) {
        const credential = EmailAuthProvider.credential(
          userData.email!,
          accountData.currentPassword,
        );
        await reauthenticateWithCredential(userData, credential);
      }
      if (accountData.fullName !== (userData?.displayName ?? "")) {
        await updateProfile(userData, {
          displayName: accountData.fullName,
        });
        await updateUser(accountData.fullName, userData.uid);
      }

      let emailChangeRequested = false;
      if (wantsEmailChange) {
        await verifyBeforeUpdateEmail(userData, accountData.email);
        emailChangeRequested = true;
      }

      if (wantsPasswordChange) {
        await updatePassword(userData, accountData.newPassword);
      }

      setAccountSuccess(
        emailChangeRequested
          ? "Account updated. Check your new email inbox and click the confirmation link to finish changing your email address."
          : "Your account details have been updated.",
      );
      setAccountData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));

      // await refreshProfile();
    } catch (err: any) {
      setAccountError(mapFirebaseAccountError(err?.code));
    } finally {
      setSavingAccount(false);
    }
  };

  // ---------------- Farm form state ----------------
  const [farmData, setFarmData] = useState<FarmFormData>({
    // farmName: "",
    farmSize: "",
    soilType: "loam",
    state: "",
    // irrigationMethod: "none",
    // lat: null,
    // lon: null,
  });
  useEffect(() => {
    // console.log("userProfile changed:", userProfile);
    if (!userProfile) return;
    setFarmData((prev) => ({
      ...prev,
      // farmName: userProfile.farmName ?? prev.farmName,
      farmSize: userProfile.farm_size_ha?.toString() ?? prev.farmSize,
      soilType: userProfile.manual_soil_texture ?? prev.soilType,
      state: userProfile.state ?? prev.state,
      // irrigationMethod: userProfile.irrigation_type ?? prev.irrigationMethod,
    }));
  }, [userProfile]);

  return (
    <Box sx={{ maxWidth: "lg", mx: "auto" }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 4 }}>
        Farmer Profile
      </Typography>

      <Grid container spacing={3}>
        {/* Left Column */}
        <Grid size={{ xs: 12, md: 4 }}>
          <DashboardCard title="Profile Picture">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                py: 2,
              }}
            >
              <Avatar
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Farmer"
                sx={{ width: 120, height: 120, mb: 3 }}
              />
              <Button variant="outlined" size="small">
                Change Picture
              </Button>
            </Box>
          </DashboardCard>

          <Box sx={{ mt: 3 }}>
            <DashboardCard title="Farm Details Summary">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Farm Size
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {farmData.farmSize ? `${farmData.farmSize} Hectares` : "—"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Soil Type
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {isLoading
                      ? "loading..."
                      : soilOptions.find(
                          (o: any) => o.value === farmData.soilType,
                        )?.label || "—"}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Location
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {farmData.state ? `${farmData.state} State` : "—"}
                  </Typography>
                </Box>
              </Box>
            </DashboardCard>
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid size={{ xs: 12, md: 8 }}>
          <DashboardCard
            title="Personal Information"
            action={
              <Button
                variant="outlined"
                size="small"
                startIcon={<Edit />}
                component={RouterLink}
                to={"/onboarding"}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 2,
                }}
              >
                Edit Farm Details
              </Button>
            }
          >
            <form onSubmit={handleAccountSubmit} noValidate>
              <Grid container spacing={3} className="mt-4">
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    name="fullName"
                    label="Full Name"
                    value={accountData.fullName}
                    onChange={handleAccountChange}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    label="Email Address"
                    value={accountData.email}
                    onChange={handleAccountChange}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>

                {!isAccountValid ? (
                  <Grid size={{ xs: 12 }}>
                    <Divider sx={{ my: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Re-authentication on current password required for
                        sensitive changes
                      </Typography>
                    </Divider>
                  </Grid>
                ) : null}

                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    name="currentPassword"
                    type="password"
                    label="Current Password"
                    value={accountData.currentPassword}
                    onChange={handleAccountChange}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    name="newPassword"
                    type="password"
                    label="New Password"
                    value={accountData.newPassword}
                    onChange={handleAccountChange}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                  <TextField
                    fullWidth
                    name="confirmPassword"
                    type="password"
                    label="Confirm New Password"
                    value={accountData.confirmPassword}
                    onChange={handleAccountChange}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock fontSize="small" />
                          </InputAdornment>
                        ),
                      },
                    }}
                    error={
                      accountData.newPassword.length > 0 &&
                      accountData.newPassword !== accountData.confirmPassword
                    }
                    helperText={
                      accountData.newPassword.length > 0 &&
                      accountData.newPassword !== accountData.confirmPassword
                        ? "Passwords don't match"
                        : " "
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Collapse in={!!accountError}>
                    <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                      {accountError}
                    </Alert>
                  </Collapse>
                  <Collapse in={!!accountSuccess}>
                    <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                      {accountSuccess}
                    </Alert>
                  </Collapse>
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mb: 3 }}
                  >
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={!isAccountValid || savingAccount}
                    >
                      {savingAccount ? (
                        <CircularProgress size={22} color="inherit" />
                      ) : (
                        "Save Account Changes"
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
