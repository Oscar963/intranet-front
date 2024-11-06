// src/axios.js
import axios from "axios";
import { Ability } from "@casl/ability";
import { useToast } from "vue-toast-notification";
import { useLoadingStore } from "@/stores/loading";
import pinia from "@/stores"; // Importa la instancia de Pinia

import "vue-toast-notification/dist/theme-bootstrap.css";
import { getCookie, eraseCookie } from "./cookies";

const ability = new Ability([]);
const $toast = useToast();

// Crear la instancia de la tienda de carga
const loadingStore = useLoadingStore(pinia);

// Crear una instancia de Axios con la configuración base
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

// Interceptor de solicitud para incluir el token de autenticación en los encabezados
const COOKIE_NAME_TOKEN = import.meta.env.VITE_COOKIE_NAME_TOKEN;

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getCookie(COOKIE_NAME_TOKEN);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["Accept"] = "application/json";
    }
    // Establece el estado de carga a true
    loadingStore.setLoading(true);
    return config;
  },
  (error) => {
    // Establece el estado de carga a false en caso de error
    loadingStore.setLoading(false);
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores de autenticación
axiosInstance.interceptors.response.use(
  (response) => {
    // Establece el estado de carga a false cuando la respuesta es exitosa
    loadingStore.setLoading(false);
    return response;
  },
  (error) => {
    // Establece el estado de carga a false en caso de error
    loadingStore.setLoading(false);

    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Unauthenticated."
    ) {
      sessionStorage.removeItem(COOKIE_NAME_TOKEN);
      $toast.info(
        "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
        {
          position: "top-right",
          duration: 2000,
        }
      );
      eraseCookie(import.meta.env.VITE_COOKIE_NAME_TOKEN);
      eraseCookie(import.meta.env.VITE_COOKIE_NAME_SECRET_CRYPTO);
      eraseCookie(import.meta.env.VITE_COOKIE_NAME_USER);
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export { axiosInstance, ability };
