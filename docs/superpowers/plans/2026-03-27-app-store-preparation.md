# App Store Preparation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare nihonGO for App Store publication with a hosted privacy policy, Sentry crash reporting, and updated App Store config.

**Architecture:** GitHub Pages serves a static privacy policy from the `docs/` folder. Sentry SDK initializes at app startup in the root layout. App Store metadata references the privacy URL.

**Tech Stack:** `@sentry/react-native` with Expo plugin, static HTML for privacy page, EAS Submit config.

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `docs/privacy.html` | Create | Privacy policy page served via GitHub Pages |
| `docs/index.html` | Create | Redirect to privacy page (GitHub Pages landing) |
| `app/_layout.tsx` | Modify | Initialize Sentry at app startup |
| `app.json` | Modify | Add Sentry plugin, privacy URL |
| `eas.json` | Modify | No changes needed now — credentials filled in by user later |
| `package.json` | Modify | New dependency added via npm install |
| `.env.example` | Create | Document required environment variables |

---

### Task 1: Privacy Policy Page

**Files:**
- Create: `docs/privacy.html`
- Create: `docs/index.html`

- [ ] **Step 1: Create the privacy policy HTML page**

Create `docs/privacy.html` with the following content:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>nihonGO — Privacy Policy</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            max-width: 720px;
            margin: 0 auto;
            padding: 2rem 1.5rem;
            background: #fafafa;
        }
        h1 { font-size: 1.75rem; margin-bottom: 0.25rem; }
        .subtitle { color: #666; margin-bottom: 2rem; font-size: 0.95rem; }
        h2 { font-size: 1.15rem; margin-top: 1.75rem; margin-bottom: 0.5rem; }
        p, li { font-size: 0.95rem; margin-bottom: 0.75rem; }
        ul { padding-left: 1.25rem; }
        a { color: #2563eb; }
        .footer { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid #e5e5e5; color: #666; font-size: 0.85rem; }
    </style>
</head>
<body>
    <h1>nihonGO Privacy Policy</h1>
    <p class="subtitle">Last updated: March 27, 2026</p>

    <h2>Overview</h2>
    <p>nihonGO is a Japanese language learning app. We respect your privacy and are committed to being transparent about what data the app uses and how it is handled.</p>

    <h2>Data Stored on Your Device</h2>
    <p>The following data is stored locally on your device and is never transmitted to our servers:</p>
    <ul>
        <li>Your learner profile (native language, proficiency level, learning goals)</li>
        <li>Lesson progress and quiz results</li>
        <li>App preferences and settings</li>
    </ul>
    <p>This data is deleted when you uninstall the app. nihonGO does not require a user account.</p>

    <h2>AI-Powered Features</h2>
    <p>nihonGO offers AI-powered tutoring through your choice of provider:</p>
    <ul>
        <li><strong>On-device providers</strong> (Apple Intelligence, Ollama): All processing happens on your device. No conversation data leaves your device.</li>
        <li><strong>Cloud providers</strong> (Claude API): Chat messages are sent to the provider's servers to generate responses. These messages are subject to the provider's own privacy policy. nihonGO does not store or log your conversations on any server.</li>
    </ul>

    <h2>Microphone</h2>
    <p>nihonGO may request microphone access for Japanese pronunciation practice. Audio is processed on-device using the system's speech recognition. Audio is not recorded, stored, or transmitted.</p>

    <h2>Crash Reporting &amp; Analytics</h2>
    <p>nihonGO uses <a href="https://sentry.io/privacy/">Sentry</a> to collect anonymous crash reports and performance data. This includes:</p>
    <ul>
        <li>Device type and operating system version</li>
        <li>App version</li>
        <li>Crash stack traces and error messages</li>
        <li>Performance metrics (screen load times)</li>
    </ul>
    <p>No personally identifiable information is collected. No chat content, profile data, or audio is included in crash reports.</p>

    <h2>Third Parties</h2>
    <p>nihonGO does not sell, share, or transfer your data to third parties for advertising or marketing purposes.</p>

    <h2>Children's Privacy</h2>
    <p>nihonGO does not knowingly collect personal information from children under 13.</p>

    <h2>Changes to This Policy</h2>
    <p>We may update this policy from time to time. Changes will be posted on this page with an updated date.</p>

    <h2>Contact</h2>
    <p>For privacy questions or concerns, contact us at: <a href="mailto:privacy@nihongo-app.com">privacy@nihongo-app.com</a></p>

    <div class="footer">
        <p>&copy; 2026 nihonGO. All rights reserved.</p>
    </div>
</body>
</html>
```

- [ ] **Step 2: Create an index redirect**

Create `docs/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=privacy.html">
    <title>nihonGO</title>
</head>
<body>
    <p>Redirecting to <a href="privacy.html">Privacy Policy</a>...</p>
</body>
</html>
```

- [ ] **Step 3: Commit the privacy policy**

```bash
git add docs/privacy.html docs/index.html
git commit -m "feat: add privacy policy page for GitHub Pages"
```

---

### Task 2: Install and Configure Sentry

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `app.json:43-46` (plugins array)
- Create: `.env.example`

- [ ] **Step 1: Install Sentry**

```bash
npx expo install @sentry/react-native
```

This installs `@sentry/react-native` with the correct version for the current Expo SDK.

- [ ] **Step 2: Add Sentry plugin to app.json**

Update the `plugins` array in `app.json`:

```json
"plugins": [
    "expo-router",
    "expo-secure-store",
    [
        "@sentry/react-native/expo",
        {
            "organization": "nihongo",
            "project": "nihongo-mobile"
        }
    ]
]
```

The `organization` and `project` values are placeholders — the user updates them after creating a Sentry project. The Expo plugin handles native setup (iOS source maps, symbolication).

- [ ] **Step 3: Create .env.example**

Create `.env.example` documenting required environment variables:

```
# AI Provider (required for Claude chat)
EXPO_PUBLIC_CLAUDE_API_KEY=your_claude_api_key

# Sentry (required for crash reporting in production)
EXPO_PUBLIC_SENTRY_DSN=your_sentry_dsn_here
```

- [ ] **Step 4: Commit Sentry installation**

```bash
git add package.json package-lock.json app.json .env.example
git commit -m "feat: install and configure @sentry/react-native"
```

---

### Task 3: Initialize Sentry in App Layout

**Files:**
- Modify: `app/_layout.tsx:1-22` (imports), `app/_layout.tsx:36-74` (RootLayout function), `app/_layout.tsx:115-131` (RootLayoutNav return)

- [ ] **Step 1: Add Sentry import and initialization to app/_layout.tsx**

Add at the top of the file, after the existing imports:

```typescript
import * as Sentry from '@sentry/react-native';
```

Add Sentry initialization before the `SplashScreen.preventAutoHideAsync()` call:

```typescript
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  enabled: !__DEV__,
  tracesSampleRate: 0.2,
  enableAutoSessionTracking: true,
});
```

- [ ] **Step 2: Wrap the exported RootLayout with Sentry**

Change the default export at the bottom of `RootLayout`:

Before:
```typescript
export default function RootLayout() {
```

After — rename the function and wrap the export:

```typescript
function RootLayout() {
  // ... existing code unchanged ...
}

export default Sentry.wrap(RootLayout);
```

- [ ] **Step 3: Verify the app starts without errors**

```bash
npx expo start --ios
```

Sentry is disabled in dev (`enabled: !__DEV__`), so this should start normally. Verify no import errors or crashes.

- [ ] **Step 4: Commit Sentry initialization**

```bash
git add app/_layout.tsx
git commit -m "feat: initialize Sentry in root layout"
```

---

### Task 4: Update App Store Configuration

**Files:**
- Modify: `app.json:17-28` (ios section)

- [ ] **Step 1: Add privacy URL to app.json ios section**

Add `privacyUrl` inside the `expo` object (top level, not nested under `ios`):

```json
"privacyUrl": "https://jumbomochi.github.io/nihonGO/privacy"
```

This tells the App Store where to find the privacy policy.

- [ ] **Step 2: Verify app.json is valid**

```bash
npx expo config --type public
```

Should output the resolved config without errors.

- [ ] **Step 3: Commit App Store config**

```bash
git add app.json
git commit -m "feat: add privacy URL to App Store configuration"
```

---

### Task 5: Enable GitHub Pages

This is a manual step — cannot be automated via code.

- [ ] **Step 1: Enable GitHub Pages in repo settings**

1. Go to `https://github.com/jumbomochi/nihonGO/settings/pages`
2. Under "Source", select **Deploy from a branch**
3. Set branch to `master`, folder to `/docs`
4. Click Save

- [ ] **Step 2: Verify the privacy page is live**

After a few minutes, visit: `https://jumbomochi.github.io/nihonGO/privacy`

Confirm the privacy policy renders correctly.

---

### Task 6: Create Sentry Project (Manual)

This is a manual step — requires Sentry account setup.

- [ ] **Step 1: Create a Sentry project**

1. Go to [sentry.io](https://sentry.io) and create an account (or log in)
2. Create a new project — platform: **React Native**
3. Name it `nihongo-mobile`
4. Copy the DSN from Project Settings > Client Keys

- [ ] **Step 2: Set the DSN environment variable**

Add to your local `.env` file:

```
EXPO_PUBLIC_SENTRY_DSN=https://your-dsn@sentry.io/your-project-id
```

- [ ] **Step 3: Update Sentry plugin config in app.json**

Replace the placeholder `organization` and `project` values with your actual Sentry org and project slugs.

- [ ] **Step 4: Test crash reporting with a production build**

```bash
eas build --platform ios --profile preview
```

After installing the preview build, trigger a test error to verify Sentry captures it.
