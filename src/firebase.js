import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCQpjNVTNve64hhbTClg5CVBsdnU8EyxLg",
  authDomain: "casa-cielo.firebaseapp.com",
  databaseURL: "https://casa-cielo-default-rtdb.firebaseio.com",
  projectId: "casa-cielo",
  storageBucket: "casa-cielo.firebasestorage.app",
  messagingSenderId: "363754880564",
  appId: "1:363754880564:web:29940b7799e4a405201461"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);