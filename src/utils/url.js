export function normalizeBaseUrl(url) {
  return String(url || '').trim().replace(/\/+$/, '');
}
