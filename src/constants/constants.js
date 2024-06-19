export const devMode = null;
export const mainUrl = null;
export const mainUrlOrigin = window.location.origin;
export const mainUrlRequest = mainUrl + '/request/?' + (devMode ? 'dev=Y' : '');