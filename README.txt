QUICK UPI PAY — START HERE

Files:
- index.html: app interface
- styles.css: mobile-friendly design
- app.js: payment-link, QR and share logic
- manifest.json + sw.js + icon.svg: PWA installation/offline shell

IMPORTANT UPI NOTE:
The configured UPI ID is subhajitdas2012@nyes, as supplied. The app performs only a basic format check; it cannot confirm that this UPI ID exists, is active, or belongs to the intended recipient. Verify the ID in your UPI app before sharing payment requests.

HOW TO TEST:
1. Extract the ZIP.
2. Open index.html in a browser for a basic test. Some PWA features require hosting over HTTPS or localhost.
3. Enter an amount and note, then tap Generate payment link & QR.
4. Test the UPI link only after verifying the recipient details.

HOW TO PUBLISH FREE:
1. Create a GitHub account and a new public repository named quick-upi-pay.
2. Upload all files from this folder to the repository root.
3. Open repository Settings > Pages.
4. Under Build and deployment, select Deploy from a branch, choose main and /(root), then Save.
5. Wait for the Pages URL to appear. Open it on your phone using HTTPS.
6. In Chrome, use the menu > Install app or Add to Home screen.

LIMITATIONS:
- This is not a payment gateway and does not receive money itself.
- It cannot verify payment success; confirm in your UPI app/bank.
- QR generation uses a third-party QRCode JavaScript library from a CDN, so generating QR codes needs internet access unless you vendor that library locally.
- Do not collect or store UPI PINs, OTPs, passwords, or bank credentials.
