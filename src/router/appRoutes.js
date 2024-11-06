const appRoutes = [
  {
    path: "/admin",
    name: "Inicio",
    meta: { requiresAuth: true },
    redirect: { name: "Home" },
    component: () => import("@/components/Layouts/App/Index.vue"),
    children: [
      {
        path: "home",
        name: "Home",
        component: () => import("@/components/Home.vue"),
      },
      {
        path: "banners",
        name: "Banner",
        component: () => import("@/components/Banner/ListarBanner.vue"),
      },
      {
        path: "pages",
        name: "Page",
        component: () => import("@/components/Page/ListarPage.vue"),
      },
      ///////////////// ============================== /////////////////
      {
        path: "user/perfil",
        name: "Perfil",
        component: () => import("@/components/User/Perfil.vue"),
      },
      {
        path: "cambiar/contrasena",
        name: "Contrasena",
        component: () => import("@/components/User/CambiarContrasena.vue"),
      },
      {
        path: "users",
        name: "User",
        component: () => import("@/components/User/ListarUser.vue"),
      },
      {
        path: "roles",
        name: "Roles",
        component: () => import("@/components/Roles/ListarRole.vue"),
      },
      {
        path: "logs",
        name: "Logs",
        component: () => import("@/components/Logs/ListarLogs.vue"),
      },
      {
        path: ":catchAll(.*)",
        component: () => import("@/components/Errors/NotFound.vue"),
      },
    ],
  },
];

export default appRoutes;
