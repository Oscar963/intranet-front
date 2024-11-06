import { defineStore } from "pinia";
import { axiosInstance } from "@/plugins/axios";
import { setCookie, getCookie, eraseCookie } from "@/plugins/cookies";
import { setEncryptedItem, getDecryptedItem } from "@/plugins/crypto";
import { updateAbilities } from "@/ability/ability";

const token_name = import.meta.env.VITE_COOKIE_NAME_TOKEN;
const COOKIE_NAME_USER = import.meta.env.VITE_COOKIE_NAME_USER;

const clearAuthData = () => {
  eraseCookie(token_name);
  sessionStorage.removeItem(COOKIE_NAME_USER);
};


export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: getDecryptedItem(COOKIE_NAME_USER) || null,
    permissions: [],
    roles: [],
  }),
  actions: {
    async login(rut, password, remember = false) {
      clearAuthData();
      try {
        const response = await axiosInstance.post("/api/auth/login", {
          rut,
          password,
          remember,
        });
        const { access_token, user, roles, permissions } = response.data;

        setCookie(token_name, access_token, remember ? 7 : 1);
        setEncryptedItem(COOKIE_NAME_USER, user);
        this.user = user;
        this.setRolesAndPermissions(roles, permissions);

        return response.data;
      } catch (err) {
        throw err;
      }
    },
    async logout() {
      try {
        const response = await axiosInstance.post("/api/auth/logout");
        clearAuthData();
        this.user = null;
        this.roles = [];
        this.permissions = [];

        return response.data;
      } catch (err) {
        if (err.response && err.response.status === 401) {
          clearAuthData();
          this.user = null;
          this.roles = [];
          this.permissions = [];
        }
        throw err;
      }
    },
    async fetchPermissions() {
      try {
        const response = await axiosInstance.get("/api/user/roles-permissions");
        const { roles, permissions } = response.data;
        this.setRolesAndPermissions(roles, permissions);
      } catch (error) {
        console.error("Error al obtener los permisos del usuario:", error);
      }
    },
    isAuthenticated() {
      return !!this.user;
    },
    setRolesAndPermissions(roles, permissions) {
      this.roles = roles;
      this.permissions = permissions;
      updateAbilities({ roles: roles, permissions: permissions });
    },
  },
});
