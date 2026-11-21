import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import DashboardCard from "../../components/ui/DashboardCard";
import BugReport from "@mui/icons-material/BugReport";
import CameraAlt from "@mui/icons-material/CameraAlt";
import Upload from "@mui/icons-material/Upload";
import CameraCaptureDialog from "../../components/CameraCaptureDialog";
import {
  CROPS,
  detectPest,
  getSymptomAdvisory,
  getSymptomOptions,
  getThreats,
  hasLocalModel,
  prepareImage,
  type Advisory,
  type DetectResult,
  type PestReference,
  type Threat,
  type TreatmentInfo,
} from "../../services/pest";

// ---------- small helpers ----------

const NAME_FIXES: Record<string, string> = {
  grasshoper: "Grasshopper", // typo in the source dataset's folder name
  cssvd: "Cocoa swollen shoot virus disease (CSSVD)",
  normal: "Healthy",
};

const prettify = (raw: string): string => {
  const key = raw.trim().toLowerCase();
  if (NAME_FIXES[key]) return NAME_FIXES[key];
  const t = key.replace(/_/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
};

const cropLabel = (value: string | null): string =>
  CROPS.find((c) => c.value === value)?.label ?? (value ? prettify(value) : "");
const isHealthy = (disease: string): boolean =>
  /^(healthy|normal)$/i.test(disease);
const toList = (v?: string | string[]): string[] =>
  Array.isArray(v) ? v : v ? [v] : [];

const timeAgo = (ts: number): string => {
  const mins = Math.round((Date.now() - ts) / 60000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (mins < 60) return rtf.format(-Math.max(mins, 0), "minute");
  if (mins < 60 * 24) return rtf.format(-Math.round(mins / 60), "hour");
  return rtf.format(-Math.round(mins / 1440), "day");
};

const isMobileDevice = (): boolean =>
  /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const canUseWebcam = (): boolean => !!navigator.mediaDevices?.getUserMedia;

// ---------- recent scans (device-local; see notes on moving this server-side) ----------

const RECENT_KEY = "agrotech.pestScans.v1";
interface ScanRecord {
  id: string;
  ts: number;
  crop: string;
  result: DetectResult;
  thumb: string;
}

const loadRecent = (): ScanRecord[] => {
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(parsed) ? (parsed as ScanRecord[]) : [];
  } catch {
    return [];
  }
};
const persistRecent = (items: ScanRecord[]): void => {
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(items));
  } catch {
    /* storage full or blocked: recent scans are a convenience only */
  }
};

// ---------- presentational pieces ----------

const TreatmentCard: React.FC<{
  title: string;
  color: string;
  items: string[];
}> = ({ title, color, items }) => {
  if (items.length === 0) return null;
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color, mb: 1 }}>
        {title}
      </Typography>
      {items.map((line) => (
        <Typography
          key={line}
          variant="body2"
          color="text.secondary"
          sx={{ mb: 0.5 }}
        >
          {line}
        </Typography>
      ))}
    </Paper>
  );
};

const TreatmentSection: React.FC<{ treatment?: TreatmentInfo | null }> = ({
  treatment,
}) => {
  const biological = toList(treatment?.biological);
  const chemical = toList(treatment?.chemical);
  const prevention = toList(treatment?.prevention);
  if (!biological.length && !chemical.length && !prevention.length) {
    return (
      <Alert severity="info" sx={{ borderRadius: "12px" }}>
        Detailed treatment steps are not available for this diagnosis yet.
        Please check with your local agricultural extension officer.
      </Alert>
    );
  }
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TreatmentCard
        title="Organic approach"
        color="primary.main"
        items={biological}
      />
      <TreatmentCard
        title="Chemical approach"
        color="error.main"
        items={chemical}
      />
      <TreatmentCard
        title="Prevention"
        color="text.primary"
        items={prevention}
      />
    </Box>
  );
};

