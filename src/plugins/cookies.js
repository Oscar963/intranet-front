// src/plugins/cookies.js
export const setCookie = (
  name,
  value,
  days,
  path = "/",
  domain,
  secure = true,
  sameSite = "Lax"
) => {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  let cookieString = `${name}=${value || ""}${expires}; path=${path}`;
  if (domain) {
    cookieString += `; domain=${domain}`;
  }
  if (secure) {
    cookieString += "; Secure";
  }
  if (sameSite) {
    cookieString += `; SameSite=${sameSite}`;
  }
  document.cookie = cookieString;
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const eraseCookie = (name, path = "/", domain = "") => {
  if (domain) {
    document.cookie = `${name}=; Max-Age=0; path=${path}; domain=${domain};`;
  } else {
    document.cookie = `${name}=; Max-Age=0; path=${path};`;
  }
};
