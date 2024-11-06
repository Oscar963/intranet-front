import { Tooltip } from "bootstrap";

export default {
  install(app) {
    app.directive("tooltip", {
      mounted(el) {
        new Tooltip(el);
      },
      updated(el) {
        new Tooltip(el);
      },
    });
  },
};
