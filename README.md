# PWV2 Portfolio

React portfolio application with an admin dashboard, now running on a Firebase-native stack (Firestore + Firebase Auth, with Hosting support).

## Local Development

```powershell
npm install
npm start
```

Build/test:

```powershell
npm test
npm run build
```

## Firebase Hosting (Phase 1)

This repository now includes Firebase Hosting scaffolding:

- `firebase.json` with SPA rewrites (`** -> /index.html`)
- `.firebaserc` with a default project placeholder
- `.firebaseignore` deployment ignore rules

### One-Time Setup

1. Create a Firebase project in the Firebase Console.
2. Update `.firebaserc`:
   - Replace `replace-with-your-firebase-project-id` with your real project id.
3. Authenticate CLI:
   ```powershell
   npm run firebase:login
   ```
4. Link the local repo to your Firebase project (optional if `.firebaserc` is already correct):
   ```powershell
   npm run firebase:use
   ```

### Deploy Hosting

```powershell
npm run firebase:deploy:hosting
```

### Run Hosting Emulator

```powershell
npm run firebase:serve:hosting
```

## Firebase Data/Auth (Phases 2-5)

Phase 2 (Firestore project CRUD) and Phase 4 (Firebase Auth admin login/session) are implemented.
Phase 5 cutover is complete: runtime app flows no longer depend on Express/PostgreSQL endpoints.

Phase 3 and 4 prerequisites in Firebase Console:

1. Enable Firebase Storage:
   - Console -> Build -> Storage -> Get Started
2. Enable Firebase Auth Email/Password:
   - Console -> Build -> Authentication -> Sign-in method -> Email/Password -> Enable

After enabling those, deploy rules:

```powershell
npx firebase-tools deploy --only firestore:rules,storage --project pwv2-e495e --config firebase.json
```

## Environment Variables

Copy from `.env.example` and set values in `.env`.

Firebase placeholders have been added for migration phases:

- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`

Legacy Express/PostgreSQL environment variables are no longer required for normal app runtime.

## Migration Tracking

- Epic: https://github.com/aaronadams62/pw2/issues/76
- Phase 1 (this setup): https://github.com/aaronadams62/pw2/issues/75
