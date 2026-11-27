import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Add from "@mui/icons-material/Add";
import CheckCircle from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import RadioButtonUnchecked from "@mui/icons-material/RadioButtonUnchecked";
import DashboardCard from "../components/ui/DashboardCard";
import { useAuth } from "../context/AuthContext";
import { formatLabel } from "../services/dashboard";
import {
  PLANNER_CROPS,
  archivePlan,
  createPlan,
  getInsights,
  getSeason,
  listPlans,
  setTaskCompleted,
  type Improvement,
  type Insights,
  type Outlook,
  type Plan,
  type PlanTask,
  type PlantingWindow,
} from "../services/planner";

const toIso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const fmt = (
  iso: string | null | undefined,
  opts?: Intl.DateTimeFormatOptions,
) =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString(
        "en-GB",
        opts ?? { day: "numeric", month: "short", year: "numeric" },
      )
    : "-";

const KIND_COLOR: Record<
  string,
  "primary" | "secondary" | "warning" | "info" | "success" | "default"
> = {
  planting: "success",
  fertilizer: "secondary",
  amendment: "secondary",
  scouting: "warning",
  weeding: "info",
  irrigation: "info",
  harvest: "primary",
  post_harvest: "primary",
};

const PRIORITY_COLOR: Record<
  Improvement["priority"],
  "error" | "warning" | "default"
> = {
  high: "error",
  medium: "warning",
  low: "default",
};

const SOURCE_LABEL: Record<Outlook["source"], string> = {
  daily_history: "Based on daily rainfall for recent years",
  monthly_climatology:
    "Based on monthly rainfall averages (about a month's accuracy)",
  unavailable: "Rainfall timing unavailable for this location",
};

interface TaskRowProps {
  task: PlanTask;
  done: boolean;
  note?: string;
  onToggle: (task: PlanTask) => void;
}

const TaskRow: React.FC<TaskRowProps> = ({ task, done, note, onToggle }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      border: "1px solid",
      borderColor: "divider",
      borderRadius: "12px",
      display: "flex",
      alignItems: "flex-start",
      gap: 2,
      opacity: done ? 0.6 : 1,
    }}
  >
    <Box
      sx={{
        textAlign: "center",
        minWidth: 56,
        pr: 2,
        borderRight: "1px solid",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block" }}
      >
        {fmt(task.due, { weekday: "short" })}
      </Typography>
      <Typography
        variant="h5"
        color="primary.main"
        sx={{ fontWeight: 700, lineHeight: 1.1 }}
      >
        {fmt(task.due, { day: "numeric" })}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {fmt(task.due, { month: "short" })}
      </Typography>
    </Box>
    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
          mb: 0.5,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            textDecoration: done ? "line-through" : "none",
          }}
        >
          {task.title}
        </Typography>
        <Chip
          label={formatLabel(task.kind)}
          size="small"
          color={KIND_COLOR[task.kind] ?? "default"}
          variant="outlined"
        />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {task.details}
      </Typography>
      {task.due_end && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 0.5 }}
        >
          Do it between {fmt(task.due, { day: "numeric", month: "short" })} and{" "}
          {fmt(task.due_end, { day: "numeric", month: "short" })}
        </Typography>
      )}
      {note && !done && (
        <Alert severity="info" sx={{ mt: 1, py: 0, fontSize: "0.8rem" }}>
          {note}
        </Alert>
      )}
    </Box>
    <Tooltip title={done ? "Mark as not done" : "Mark as done"}>
      <IconButton
        color={done ? "primary" : "default"}
        onClick={() => onToggle(task)}
      >
        {done ? <CheckCircle /> : <RadioButtonUnchecked />}
      </IconButton>
    </Tooltip>
  </Paper>
);

