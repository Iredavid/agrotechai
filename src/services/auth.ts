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

    // return userCredential.user;
  } catch (error) {
    throw error;
  }
}

export async function signIn({ email, password }: any) {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
    })
    .catch((error) => {
      throw error;
    });
}







// const response = await fetch("http://127.0.0.1:8000/register", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     ...formData,
//   }),
// });
// const data = await response.json();

// if (!response.ok) {
//   throw new Error(
//     typeof data.detail === "string" ? data.detail : "Registration failed",
//   );
// }

// return data;
