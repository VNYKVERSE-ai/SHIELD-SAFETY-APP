# SHIELD Android Upgrade (starter)

This is a native Android wrapper around the existing SHIELD web interface. It keeps the current UI and adds an Android bridge for user-initiated SOS SMS.

## Important safety and release notes
- SMS sending uses Android's SEND_SMS permission and may be restricted by Google Play policy. This starter is intended for controlled testing and sideloaded development builds, not a production/public safety release.
- The SOS action must be initiated by the user. Android permission approval is required. SMS submission does not prove delivery; delivery depends on an active SIM, carrier service, signal, plan/balance, and recipient availability.
- The app does not silently send SOS messages in the background.
- Do not test by sending emergency messages to real contacts or calling 112. Use your own test number with consent.
- Location in the existing UI uses browser geolocation inside WebView. Background tracking is not implemented.
- No iOS build is included.

## Build APK using GitHub Actions
1. Upload the contents of this folder into the root of your existing `SHIELD-SAFETY-APP` repository, merging folders when prompted.
2. Open the repository's **Actions** tab.
3. Select **Build SHIELD Android APK** and tap **Run workflow** (or wait for the push build).
4. When complete, open the workflow run, scroll to **Artifacts**, and download `SHIELD-debug-apk`.
5. Extract the artifact ZIP and install `app-debug.apk` on your Android phone. Android may ask permission to install from that source.

This is a debug APK. A signed release build, privacy review, security testing, and Google Play policy review are still required before public distribution.
