## Repo snapshot for AI coding agents

This file gives focused, actionable details to help an AI agent be productive in this repository.

### Big-picture architecture
- Frontend: Create React App using `react-scripts` (web) with `react-native` / `react-native-web` components used in many UI files (e.g. `src/App.js`). The app also targets mobile via Capacitor (native projects in `android/` and `ios/`).
- Native mobile integration: Capacitor is used for push notifications and native builds (`@capacitor/core`, `@capacitor/android`, `@capacitor/ios`, `@capacitor/push-notifications`). The native projects live in `android/` and `ios/` and are updated via Capacitor sync commands.
- Notification subsystem: Uses Novu Headless SDK (`@novu/headless`) via `src/context/novuNotifications.js` (provides `NotificationProvider` and `useNotification`). Push token handling is in `src/App.js` and notifications are cached in AsyncStorage.
- Server integrations: Backend API endpoints are hard-coded in `src/api.js` and `src/App.js` (e.g. `https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com`). `src/api.js` exposes `chatWithAI` and `searchPolicy` wrappers.

### Key files to reference
- `package.json` — dependencies and npm scripts (`start`, `build`, `test`).
- `src/App.js` — main app UI, AsyncStorage user lifecycle, Capacitor PushNotifications registration, `NotificationProvider` usage, and push token registration logic.
- `src/context/novuNotifications.js` — Novu integration and pager logic (fetchPageNotifications / fetchAllNotifications). Important: pagination and deduplication logic accumulates into `allFetchedNotifications` and filters by a hard-coded date.
- `src/api.js` — chat and search client; uses axios and a fixed API base URL.
- `src/appNavigation.js` and `src/index.js` — app entry and navigation wiring.

### Developer workflows / commands
- Web development (dev server): `npm start` — runs CRA dev server on `http://localhost:3000`.
- Build web assets: `npm run build` — produces `build/` for deployment and for Capacitor asset sync.
- Tests: `npm test` — CRA test runner.
- Capacitor mobile flow (not scripted in package.json):
  - After `npm run build`, run `npx cap sync` to copy web assets into native projects.
  - Android: `npx cap open android` (or use `android/gradlew` wrapper: `cd android && ./gradlew assembleDebug` on Unix, run `gradlew.bat` on Windows).
  - iOS: `npx cap open ios` (requires macOS / Xcode).

Include these examples in code edits when modifying native behavior or notification setup.

### Project-specific patterns & conventions
- Hybrid RN-web pattern: Components often use `react-native` primitives (`View`, `Text`, `Modal`) together with plain DOM elements (e.g. `div` in `src/App.js`). Keep changes compatible with `react-native-web`.
- AsyncStorage keys: `userId`, `userFirstName`, `userLastName`, `notifications_${userId}` — use these exact keys when reading/writing persisted user data.
- Notification provider usage: Wrap relevant UI with `<NotificationProvider applicationIdentifier="<id>" subscriberId={subscriberId}>` and call `useNotification()` to access functions like `fetchAllNotifications`, `markNotificationsAsRead`.
- Pagination / dedupe: Novu code accumulates pages into `allFetchedNotifications` then deduplicates using `Map` keyed by `notif.id` in `novuNotifications.js`.

### Integration points & external dependencies
- External API: `https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com` — used from `src/api.js` and for token registration (`src/App.js`). Edits that change endpoints should update these files.
- Push notifications: Capacitor PushNotifications listeners are registered in `src/App.js`. On mobile platforms, token registration calls `POST /api/register_token`.
- Novu Headless: `@novu/headless` is used to fetch, read, and delete notifications. Initialization occurs in `novuNotifications.js` (note `initializeSession` usage and the `applicationIdentifier` prop passed from callers).

### Known code smells & gotchas to watch for (discoverable, not prescriptive)
- Hard-coded dates / IDs: `novuNotifications.js` filters notifications against a fixed date `new Date('2024-07-28T00:00:00.000Z')` — this affects which notifications are visible.
- Hard-coded backend URL (in `src/api.js`) and token-registration URL in `src/App.js`. If moving environments, update both.
- Mixed DOM + RN primitives: Be careful when editing markup — some components assume web DOM availability (e.g. `div` usage inside `View`) while others target mobile.

### Example edits & references (copy-paste friendly)
- Register token (from `src/App.js`):
  - URL: `https://rtut-app-admin-server-c2d4ae9d37ae.herokuapp.com/api/register_token`
  - Payload: `{ token: <pushToken>, user: { userFirstName, userLastName } }`
- Chat call (from `src/api.js`): `axios.post('${API_BASE_URL}/chat', { query: question })`

### What to do if you need to run mobile features locally
- For Android on Windows:
  1. `npm run build`
  2. `npx cap sync android`
  3. `npx cap open android` (opens Android Studio) or `cd android && gradlew.bat assembleDebug`

### If you update behavior that affects state shape
- Update AsyncStorage key usages across `src/*` and search for `getItem('userId')` or `notifications_` to ensure consistent reads/writes.

---
If any of these areas need more detail or you'd like me to include quick-start snippets for debugging (for example, how to reproduce push notifications locally or a small unit test for `novuNotifications`), tell me which part and I'll expand. 
