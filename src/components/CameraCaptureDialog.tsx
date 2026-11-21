import React, { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CameraAlt from '@mui/icons-material/CameraAlt';

interface Props {
  open: boolean;
  onClose: () => void;
  onCapture: (photo: Blob) => void;
}

function cameraErrorMessage(e: unknown): string {
  const name = e instanceof DOMException ? e.name : '';
  if (name === 'NotAllowedError') return 'Camera permission was denied. Allow camera access in your browser settings, or use Upload Image instead.';
  if (name === 'NotFoundError') return 'No camera was found on this device. Use Upload Image instead.';
  if (name === 'NotReadableError') return 'The camera is being used by another app. Close it and try again.';
  return 'Could not start the camera. Use Upload Image instead.';
}

const CameraCaptureDialog: React.FC<Props> = ({ open, onClose, onCapture }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  // Callback-ref state: the dialog content mounts a tick after `open` flips, so a plain ref can still be null.
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let acquired: MediaStream | null = null;
    setError(null);
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        acquired = s;
        setStream(s);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(cameraErrorMessage(e));
      });
    return () => {
      cancelled = true;
      acquired?.getTracks().forEach((t) => t.stop());
      setStream(null);
    };
  }, [open]);

  useEffect(() => {
    if (video && stream) {
      video.srcObject = stream;
      video.play().catch(() => undefined);
    }
  }, [video, stream]);

  const capture = () => {
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCapture(blob);
          onClose();
        }
      },
      'image/jpeg',
      0.9,
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Take a photo</DialogTitle>
      <DialogContent>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box sx={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', bgcolor: 'common.black', minHeight: 220 }}>
            <video ref={setVideo} playsInline muted style={{ width: '100%', display: 'block' }} />
            {!stream && (
              <Box sx={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                <CircularProgress size={28} />
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" startIcon={<CameraAlt />} onClick={capture} disabled={!stream || !!error}>
          Capture
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CameraCaptureDialog;
