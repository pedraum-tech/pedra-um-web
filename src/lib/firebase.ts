import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Puxando as chaves do seu arquivo .env.local
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// O Next.js roda no servidor e no cliente. 
// Isso garante que o Firebase não tente inicializar duas vezes e cause erros.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Exportando os serviços que vamos usar
const auth = getAuth(app);
const db = getFirestore(app);

// Inicialize o Storage aqui
const storage = getStorage(app);

// 3. Não esqueça de exportar o storage junto com os outros!
export { app, auth, db, storage };