const FarmPlanner: React.FC = () => {
  const { userProfile } = useAuth();

  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [insights, setInsights] = useState<Insights | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);

  // New-plan dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [crop, setCrop] = useState<string>("maize");
  const [plantingDate, setPlantingDate] = useState("");
  const [dateTouched, setDateTouched] = useState(false);
  const [plotName, setPlotName] = useState("");
  const [season, setSeason] = useState<{
    outlook: Outlook;
    window: PlantingWindow | null;
  } | null>(null);
  const [seasonLoading, setSeasonLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const todayIso = toIso(new Date());
  const selected = useMemo(
    () => plans?.find((p) => p.id === selectedId) ?? null,
    [plans, selectedId],
  );

  // Load saved plans once.
  useEffect(() => {
    let cancelled = false;
    listPlans()
      .then((data) => {
        if (cancelled) return;
        setPlans(data);
        setSelectedId(data[0]?.id ?? null);
      })
      .catch((e: Error) => !cancelled && setLoadError(e.message));
    return () => {
      cancelled = true;
    };
  }, []);

  // Weather notes, improvements and the weekly briefing for the selected plan.
  // Not re-run when a task is ticked, so ticking never triggers a new AI call.
  useEffect(() => {
    if (!selectedId) {
      setInsights(null);
      return;
    }
    let cancelled = false;
    setInsightsLoading(true);
    setInsightsError(null);
    getInsights(selectedId)
      .then((data) => !cancelled && setInsights(data))
      .catch((e: Error) => !cancelled && setInsightsError(e.message))
      .finally(() => !cancelled && setInsightsLoading(false));
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  // Refresh the planting window whenever the dialog's crop changes.
  useEffect(() => {
    if (!dialogOpen || !userProfile?.lat || !userProfile?.lon) return;
    let cancelled = false;
    setSeasonLoading(true);
    getSeason(crop, userProfile.lat, userProfile.lon)
      .then((data) => {
        if (cancelled) return;
        setSeason(data);
        if (!dateTouched) setPlantingDate(data.window?.start ?? todayIso);
      })
      .catch(() => !cancelled && setSeason(null))
      .finally(() => !cancelled && setSeasonLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialogOpen, crop]);

  const openDialog = () => {
    const recommended: string | undefined =
      userProfile?.recommendations?.[0]?.crop;
    setCrop(
      recommended && (PLANNER_CROPS as readonly string[]).includes(recommended)
        ? recommended
        : "maize",
    );
    setPlantingDate("");
    setDateTouched(false);
    setPlotName("");
    setSeason(null);
    setCreateError(null);
    setDialogOpen(true);
  };

  const handleCreate = async () => {
    if (!userProfile || !plantingDate) return;
    setCreating(true);
    setCreateError(null);
    try {
      const plan = await createPlan({
        crop,
        planting_date: plantingDate,
        plot_name: plotName.trim() || undefined,
        lat: userProfile.lat,
        lon: userProfile.lon,
        farm_size_ha: userProfile.farm_size_ha,
        state: userProfile.state,
        irrigation_type: userProfile.irrigation_type_used,
        features: userProfile.features_used,
        farm_health_score: userProfile.farm_health_score,
        soil_moisture: userProfile.soil_moisture,
      });
      setPlans((prev) => [plan, ...(prev ?? [])]);
      setSelectedId(plan.id);
      setDialogOpen(false);
    } catch (e) {
      setCreateError(
        e instanceof Error ? e.message : "Could not create the plan.",
      );
    } finally {
      setCreating(false);
    }
  };

  const toggleTask = useCallback(
    async (task: PlanTask) => {
      if (!selected) return;
      const next = !selected.completed[task.id];
      const apply = (value: boolean) =>
        setPlans(
          (prev) =>
            prev?.map((p) =>
              p.id === selected.id
                ? { ...p, completed: { ...p.completed, [task.id]: value } }
                : p,
            ) ?? prev,
        );
      apply(next); // optimistic
      setActionError(null);
      try {
        await setTaskCompleted(selected.id, task.id, next);
      } catch (e) {
        apply(!next);
        setActionError(
          e instanceof Error ? e.message : "Could not save that change.",
        );
      }
    },
    [selected],
  );

  const handleArchive = async () => {
    if (
      !selected ||
      !window.confirm("Remove this plan? Its tasks will be hidden.")
    )
      return;
    try {
      await archivePlan(selected.id);
      const rest = (plans ?? []).filter((p) => p.id !== selected.id);
      setPlans(rest);
      setSelectedId(rest[0]?.id ?? null);
    } catch (e) {
      setActionError(
        e instanceof Error ? e.message : "Could not remove the plan.",
      );
    }
  };

  const groups = useMemo(() => {
    if (!selected) return null;
    const done: PlanTask[] = [];
    const overdue: PlanTask[] = [];
    const week: PlanTask[] = [];
    const later: PlanTask[] = [];
    const weekEnd = toIso(new Date(Date.now() + 7 * 86400000));
    for (const t of selected.tasks) {
      if (selected.completed[t.id]) done.push(t);
      else if ((t.due_end ?? t.due) < todayIso) overdue.push(t);
      else if (t.due <= weekEnd) week.push(t);
      else later.push(t);
    }
    return { done, overdue, week, later };
  }, [selected, todayIso]);

  const renderGroup = (label: string, tasks: PlanTask[], color?: string) =>
    tasks.length > 0 && selected ? (
      <Box key={label} sx={{ mb: 3 }}>
        <Typography
          variant="overline"
          sx={{ color: color ?? "text.secondary", fontWeight: 700 }}
        >
          {label} ({tasks.length})
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
          {tasks.map((t) => (
            <TaskRow
              key={t.id}
              task={t}
              done={!!selected.completed[t.id]}
              note={insights?.weather_notes[t.id]}
              onToggle={toggleTask}
            />
          ))}
        </Box>
      </Box>
    ) : null;

  const outlook = selected?.outlook;

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
            Farm Planner
          </Typography>
          <Typography variant="body1" color="text.secondary">
            A season plan built from your soil, your rainfall and your forecast.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={openDialog}
          disabled={!userProfile}
        >
          New plan
        </Button>
      </Box>

      {loadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      )}
      {actionError && (
        <Alert
          severity="error"
          onClose={() => setActionError(null)}
          sx={{ mb: 2 }}
        >
          {actionError}
        </Alert>
      )}

      {plans === null && !loadError && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {plans !== null && plans.length === 0 && (
        <DashboardCard title="No plans yet">
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Pick a crop and a planting date and the planner will schedule land
            preparation, planting, fertilizer, weeding, pest scouting and
            harvest, using your farm's own soil data and the local rainy season.
          </Typography>
          <Button variant="contained" startIcon={<Add />} onClick={openDialog}>
            Create your first plan
          </Button>
        </DashboardCard>
      )}

      {plans !== null && plans.length > 0 && selected && groups && (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              mb: 3,
            }}
          >
            {plans.map((p) => (
              <Chip
                key={p.id}
                label={`${formatLabel(p.crop)}${p.plot_name ? ` · ${p.plot_name}` : ""}`}
                color={p.id === selectedId ? "primary" : "default"}
                variant={p.id === selectedId ? "filled" : "outlined"}
                onClick={() => setSelectedId(p.id)}
              />
            ))}
            <Tooltip title="Remove this plan">
              <IconButton size="small" onClick={handleArchive}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 8 }}>
              <Box sx={{ mb: 3 }}>
                <DashboardCard title="This week">
                  {insightsLoading && (
                    <>
                      <Skeleton width="90%" />
                      <Skeleton width="75%" />
                      <Skeleton width="60%" />
                    </>
                  )}
                  {!insightsLoading && insightsError && (
                    <Alert severity="warning">
                      Could not load this week's summary: {insightsError}
                    </Alert>
                  )}
                  {!insightsLoading && insights && (
                    <>
                      <Typography
                        variant="body1"
                        sx={{ mb: insights.briefing.priorities.length ? 2 : 0 }}
                      >
                        {insights.briefing.summary}
                      </Typography>
                      {insights.briefing.priorities.length > 0 && (
                        <Box component="ul" sx={{ m: 0, pl: 3 }}>
                          {insights.briefing.priorities.map((p) => (
                            <Typography
                              component="li"
                              variant="body2"
                              key={p}
                              sx={{ mb: 0.5 }}
                            >
                              {p}
                            </Typography>
                          ))}
                        </Box>
                      )}
                      {insights.briefing.tips.map((tip) => (
                        <Typography
                          key={tip}
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 1 }}
                        >
                          Tip: {tip}
                        </Typography>
                      ))}
                      {!insights.weather_available && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 1 }}
                        >
                          Weather notes are unavailable right now.
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", mt: 1 }}
                      >
                        {insights.briefing.source === "ai"
                          ? "Written by AI from your plan. Dates and amounts come from the plan itself."
                          : "Automatic summary of your plan."}
                      </Typography>
                    </>
                  )}
                </DashboardCard>
              </Box>

              {selected.warnings.map((w) => (
                <Alert
                  key={w.message}
                  severity={w.level === "warning" ? "warning" : "info"}
                  sx={{ mb: 2 }}
                >
                  {w.message}
                </Alert>
              ))}
              {selected.scope === "establishment_year" && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  {formatLabel(selected.crop)} is a tree crop, so this plan
                  covers establishment only. First harvest comes years later.
                </Alert>
              )}

              <DashboardCard
                title={`${formatLabel(selected.crop)} · planting ${fmt(selected.planting_date)}`}
              >
                {renderGroup("Overdue", groups.overdue, "error.main")}
                {renderGroup("Next 7 days", groups.week, "primary.main")}
                {renderGroup("Later", groups.later)}
                {renderGroup("Done", groups.done)}
                {groups.overdue.length +
                  groups.week.length +
                  groups.later.length +
                  groups.done.length ===
                  0 && (
                  <Typography variant="body2" color="text.secondary">
                    This plan has no tasks.
                  </Typography>
                )}
              </DashboardCard>
            </Grid>

            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ mb: 3 }}>
                <DashboardCard title="Rainy season">
                  {outlook?.typical_onset ? (
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                    >
                      <Typography variant="body2">
                        Usual start:{" "}
                        <strong>
                          {fmt(outlook.typical_onset, {
                            day: "numeric",
                            month: "short",
                          })}
                        </strong>
                        {outlook.onset_range && (
                          <>
                            {" "}
                            (range{" "}
                            {fmt(outlook.onset_range[0], {
                              day: "numeric",
                              month: "short",
                            })}{" "}
                            to{" "}
                            {fmt(outlook.onset_range[1], {
                              day: "numeric",
                              month: "short",
                            })}
                            )
                          </>
                        )}
                      </Typography>
                      {outlook.observed_onset_this_year && (
                        <Typography variant="body2">
                          Started this year:{" "}
                          <strong>
                            {fmt(outlook.observed_onset_this_year.date, {
                              day: "numeric",
                              month: "short",
                            })}
                          </strong>
                          {!outlook.observed_onset_this_year.confirmed &&
                            " (not yet confirmed)"}
                        </Typography>
                      )}
                      <Typography variant="body2">
                        Usual end:{" "}
                        <strong>
                          {fmt(outlook.typical_cessation, {
                            day: "numeric",
                            month: "short",
                          })}
                        </strong>
                      </Typography>
                      {selected.window && (
                        <Typography variant="body2">
                          Planting window:{" "}
                          <strong>
                            {fmt(selected.window.start, {
                              day: "numeric",
                              month: "short",
                            })}{" "}
                            to{" "}
                            {fmt(selected.window.end, {
                              day: "numeric",
                              month: "short",
                            })}
                          </strong>
                        </Typography>
                      )}
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {SOURCE_LABEL[outlook.source]}. {outlook.caveat}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Rainy-season timing could not be estimated for your
                      location.
                    </Typography>
                  )}
                </DashboardCard>
              </Box>

              <DashboardCard title="Improve your farm">
                {insightsLoading && <Skeleton variant="rounded" height={90} />}
                {!insightsLoading &&
                  insights &&
                  insights.improvements.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Nothing urgent. Your soil readings look healthy for this
                      crop.
                    </Typography>
                  )}
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {insights?.improvements.map((i) => (
                    <Paper
                      key={i.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: "action.hover",
                        borderRadius: "12px",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: 600 }}
                        >
                          {i.title}
                        </Typography>
                        <Chip
                          label={i.priority}
                          size="small"
                          color={PRIORITY_COLOR[i.priority]}
                          variant="outlined"
                        />
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {i.why}
                      </Typography>
                      <Typography variant="body2">{i.action}</Typography>
                    </Paper>
                  ))}
                </Box>
              </DashboardCard>
            </Grid>
          </Grid>
        </>
      )}

      <Dialog
        open={dialogOpen}
        onClose={() => !creating && setDialogOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>New farm plan</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mt: 1 }}>
            <TextField
              select
              label="Crop"
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
            >
              {PLANNER_CROPS.map((c) => (
                <MenuItem key={c} value={c}>
                  {formatLabel(c)}
                </MenuItem>
              ))}
            </TextField>

            <Box>
              {seasonLoading && <Skeleton width="80%" />}
              {!seasonLoading && season?.window && (
                <Alert severity="success">
                  Best planting window for {formatLabel(crop)} here:{" "}
                  <strong>
                    {fmt(season.window.start, {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    to{" "}
                    {fmt(season.window.end, { day: "numeric", month: "short" })}
                  </strong>{" "}
                  (from the {season.window.anchor_type} start of the rains on{" "}
                  {fmt(season.window.anchor, {
                    day: "numeric",
                    month: "short",
                  })}
                  ).
                </Alert>
              )}
              {!seasonLoading && season && !season.window && (
                <Alert severity="info">
                  Rainfall timing is unavailable for your location, so the date
                  can't be checked against the rains.
                </Alert>
              )}
            </Box>

            <TextField
              label="Planting date"
              type="date"
              value={plantingDate}
              onChange={(e) => {
                setPlantingDate(e.target.value);
                setDateTouched(true);
              }}
              slotProps={{ inputLabel: { shrink: true } }}
              helperText="You can plan a date outside the window; the plan will flag any risk."
            />
            <TextField
              label="Plot name (optional)"
              value={plotName}
              onChange={(e) => setPlotName(e.target.value)}
              placeholder="e.g. North field"
            />
            {createError && <Alert severity="error">{createError}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={creating}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={creating || !plantingDate}
            startIcon={
              creating ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
          >
            {creating ? "Building plan..." : "Create plan"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FarmPlanner;
