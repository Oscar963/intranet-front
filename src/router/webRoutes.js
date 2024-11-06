const webRoutes = [
  {
    path: "/",
    name: "HomePage",
    meta: { requiresAuth: false },
    component: () => import("../components/Layouts/Web/Index.vue"),
    children: [
      {
        path: "",
        name: "Index",
        component: () => import("../components/Sites/Index.vue"),
        meta: { requiresAuth: false },
      }
    ],
  },
];

export default webRoutes;
