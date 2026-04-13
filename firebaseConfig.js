import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD_HsyNZAQ1AJzFYmLk3OejhsOT1woGiqw",
  authDomain: "discord-code-formatter.firebaseapp.com",
  projectId: "discord-code-formatter",
  storageBucket: "discord-code-formatter.firebasestorage.app",
  messagingSenderId: "108883138557",
  appId: "1:108883138557:web:2512b9bc6998bbc95c2b94",
  measurementId: "G-QZ94YHBB4C"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);