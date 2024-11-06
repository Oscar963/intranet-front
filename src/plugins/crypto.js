import CryptoJS from "crypto-js";
import { getCookie, setCookie, eraseCookie } from "./cookies";

// Genera una contraseña segura basada en un timestamp ISO
export const generateSecurePassword =  (length = 12) => {
  const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialCharacters = "!@#$%^&*()_+[]{}|;:,.<>?";
  const allCharacters =
    uppercaseLetters + lowercaseLetters + numbers + specialCharacters;

  const getRandomCharacter = (characters) =>
    characters[Math.floor(Math.random() * characters.length)];

  // Asegura que la contraseña contiene al menos un carácter de cada conjunto
  let password = [
    getRandomCharacter(uppercaseLetters),
    getRandomCharacter(lowercaseLetters),
    getRandomCharacter(numbers),
    getRandomCharacter(specialCharacters),
  ];

  // Genera un timestamp de fecha ISO
  const timestamp = new Date().toISOString();

  // Crea un hash del timestamp usando la API SubtleCrypto
  const msgUint8 = new TextEncoder().encode(timestamp);
  const hashBuffer =  crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Llena la contraseña con caracteres aleatorios hasta alcanzar la longitud deseada
  while (password.length < length) {
    password.push(getRandomCharacter(allCharacters + hashHex));
  }

  // Mezcla los caracteres para evitar patrones predecibles
  password = password.sort(() => 0.5 - Math.random()).join("");

  return password;
};

// Nombre de la cookie para la clave secreta
const COOKIE_NAME_SECRET_CRYPTO = import.meta.env
  .VITE_COOKIE_NAME_SECRET_CRYPTO;

// Obtiene o genera una clave secreta y la guarda en una cookie
const getOrCreateSecretKey = () => {
  let secretKey = getCookie(COOKIE_NAME_SECRET_CRYPTO);
  if (!secretKey) {
    secretKey = generateSecurePassword(32);
    setCookie(COOKIE_NAME_SECRET_CRYPTO, secretKey, 1); // Guarda la clave en una cookie con duración de 1 día
  }
  return secretKey;
};

// Clave secreta para encriptar/desencriptar
const secretKey = getOrCreateSecretKey();

// Encripta y guarda un ítem en sessionStorage
export const setEncryptedItem = (key, value) => {
  const valueString = JSON.stringify(value);
  const encryptedValue = CryptoJS.AES.encrypt(
    valueString,
    secretKey
  ).toString();
  sessionStorage.setItem(key, encryptedValue);
};

// Desencripta y obtiene un ítem de sessionStorage
export const getDecryptedItem = (key) => {
  const encryptedValue = sessionStorage.getItem(key);

  if (encryptedValue) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedValue, secretKey);
      const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedValue);
    } catch (error) {
      //eraseCookie(import.meta.env.VITE_COOKIE_NAME_TOKEN);
      //eraseCookie(import.meta.env.VITE_COOKIE_NAME_SECRET_CRYPTO);
      //eraseCookie(import.meta.env.VITE_COOKIE_NAME_USER);
      return null;
    }
  }
  return null;
};
