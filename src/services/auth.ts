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
    case "auth/user-not-found":
      return "No account found with this email address.";

    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";

    case "auth/invalid-email":
      return "Please enter a valid email address.";

    case "auth/user-disabled":
      return "This account has been disabled. Please contact support.";

    case "auth/too-many-requests":
      return "Too many failed attempts. Please try again later.";

    case "auth/email-already-in-use":
      return "This email address is already registered.";

    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";

    case "auth/network-request-failed":
      return "Network error. Please check your internet connection.";

    case "auth/requires-recent-login":
      return "Please sign in again to perform this operation.";

    default:
      return "Unable to sign in. Please check your credentials and try again.";
  }
}
