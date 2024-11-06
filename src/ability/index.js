import { abilitiesPlugin } from "@casl/vue";
import { ability } from "@/ability/ability";

export const abilitiesPluginInstaller = {
  install(app) {
    app.use(abilitiesPlugin, ability, {
      useGlobalProperties: true,
    });
  },
};
