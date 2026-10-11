const $ = (id) => document.getElementById(id);
const DEFAULT_UPI = 'subhajitdas2012@nyes';
const upiInput = $('upi');
const amountInput = $('amount');
const noteInput = $('note');
let currentPaymentLink = '';
let installPrompt = null;

try { upiInput.value = localStorage.getItem('quickUpiPayId') || DEFAULT_UPI; } catch (_) { upiInput.value = DEFAULT_UPI; }

function validUpi(value) {
  // Basic format check only; it cannot verify whether an ID exists or is active.
  return /^[A-Za-z0-9._-]{2,256}@[A-Za-z0-9.-]{2,64}$/.test(value);
}
function makeLink(upi, amount, note) {
  const params = new URLSearchParams({ pa: upi, am: amount, tn: note, cu: 'INR' });
  return 'upi://pay?' + params.toString();
}
function showError(message) { $('error').textContent = message; }
$('saveUpi').addEventListener('click', () => {
  const value = upiInput.value.trim();
  if (!validUpi(value)) {
    $('upiStatus').textContent = 'Please enter a UPI ID in the format name@provider.';
    $('upiStatus').style.color = '#b42318';
    return;
  }
  try { localStorage.setItem('quickUpiPayId', value); } catch (_) {}
  $('upiStatus').textContent = 'UPI ID saved on this device.';
  $('upiStatus').style.color = '#0b7852';
});
document.querySelectorAll('[data-amount]').forEach(button => button.addEventListener('click', () => { amountInput.value = button.dataset.amount; }));
$('generate').addEventListener('click', () => {
  showError('');
  const upi = upiInput.value.trim();
  const rawAmount = amountInput.value.trim();
  const amountNumber = Number(rawAmount);
  const note = noteInput.value.trim();
  if (!validUpi(upi)) return showError('Enter a UPI ID in the format name@provider.');
  if (!rawAmount || !Number.isFinite(amountNumber) || amountNumber <= 0 || amountNumber > 1000000) return showError('Enter a valid amount greater than ₹0 and no more than ₹10,00,000.');
  if (!note) return showError('Add a short payment note.');
  const amount = amountNumber.toFixed(2);
  currentPaymentLink = makeLink(upi, amount, note);
  $('showUpi').textContent = upi;
  $('showAmount').textContent = '₹' + amount;
  $('showNote').textContent = note;
  $('payLink').href = currentPaymentLink;
  $('result').hidden = false;
  $('qrcode').replaceChildren();
  if (typeof QRCode !== 'undefined') {
    new QRCode($('qrcode'), { text: currentPaymentLink, width: 200, height: 200, colorDark: '#12352b', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });
  } else {
    $('qrcode').textContent = 'QR library could not load. Connect to the internet and reload this page.';
  }
  $('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
});
$('copyLink').addEventListener('click', async () => {
  if (!currentPaymentLink) return;
  try { await navigator.clipboard.writeText(currentPaymentLink); $('copyLink').textContent = 'Copied!'; }
  catch (_) { window.prompt('Copy this UPI payment link:', currentPaymentLink); }
});
$('shareLink').addEventListener('click', async () => {
  if (!currentPaymentLink) return;
  const shareData = { title: 'UPI payment request', text: 'UPI payment request', url: currentPaymentLink };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch (_) {}
  } else {
    try { await navigator.clipboard.writeText(currentPaymentLink); $('shareLink').textContent = 'Link copied'; }
    catch (_) { window.prompt('Copy this UPI payment link:', currentPaymentLink); }
  }
});
$('downloadQr').addEventListener('click', () => {
  const qr = $('qrcode');
  const canvas = qr.querySelector('canvas');
  const img = qr.querySelector('img');
  let dataUrl = canvas ? canvas.toDataURL('image/png') : (img ? img.src : '');
  if (!dataUrl) return;
  const a = document.createElement('a');
  a.href = dataUrl; a.download = 'quick-upi-pay-qr.png'; a.click();
});
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault(); installPrompt = event; $('installBtn').hidden = false;
});
$('installBtn').addEventListener('click', async () => {
  if (!installPrompt) return;
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  $('installBtn').hidden = true;
});
