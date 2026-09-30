// Browsers can't report physical size, so we look the model up in a table of panel ppi.
const PPI_BY_MODEL = {
  'pixel 6': 411, 'pixel 6 pro': 512, 'pixel 6a': 429,
  'pixel 7': 416, 'pixel 7 pro': 512, 'pixel 7a': 429,
  'pixel 8': 428, 'pixel 8 pro': 489, 'pixel 8a': 430,
  'pixel 9': 422, 'pixel 9 pro': 495, 'pixel 9 pro xl': 486,
  'pixel 10': 422, 'pixel 10 pro': 495, 'pixel 10 pro xl': 486,
};
const PPI_BY_PREFIX = { // Samsung model codes (SM-S921B etc.)
  'sm-s921': 416, 'sm-s926': 513, 'sm-s928': 505, // S24 / S24+ / S24 Ultra
};
let ppi = 422, label = 'Pixel 9 default';
const saved = +localStorage.getItem('ppi');

async function detect() {
  let model = '';
  try { model = (await navigator.userAgentData.getHighEntropyValues(['model'])).model || ''; } catch (e) {}
  if (!model) model = (navigator.userAgent.match(/Android[^;]*; ([^;)]+)/) || [])[1] || '';
  const m = model.trim().toLowerCase();
  const byPrefix = Object.keys(PPI_BY_PREFIX).find(p => m.startsWith(p));
  if (PPI_BY_MODEL[m]) return { ppi: PPI_BY_MODEL[m], label: model };
  if (byPrefix) return { ppi: PPI_BY_PREFIX[byPrefix], label: model };
  // Unknown phone: Android CSS density is ~160 dpi per 1.0 dpr, close enough to start from.
  return { ppi: Math.round(devicePixelRatio * 160), label: (model || 'Unknown device') + ' (estimated)' };
}
