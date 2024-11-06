import { registerPlugins } from "@/plugins";

import App from "./App.vue";

import { createApp } from "vue";

const app = createApp(App);

// Usar plugins y configuraciones
registerPlugins(app);
app.mount("#app");

// Referencia adicional
// https://github.com/ankurk91/vue-toast-notification?tab=readme-ov-file
