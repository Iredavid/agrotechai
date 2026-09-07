import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  TextField,
  InputAdornment,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import DashboardCard from "../../components/ui/DashboardCard";
import Science from "@mui/icons-material/Science";
import Calculate from "@mui/icons-material/Calculate";
import Description from "@mui/icons-material/Description";
import Grass from "@mui/icons-material/Grass";
import Landscape from "@mui/icons-material/Landscape";
import TrendingUp from "@mui/icons-material/TrendingUp";
import { useAuth } from "../../context/AuthContext";
import autoTable from "jspdf-autotable";
import jsPDF from "jspdf";

const FertilizerAdvisor: React.FC = () => {
  const farmProfile = useAuth().userProfile;

  const SUPPORTED_CROPS = [
    { value: "maize", label: "Maize" },
    { value: "cassava", label: "Cassava" },
    { value: "rice", label: "Rice" },
    { value: "yam", label: "Yam" },
    { value: "sorghum", label: "Sorghum" },
    { value: "millet", label: "Millet" },
    { value: "cocoa", label: "Cocoa" },
    { value: "oil_palm", label: "Oil Palm" },
  ];
  const [crop, setCrop] = useState("maize");
  const [targetYield, setTargetYield] = useState("5");
  const [farmArea, setFarmArea] = useState(
    String(farmProfile.farm_size_ha ?? 1),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

    // Builds a report that shows its work: every input that went into the
  // calculation, the resulting numbers, and the method notes -- so it can
  // be independently checked rather than just trusted.
  const handleExportPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    const generatedAt = new Date().toLocaleString();
    let y = 18;

    doc.setFontSize(16);
    doc.text("Fertilizer Recommendation Report", 14, y);
    y += 7;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(
      `Farm: ${farmProfile.farmName ?? "-"}   |   Generated: ${generatedAt}`,
      14,
      y,
    );
    doc.setTextColor(0);
    y += 10;

    // --- 1. Inputs used -- this is what makes the report checkable ------
    doc.setFontSize(12);
    doc.text("1. Inputs used for this calculation", 14, y);
    y += 2;
    autoTable(doc, {
      startY: y + 4,
      head: [["Input", "Value", "Source"]],
      body: [
        ["Crop", result.crop, "Selected by user"],
        ["Target yield", `${result.target_yield_t_ha} t/ha`, "Selected by user"],
        ["Farm area", `${result.farm_size_ha} ha`, "Farm profile"],
        [
          "Soil P (extractable)",
          `${result.soil_context.p_level}`,
          "iSDAsoil Africa, live",
        ],
        [
          "Soil K (extractable)",
          `${result.soil_context.k_level}`,
          "iSDAsoil Africa, live",
        ],
        [
          "Soil pH",
          result.soil_context.ph !== null ? result.soil_context.ph.toFixed(1) : "-",
          "ISRIC SoilGrids, live",
        ],
      ],
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [46, 125, 50] },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 10;

    // --- 2. Calculated requirement --------------------------------------
    doc.setFontSize(12);
    doc.text("2. Calculated nutrient requirement (per hectare)", 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [["Nutrient", "kg/ha", "Basis"]],
      body: [
        [
          "Nitrogen (N)",
          `${result.requirement_per_ha.n_kg_ha}`,
          "Published crop rate x yield scale (not soil-adjusted -- see note)",
        ],
        [
          "Phosphorus (P2O5)",
          `${result.requirement_per_ha.p2o5_kg_ha}`,
          `Published crop rate x yield scale, adjusted for ${result.soil_context.p_level} soil P`,
        ],
        [
          "Potassium (K2O)",
          `${result.requirement_per_ha.k2o_kg_ha}`,
          `Published crop rate x yield scale, adjusted for ${result.soil_context.k_level} soil K`,
        ],
      ],
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [46, 125, 50] },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 10;

    // --- 3. Application plan --------------------------------------------
    doc.setFontSize(12);
    doc.text("3. Application plan", 14, y);
    autoTable(doc, {
      startY: y + 4,
      head: [["Stage", "Product", "Timing", "kg/ha", "Total for farm"]],
      body: [
        [
          "Basal",
          result.application_plan.per_ha.basal.product,
          result.application_plan.per_ha.basal.timing,
          `${result.application_plan.per_ha.basal.kg_per_ha}`,
          `${result.application_plan.farm_totals.basal_total_kg} kg`,
        ],
        [
          "Top dress",
          result.application_plan.per_ha.topdress.product,
          result.application_plan.per_ha.topdress.timing,
          `${result.application_plan.per_ha.topdress.kg_per_ha}`,
          `${result.application_plan.farm_totals.topdress_total_kg} kg`,
        ],
      ],
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [46, 125, 50] },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 10;

    // --- 4. Notes / caveats ----------------------------------------------
    if (result.notes.length > 0) {
      doc.setFontSize(12);
      doc.text("4. Notes", 14, y);
      y += 6;
      doc.setFontSize(9);
      result.notes.forEach((note: any) => {
        const lines = doc.splitTextToSize(`- ${note}`, 180);
        doc.text(lines, 14, y);
        y += lines.length * 4.5 + 2;
      });
      y += 4;
    }

    // --- Footer disclaimer -------------------------------------------
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(
      doc.splitTextToSize(
        "Base NPK rates are compiled from published Nigerian agronomy " +
          "extension sources (IITA / FMARD / state ADP guides) and adjusted " +
          "using this farm's live soil test data (iSDAsoil Africa, ISRIC " +
          "SoilGrids). Review against your local extension officer's current " +
          "recommendation before large-scale application.",
        180,
      ),
      14,
      y,
    );

    doc.save(
      `fertilizer-recommendation-${result.crop}-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`,
    );
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recommendation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crop,
          target_yield_t_ha: Number(targetYield),
          farm_size_ha: Number(farmArea),
          features: farmProfile.features_used,
        }),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.detail ?? "Could not calculate recommendation.");
      }
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong calculating the recommendation.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Fertilizer Advisor
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Calculate the exact nutrient requirements for your crop and soil type.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 5 }}>
          <DashboardCard title="NPK Calculator">
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 2 }}
            >
              <TextField
                select
                label="Target Crop"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Grass fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              >
                {SUPPORTED_CROPS.map((crop) => (
                  <MenuItem key={crop.value} value={crop.value}>
                    {crop.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Target Yield"
                value={targetYield}
                onChange={(e) => setTargetYield(e.target.value)}
                type="number"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <TrendingUp fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">tons/ha</InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                label="Farm Area"
                type="number"
                value={farmArea}
                onChange={(e) => setFarmArea(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Landscape fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">hectares</InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                variant="contained"
                size="large"
                startIcon={
                  loading ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <Calculate />
                  )
                }
                onClick={handleCalculate}
                disabled={loading}
              >
                {loading ? "Calculating..." : "Calculate Requirement"}
              </Button>
              {error && <Alert severity="error">{error}</Alert>}
            </Box>
          </DashboardCard>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <DashboardCard title="Recommendation Results">
            {!result ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Set your crop, target yield, and farm area, then calculate to
                  see a recommendation based on your farm's actual soil data.
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    bgcolor: "action.hover",
                    p: 3,
                    borderRadius: "12px",
                    mb: 3,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <Science color="primary" /> Suggested Blend:{" "}
                    {result.application_plan.per_ha.basal.product} +{" "}
                    {result.application_plan.per_ha.topdress.product}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{ color: "primary.main", fontWeight: 700 }}
                        >
                          {result.requirement_per_ha.n_kg_ha}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          kg/ha N
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{ color: "secondary.main", fontWeight: 700 }}
                        >
                          {result.requirement_per_ha.p2o5_kg_ha}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          kg/ha P₂O₅ ({result.soil_context.p_level} soil P)
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 4 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          textAlign: "center",
                          border: "1px solid",
                          borderColor: "divider",
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{ color: "error.main", fontWeight: 700 }}
                        >
                          {result.requirement_per_ha.k2o_kg_ha}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          kg/ha K₂O ({result.soil_context.k_level} soil K)
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Application Schedule
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderLeft: "4px solid",
                      borderLeftColor: "primary.main",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Basal Application (
                      {result.application_plan.per_ha.basal.timing})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Apply {result.application_plan.per_ha.basal.kg_per_ha}
                      kg of {result.application_plan.per_ha.basal.product} per
                      hectare (
                      {result.application_plan.farm_totals.basal_total_kg}
                      kg total for your {result.farm_size_ha}ha farm).
                    </Typography>
                  </Paper>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      borderLeft: "4px solid",
                      borderLeftColor: "secondary.main",
                      bgcolor: "background.paper",
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Top Dressing (
                      {result.application_plan.per_ha.topdress.timing})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Apply {result.application_plan.per_ha.topdress.kg_per_ha}
                      kg of {
                        result.application_plan.per_ha.topdress.product
                      }{" "}
                      per hectare (
                      {result.application_plan.farm_totals.topdress_total_kg}
                      kg total for your {result.farm_size_ha}ha farm).
                    </Typography>
                  </Paper>
                </Box>

                {result.notes.length > 0 && (
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {result.notes.map(
                      (
                        note:
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              unknown,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<
                              | string
                              | number
                              | bigint
                              | boolean
                              | React.ReactPortal
                              | React.ReactElement<
                                  unknown,
                                  string | React.JSXElementConstructor<any>
                                >
                              | Iterable<React.ReactNode>
                              | null
                              | undefined
                            >
                          | null
                          | undefined,
                        i: React.Key | null | undefined,
                      ) => (
                        <Alert
                          key={i}
                          severity="info"
                          sx={{ fontSize: "0.85rem" }}
                        >
                          {note}
                        </Alert>
                      ),
                    )}
                  </Box>
                )}

                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  sx={{ mt: 3 }}
                  onClick={handleExportPDF}
                >
                  Export PDF Report
                </Button>
              </>
            )}
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FertilizerAdvisor;