const ReferencePanel: React.FC<{ reference: PestReference }> = ({
  reference,
}) => (
  <Paper
    elevation={0}
    sx={{ p: 2, mt: 2, border: "1px dashed", borderColor: "divider" }}
  >
    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
      Reference statistics (illustrative)
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Average reported yield loss: {reference.avg_yield_loss_pct}% across{" "}
      {reference.sample_size.toLocaleString()} recorded cases.
    </Typography>
    <Typography
      variant="caption"
      color="warning.main"
      sx={{ display: "block", mt: 1 }}
    >
      {reference.data_caveat}
    </Typography>
  </Paper>
);

const DiagnosisPanel: React.FC<{ result: DetectResult }> = ({ result }) => {
  const mismatch = result.crop_match === false;
  const unverified =
    result.source === "external_api" && result.crop_match !== true;
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1,
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mr: 1 }}>
          {prettify(result.disease)}
        </Typography>
        <Chip size="small" label={cropLabel(result.crop)} />
        <Chip
          size="small"
          color={result.confidence >= 0.6 ? "success" : "warning"}
          label={`${Math.round(result.confidence * 100)}% confidence`}
        />
        {result.source === "external_api" && (
          <Chip
            size="small"
            variant="outlined"
            label="Second-opinion service"
          />
        )}
      </Box>
      {mismatch && (
        <Alert severity="warning" sx={{ borderRadius: "12px", mb: 2 }}>
          The second-opinion service thinks this photo shows{" "}
          {prettify(result.identified_crop ?? "a different crop")}, not{" "}
          {cropLabel(result.crop)}. It may not cover {cropLabel(result.crop)},
          so this result may be wrong. Try a closer photo of the affected part,
          or pick the pest below.
        </Alert>
      )}
      {unverified && !mismatch && (
        <Alert severity="info" sx={{ borderRadius: "12px", mb: 2 }}>
          This result comes from an outside service that is not specially
          trained on {cropLabel(result.crop)}. Please confirm it with your local
          extension officer.
        </Alert>
      )}
      {mismatch ? null : isHealthy(result.disease) ? (
        <Alert severity="success" sx={{ borderRadius: "12px" }}>
          No disease detected on this sample. Keep monitoring, and scan again if
          symptoms appear.
        </Alert>
      ) : (
        <>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Treatment protocol
          </Typography>
          <TreatmentSection treatment={result.treatment} />
          {result.reference && <ReferencePanel reference={result.reference} />}
        </>
      )}
    </Box>
  );
};

const AdvisoryPanel: React.FC<{ advisory: Advisory }> = ({ advisory }) => {
  if (advisory.tier === "not_found") {
    return <Alert severity="info">{advisory.note}</Alert>;
  }
  if (advisory.tier === "general_guidance") {
    return (
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
          {prettify(advisory.pest_disease)}
        </Typography>
        <Typography variant="body2" sx={{ mb: 2 }}>
          {advisory.description}
        </Typography>
        <TreatmentCard
          title="General guidance"
          color="primary.main"
          items={[advisory.general_guidance]}
        />
        <Typography
          variant="caption"
          color="warning.main"
          sx={{ display: "block", mt: 1 }}
        >
          {advisory.disclaimer}
        </Typography>
      </Box>
    );
  }
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        {prettify(advisory.pest_disease)}
      </Typography>
      <TreatmentSection treatment={null} />
      <ReferencePanel reference={advisory} />
    </Box>
  );
};

// ---------- page ----------

