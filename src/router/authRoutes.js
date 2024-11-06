const authRoutes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("../components/Auth/Login.vue"),
    meta: { guest: true },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("../components/Auth/ForgotPassword.vue"),
    meta: { guest: true },
  },
  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("../components/Auth/ResetPassword.vue"),
    meta: { guest: true },
  },
];

export default authRoutes;
