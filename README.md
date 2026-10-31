# SHIELD — Women's Safety & Safer Mobility Prototype

This is a phone-friendly, installable Progressive Web App (PWA) prototype built with HTML, CSS and JavaScript.

## Included
- Responsive SHIELD dashboard
- SOS preparation workflow (no automatic message sending)
- Browser geolocation request and coordinates display
- Trusted contacts stored locally on the device
- SMS draft handoff for the first saved contact
- 112 phone-call link (user must confirm in dialer)
- Safe Journey local check-in timer
- Local incident history
- Offline caching after the first successful load

## Important safety limitations
- This prototype is not an emergency-response service and is not certified for real-world safety use.
- GPS may work without mobile internet, but requires device location services and browser permission.
- A remote alert cannot be delivered when no communication channel exists.
- SMS opens the messaging app with a draft; the user must review and send it. Delivery is not confirmed.
- The PWA does not provide dependable background tracking, automatic SMS, or Bluetooth mesh networking.
- The journey timer is local and does not send an alert when it expires.
- Do not rely on this prototype as the only way to seek help. In India, use official emergency services such as 112 when needed.

## Run / host
A PWA requires HTTPS (or localhost) for service workers and geolocation. It will not have full offline behavior when opened directly as a `file://` page.

For a free static host, you can publish these files using GitHub Pages:
1. Create a GitHub account.
2. Create a public repository named `shield-safety-app`.
3. Upload all files from this folder to the repository root.
4. In repository Settings → Pages, select deploy from branch and choose `main` / root.
5. Open the published HTTPS URL on your phone.
6. In Chrome, use menu → Add to Home screen / Install app.
7. Open it once while online so the app assets are cached. Then test airplane mode for the offline interface.

## Privacy
Contacts and incident history are stored in browser localStorage on this device. They are not uploaded to a server. Clearing browser site data may erase them. Avoid entering real personal information during the college demonstration; use test contacts.

## Project status
This is an initial prototype. Native iOS/Android packaging, robust emergency SMS delivery, background operation, and Bluetooth relay are not implemented.
