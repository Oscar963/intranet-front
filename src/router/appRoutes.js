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
        path: "popups",
        name: "Popup",
        component: () => import("@/components/Popup/PopupList.vue"),
      },
      {
        path: "popups/store",
        name: "PopupStore",
        component: () => import("@/components/Popup/PopupStore.vue"),
      },
      {
        path: "popups/update/:id",
        name: "PopupUpdate",
        component: () => import("@/components/Popup/PopupUpdate.vue"),
        props: true,
      },
      {
        path: "banners",
        name: "Banner",
        component: () => import("@/components/Banner/BannerList.vue"),
      },
      {
        path: "banners/store",
        name: "BannerStore",
        component: () => import("@/components/Banner/BannerStore.vue"),
      },
      {
        path: "banners/update/:id",
        name: "BannerUpdate",
        component: () => import("@/components/Banner/BannerUpdate.vue"),
        props: true,
      },
      {
        path: "pages",
        name: "Page",
        component: () => import("@/components/Page/PageList.vue"),
      },
      {
        path: "pages/store",
        name: "PageStore",
        component: () => import("@/components/Page/PageStore.vue"),
      },
      {
        path: "pages/update/:slug",
        name: "PageUpdate",
        component: () => import("@/components/Page/PageUpdate.vue"),
        props: true,
      },
      {
        path: "pages/file/:slug",
        name: "PageFile",
        component: () => import("@/components/Page/PageFile.vue"),
        props: true,
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
