
// UV proxy utilities
import { encodeUrl } from '@/uv/uv.bundle';

export function isValidUrl(url: string): boolean {
  try {
    // Add https:// if no protocol is specified
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
}

export function formatUrl(url: string): string {
  // Add https:// if no protocol is specified
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
}

export function getProxyUrl(url: string): string {
  const formattedUrl = formatUrl(url);
  // Using UV's encodeUrl to properly format the URL for the UV proxy
  const encodedUrl = encodeUrl(formattedUrl);
  return `/uv/service/${encodedUrl}`;
}
