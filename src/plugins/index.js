/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */


//import "@tabler/core/dist/js/tabler.min.js";
import 'bootstrap'; // Importar Bootstrap JS
import tooltip from '@/plugins/tooltip';
import popover from '@/plugins/popover'; 

import '@/style/main.scss';


// Plugins
import pinia from "@/stores";
import router from "@/router";
import { abilitiesPluginInstaller } from "@/ability/index";

export function registerPlugins(app) {
  app.use(router).use(pinia).use(abilitiesPluginInstaller).use(tooltip).use(popover);
}
