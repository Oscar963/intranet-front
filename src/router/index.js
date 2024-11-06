// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import authRoutes from "./authRoutes";
import appRoutes from "./appRoutes";
import webRoutes from "./webRoutes";

import { useAuthStore } from "@/stores/auth";

const routes = [...authRoutes, ...appRoutes, ...webRoutes];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

const token_name = import.meta.env.VITE_COOKIE_NAME_TOKEN;
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const isAuthenticated = !!sessionStorage.getItem(token_name);

  if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !isAuthenticated
  ) {
    if (!authStore.isAuthenticated()) {
      next({ name: "Login" });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (authStore.isAuthenticated()) {
      next({ name: "Home" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