const PestAdvisor: React.FC = () => {
  const [crop, setCrop] = useState<string>("maize");
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DetectResult | null>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [recent, setRecent] = useState<ScanRecord[]>(loadRecent);
  const [threats, setThreats] = useState<Threat[] | null>(null);

  // symptom mode (crops without an image model)
  const [pestOptions, setPestOptions] = useState<string[]>([]);
  const [selectedPest, setSelectedPest] = useState("");
  const [advisory, setAdvisory] = useState<Advisory | null>(null);

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const reqRef = useRef(0); // ignore responses from superseded requests

  const localModel = hasLocalModel(crop);

  useEffect(() => {
    let alive = true;
    getThreats().then((t) => alive && setThreats(t));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(
    () => () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
    },
    [],
  );

  const resetOutput = () => {
    reqRef.current += 1;
    setLoading(false);
    setError(null);
    setResult(null);
    setAdvisory(null);
    setSelectedPest("");
    setPreviewSrc(null);
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const handleCropChange = (next: string) => {
    setCrop(next);
    resetOutput();
    setPestOptions([]);
    if (!hasLocalModel(next)) {
      const id = reqRef.current;
      getSymptomOptions(next)
        .then((o) => {
          if (id !== reqRef.current) return;
          setPestOptions([
            ...(o.data_backed_options ?? []),
            ...(o.general_guidance_options ?? []),
            ...(o.options ?? []),
          ]);
        })
        .catch((e: unknown) => {
          if (id === reqRef.current)
            setError(
              e instanceof Error ? e.message : "Could not load options.",
            );
        });
    }
  };

  // load symptom options on first render if the default crop has no image model
  useEffect(() => {
    if (!hasLocalModel(crop)) handleCropChange(crop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImage = async (input: Blob | null | undefined) => {
    if (!input) return;
    const id = ++reqRef.current;
    const cropAtRequest = crop;
    setError(null);
    setResult(null);
    setAdvisory(null);
    setSelectedPest("");
    setLoading(true);
    try {
      const prepared = await prepareImage(input);
      if (id !== reqRef.current) return;
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = URL.createObjectURL(prepared.file);
      setPreviewSrc(objectUrlRef.current);

      const res = await detectPest(cropAtRequest, prepared.file);
      if (id !== reqRef.current) return;
      setResult(res);
      setRecent((prev) => {
        const next = [
          {
            id: crypto.randomUUID(),
            ts: Date.now(),
            crop: cropAtRequest,
            result: res,
            thumb: prepared.thumb,
          },
          ...prev,
        ].slice(0, 5);
        persistRecent(next);
        return next;
      });
    } catch (e) {
      if (id === reqRef.current)
        setError(
          e instanceof Error
            ? e.message
            : "Something went wrong. Please try again.",
        );
    } finally {
      if (id === reqRef.current) setLoading(false);
    }
  };

  const handleTakePhoto = () => {
    if (isMobileDevice() || !canUseWebcam()) nativeCameraRef.current?.click();
    else setCameraOpen(true);
  };

  const handlePestSelect = async (pest: string) => {
    setSelectedPest(pest);
    setAdvisory(null);
    setResult(null);
    setPreviewSrc(null);
    setError(null);
    if (!pest) return;
    const id = ++reqRef.current;
    setLoading(true);
    try {
      const a = await getSymptomAdvisory(crop, pest);
      if (id === reqRef.current) setAdvisory(a);
    } catch (e) {
      if (id === reqRef.current)
        setError(e instanceof Error ? e.message : "Could not load advice.");
    } finally {
      if (id === reqRef.current) setLoading(false);
    }
  };

  const viewScan = (rec: ScanRecord) => {
    reqRef.current += 1;
    setLoading(false);
    setError(null);
    setAdvisory(null);
    setCrop(rec.crop);
    setResult(rec.result);
    setPreviewSrc(rec.thumb);
  };

  const onFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    void handleImage(e.target.files?.[0]);
    e.target.value = ""; // allow choosing the same file again
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Pest & Disease Advisor
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload or capture a photo of the affected plant for AI-powered
          diagnosis.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <DashboardCard title="AI Diagnosis">
            <TextField
              select
              fullWidth
              size="small"
              label="Crop"
              value={crop}
              onChange={(e) => handleCropChange(e.target.value)}
              sx={{ mb: 3 }}
            >
              {CROPS.map((c) => (
                <MenuItem key={c.value} value={c.value}>
                  {c.label}
                </MenuItem>
              ))}
            </TextField>

            <Box
              sx={{
                border: "2px dashed",
                borderColor: "divider",
                borderRadius: "16px",
                p: 4,
                textAlign: "center",
                bgcolor: "action.hover",
              }}
            >
              {previewSrc ? (
                <Box
                  component="img"
                  src={previewSrc}
                  alt="Selected plant"
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 220,
                    borderRadius: "12px",
                    mb: 2,
                  }}
                />
              ) : (
                <CameraAlt
                  sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
                />
              )}
              <Typography variant="h6" sx={{ mb: 1 }}>
                Take or upload a picture
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Focus on the affected leaves, pods or pests, in good light.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="contained"
                  startIcon={<CameraAlt />}
                  onClick={handleTakePhoto}
                  disabled={loading}
                >
                  Take Photo
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Upload />}
                  onClick={() => uploadInputRef.current?.click()}
                  disabled={loading}
                >
                  Upload Image
                </Button>
              </Box>
              <input
                ref={uploadInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={onFileChosen}
              />
              <input
                ref={nativeCameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                hidden
                onChange={onFileChosen}
              />
            </Box>

            {!localModel && (
              <Box sx={{ mt: 3 }}>
                <Alert severity="info" sx={{ mb: 2, borderRadius: "12px" }}>
                  Photos of {cropLabel(crop)} are checked by an outside service,
                  so results may be less reliable. If you already know what you
                  are dealing with, pick it below instead.
                </Alert>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Or pick a pest or disease"
                  value={selectedPest}
                  onChange={(e) => void handlePestSelect(e.target.value)}
                  disabled={pestOptions.length === 0}
                  helperText={
                    pestOptions.length === 0
                      ? "No pest records are available for this crop yet."
                      : undefined
                  }
                >
                  {pestOptions.map((p) => (
                    <MenuItem key={p} value={p}>
                      {prettify(p)}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            )}

            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Recent Scans
              </Typography>
              {recent.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  Your recent scans will appear here.
                </Typography>
              ) : (
                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                >
                  {recent.map((rec) => (
                    <Paper
                      key={rec.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        component="img"
                        src={rec.thumb}
                        alt=""
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                      />
                      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {isHealthy(rec.result.disease)
                            ? "Healthy"
                            : prettify(rec.result.disease)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {cropLabel(rec.crop)} • {timeAgo(rec.ts)}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => viewScan(rec)}
                      >
                        View
                      </Button>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </DashboardCard>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <DashboardCard title="Diagnosis">
            {loading && (
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, py: 2 }}
              >
                <CircularProgress size={22} />
                <Typography variant="body2" color="text.secondary">
                  Analysing…
                </Typography>
              </Box>
            )}
            {error && (
              <Alert severity="error" sx={{ borderRadius: "12px", mb: 2 }}>
                {error}
              </Alert>
            )}
            {!loading && !error && !result && !advisory && (
              <Typography variant="body2" color="text.secondary">
                Take or upload a photo to see the diagnosis and treatment steps
                here.
              </Typography>
            )}
            {result && <DiagnosisPanel result={result} />}
            {advisory && <AdvisoryPanel advisory={advisory} />}
          </DashboardCard>

          <Box sx={{ mt: 3 }}>
            <DashboardCard title="Active Threats in Your Area">
              {threats === null ? (
                <CircularProgress size={20} />
              ) : threats.length === 0 ? (
                <Alert
                  severity="info"
                  icon={<BugReport />}
                  sx={{ borderRadius: "12px" }}
                >
                  Outbreak alerts for your area are not connected yet.
                </Alert>
              ) : (
                threats.map((t) => (
                  <Alert
                    key={`${t.pest}-${t.message}`}
                    severity={
                      t.level === "high"
                        ? "error"
                        : t.level === "medium"
                          ? "warning"
                          : "info"
                    }
                    icon={<BugReport />}
                    sx={{ mb: 2, borderRadius: "12px" }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {prettify(t.pest)}
                    </Typography>
                    <Typography variant="body2">{t.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Source: {t.source}
                    </Typography>
                  </Alert>
                ))
              )}
            </DashboardCard>
          </Box>
        </Grid>
      </Grid>

      <CameraCaptureDialog
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={(blob) => void handleImage(blob)}
      />
    </Box>
  );
};

export default PestAdvisor;
