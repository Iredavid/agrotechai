import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "./firebase";

export async function register({
  email,
  password,
  fullName,
}: {
  email: string;
  password: string;
  fullName: string;
}) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    await updateProfile(userCredential.user, {
      displayName: fullName,
    });
  } catch (error) {
    throw error;
  }
}

export async function signIn({ email, password }: any) {
  return signInWithEmailAndPassword(auth, email, password)
    .then()
    .catch((error) => {
      throw error;
    });
}

export async function updateUser(fullName: string, userId: string) {
  try {
    await fetch(`${import.meta.env.VITE_API_BASE_URL}/updateUser`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        userId: userId,
      }),
    });
  } catch (err) {
    throw err;
  }
}

export function mapFirebaseAccountError(code?: string): string {
  switch (code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Current password is incorrect.";
    case "auth/requires-recent-login":
      return "For security, please re-enter your current password and try again.";
    case "auth/email-already-in-use":
      return "That email address is already in use by another account.";
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/weak-password":
      return "New password is too weak -- use at least 6 characters.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
    default:
      return "Something went wrong updating your account. Please try again.";
  }
}
