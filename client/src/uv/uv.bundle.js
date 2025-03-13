
// UV bundle for client-side URL encoding
function encodeUrl(url) {
  return btoa(url.toString());
}

function decodeUrl(encodedUrl) {
  return atob(encodedUrl);
}

export { encodeUrl, decodeUrl };
