import { auth } from './firebase'; // adjust if your firebase.ts exports the auth instance under another name

// TODO: use the same base-URL env var as services/dashboard.ts
const API_BASE: string = import.meta.env.VITE_API_BASE_URL ?? '';

/**
 * Sends the signed-in user's Firebase ID token so the backend can tell who is calling.
 * getIdToken() refreshes an expired token automatically. Do not set Content-Type here:
 * for file uploads the browser must add the multipart boundary itself.
 */
async function authHeaders(): Promise<Record<string, string>> {
  const token = await auth.currentUser?.getIdToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const CROPS = [
  { value: 'maize', label: 'Maize' },
  { value: 'rice', label: 'Rice' },
  { value: 'cassava', label: 'Cassava' },
  { value: 'cocoa', label: 'Cocoa' },
  { value: 'sorghum', label: 'Sorghum' },
  { value: 'millet', label: 'Millet' },
  { value: 'yam', label: 'Yam' },
  { value: 'oil_palm', label: 'Oil palm' },
] as const;

// Crops our own trained model covers (keep in sync with IMAGE_MODEL_CROPS in pest_service.py).
// Photos of any other crop are still accepted, but are answered by the external service instead.
const LOCAL_MODEL_CROPS: string[] = ['cassava', 'maize', 'rice', 'cocoa'];
export const hasLocalModel = (crop: string): boolean => LOCAL_MODEL_CROPS.includes(crop);

export interface PestReference {
  crop: string;
  pest_disease: string;
  sample_size: number;
  avg_yield_loss_pct: number;
  recommended_treatment: string | null;
  severity_distribution: Record<string, number>;
  data_caveat: string;
}

export interface TreatmentInfo {
  biological?: string | string[];
  chemical?: string | string[];
  prevention?: string | string[];
}

export interface DetectResult {
  source: 'local_model' | 'external_api';
  crop: string | null;
  disease: string;
  model_label: string | null;
  confidence: number;
  reference: PestReference | null;
  treatment?: TreatmentInfo | null; // present once the backend passes treatment text through
  identified_crop?: string | null; // external service only: the crop it believes is in the photo
  crop_match?: boolean | null; // external service only: does that match the crop the user selected?
}

export interface SymptomOptions {
  crop: string;
  data_backed_options?: string[];
  general_guidance_options?: string[];
  options?: string[];
  note?: string;
}

export type Advisory =
  | ({ tier: 'data_backed' } & PestReference)
  | {
      tier: 'general_guidance';
      crop: string;
      pest_disease: string;
      description: string;
      general_guidance: string;
      disclaimer: string;
    }
  | { tier: 'not_found'; crop: string; pest_disease: string; note: string };

export interface Threat {
  pest: string;
  level: 'high' | 'medium' | 'low';
  message: string;
  source: string;
}

async function parse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body?.detail === 'string') msg = body.detail;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(msg);
  }
  return (await res.json()) as T;
}

export async function detectPest(crop: string, image: File): Promise<DetectResult> {
  const form = new FormData();
  form.append('crop', crop);
  form.append('image', image);
  const res = await fetch(`${API_BASE}/pest/detect`, {
    method: 'POST',
    headers: await authHeaders(),
    body: form,
  });
  return parse<DetectResult>(res);
}

export async function getSymptomOptions(crop: string): Promise<SymptomOptions> {
  const res = await fetch(`${API_BASE}/pest/symptom-options/${encodeURIComponent(crop)}`, {
    headers: await authHeaders(),
  });
  return parse<SymptomOptions>(res);
}

export async function getSymptomAdvisory(crop: string, pest: string): Promise<Advisory> {
  const res = await fetch(
    `${API_BASE}/pest/symptom-advisory/${encodeURIComponent(crop)}/${encodeURIComponent(pest)}`,
    { headers: await authHeaders() },
  );
  return parse<Advisory>(res);
}

// Outbreak alerts. No backend source exists yet, so any failure (including 404) means "no alerts".
export async function getThreats(): Promise<Threat[]> {
  try {
    const res = await fetch(`${API_BASE}/pest/threats`, { headers: await authHeaders() });
    if (!res.ok) return [];
    return (await res.json()) as Threat[];
  } catch {
    return [];
  }
}

function drawScaled(bitmap: ImageBitmap, side: number, quality: number): Promise<{ blob: Blob; url: string }> {
  const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.reject(new Error('Image processing is not supported in this browser.'));
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const url = canvas.toDataURL('image/jpeg', quality);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve({ blob: b, url }) : reject(new Error('Could not process the image.'))),
      'image/jpeg',
      quality,
    ),
  );
}

/**
 * Downscale and re-encode to JPEG before upload. Phone photos are 3-8 MB and the
 * model only sees 224x224, so this saves mobile data. It also applies EXIF rotation.
 */
export async function prepareImage(file: Blob, maxSide = 1024): Promise<{ file: File; thumb: string }> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new Error('This image format is not supported. Please use a JPG or PNG photo.');
  }
  try {
    const full = await drawScaled(bitmap, maxSide, 0.85);
    const thumb = await drawScaled(bitmap, 96, 0.6);
    return { file: new File([full.blob], 'scan.jpg', { type: 'image/jpeg' }), thumb: thumb.url };
  } finally {
    bitmap.close();
  }
}