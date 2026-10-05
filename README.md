# India 2027 – The Blue Army Squad Lab (desktop app: Windows, Mac, Linux)

This repo builds the desktop installers with GitHub Actions. Nothing to install on your own computer.

## Get the installers
1. Push this project to the `main` branch (or open the **Actions** tab → **Build Desktop App** → **Run workflow**).
2. When the run is green, open the repo's **Releases** page → **Desktop apps (latest)**.
   - Windows: `.exe` (installer and portable)
   - Mac: `.dmg` and `.zip`
   - Linux: `.AppImage` and `.deb`
   (The same files are also under each run's **Artifacts**.)

The first step of the build checks that no source file is missing from the repo and names the missing file if one is.

## Run it on your own computer (optional)
```
npm install
npm run dev
```

## Notes
- Mac and Windows installers are not code-signed, so the first launch shows a security warning: Windows "More info → Run anyway"; Mac right-click the app → Open.
- Submit opens your email app or Gmail in the browser with the written email to the BCCI. The user presses Send.
- Squads are stored on the device. The shared-database sign-in feature only works if `src/config.js` holds your own Supabase URL and publishable key; otherwise the app runs in local mode.
