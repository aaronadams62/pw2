import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env manually
const envPath = resolve(__dirname, '../.env');
const envContent = readFileSync(envPath, 'utf-8');
const env = Object.fromEntries(
  envContent.split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.split('=').map(s => s.trim()))
    .filter(([k]) => k)
);

const firebaseConfig = {
  apiKey: env.REACT_APP_FIREBASE_API_KEY,
  authDomain: env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const q = query(collection(db, 'projects'), orderBy('created_at', 'desc'));
const snap = await getDocs(q);

if (snap.empty) {
  console.log('No projects found in Firestore.');
} else {
  console.log(`Found ${snap.size} project(s):\n`);
  snap.forEach(doc => {
    const d = doc.data();
    console.log(`ID: ${doc.id}`);
    console.log(`  title:       ${d.title}`);
    console.log(`  description: ${d.description}`);
    console.log(`  live_url:    ${d.live_url}`);
    console.log(`  image_url:   ${d.image_url}`);
    console.log(`  category:    ${d.category}`);
    console.log(`  tech:        ${JSON.stringify(d.tech ?? [])}`);
    console.log('');
  });
}

process.exit(0);
