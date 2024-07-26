import { getApps, initializeApp } from "firebase/app";
import { Auth, connectAuthEmulator, getAuth } from "firebase/auth";
import { env } from "process";

const currentApps = getApps();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let auth: Auth | undefined = undefined;

if (currentApps.length <= 0) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  if (
    process.env.NEXT_PUBLIC_APP_ENV === "emulator" &&
    process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH
  ) {
    connectAuthEmulator(auth, `http://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`);
  }
} else {
  auth = getAuth(currentApps[0]);

  if (
    process.env.NEXT_PUBLIC_APP_ENV === "emulator" &&
    process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH
  ) {
    connectAuthEmulator(auth, `http://${process.env.NEXT_PUBLIC_EMULATOR_AUTH_PATH}`);
  }
}

export { auth };
