import { Modal } from "bootstrap";

export default {
  install(app) {
    app.directive("modal", {
      mounted(el) {
        new Modal(el);
      },
      updated(el) {
        new Modal(el);
      },
    });
  },
};
