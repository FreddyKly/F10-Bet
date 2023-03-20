import { initializeApp } from 'firebase/app'
import { getFirestore } from "firebase/firestore";

const config = {
  apiKey: "AIzaSyDEio8FzX7XjhHSXWw6vLAiTHhz-xiqDHE",
  authDomain: "f10-bet.firebaseapp.com",
  projectId: "f10-bet",
  storageBucket: "f10-bet.appspot.com",
  messagingSenderId: "621741209196",
  appId: "1:621741209196:web:30a6e5ac091774c0a0ca49"
};

const app = initializeApp(config);
const db = getFirestore(app);

export {
  db
}