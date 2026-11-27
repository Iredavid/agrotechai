import { useEffect, useState } from "react";
import { Alert, Box, Typography } from "@mui/material";

export type WeatherAdvisory = {
  status: "caution" | "no_major_concern" | "unavailable";
  title: string;
  summary: string;
  reasons: { type: string; timestamp: number; message: string }[];
  generated_at: string;
  window_start: number;
  window_end: number;
  timezone_offset_seconds: number;
  location: string;
  disclaimer: string;
};

type Props = {
  advisory?: WeatherAdvisory | null;
  loading: boolean;
  error?: string | null;
};

// Format in the farm's forecast timezone, not the viewer's phone timezone.
function farmTime(timestamp: number, offset: number): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit", timeZone: "UTC",
  }).format(new Date((timestamp + offset) * 1000));
}

export default function WeatherAdvisoryNote({ advisory, loading, error }: Props) {
  const [clock, setClock] = useState(Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setClock(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  if (loading) return <Alert severity="info">Loading forecast-based spraying guidance…</Alert>;
  const generated = advisory ? Date.parse(advisory.generated_at) : NaN;
  const stale = !Number.isFinite(generated) || clock - generated > 3 * 60 * 60 * 1000;
  if (error || !advisory || stale) {
    return (
      <Alert severity="info">
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Spraying guidance unavailable</Typography>
        <Typography variant="body2">
          {error || (advisory && stale ? "This guidance is out of date. Refresh the forecast before planning spraying." : "No advisory is available yet.")}
        </Typography>
        <Typography variant="body2">Check local conditions and follow the product label.</Typography>
      </Alert>
    );
  }
  const offset = advisory.timezone_offset_seconds;
  return (
    <Alert severity={advisory.status === "caution" ? "warning" : "info"} sx={{ borderRadius: "16px" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>{advisory.title}</Typography>
      <Typography variant="body2">{advisory.summary}</Typography>
      {advisory.reasons.length > 0 && (
        <Box component="ul" sx={{ pl: 2.5, my: 1.5 }}>
          {advisory.reasons.map((reason) => (
            <li key={reason.type}>
              <Typography variant="body2">
                <strong>{farmTime(reason.timestamp, offset)}: </strong>{reason.message}
              </Typography>
            </li>
          ))}
        </Box>
      )}
      <Typography variant="caption" component="p" sx={{ mt: 1.5 }}>
        {advisory.location} · Next 24 hours · Farm local time
      </Typography>
      <Typography variant="caption" component="p">
        Guidance generated: {farmTime(generated / 1000, offset)}
      </Typography>
      <Typography variant="caption" component="p" sx={{ mt: 1 }}>{advisory.disclaimer}</Typography>
    </Alert>
  );
}
