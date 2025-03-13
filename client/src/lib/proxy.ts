// Validate URL format
export function isValidUrl(url: string): boolean {
  try {
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

// Get the proxy URL for a given target URL
export function getProxyUrl(url: string): string {
  // Add protocol if missing
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return `/api/proxy?url=${encodeURIComponent(url)}`;
}
