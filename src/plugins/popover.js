import { Popover } from 'bootstrap';

export default {
  install(app) {
    app.directive('popover', {
      mounted(el) {
        new Popover(el);
      },
      updated(el) {
        new Popover(el);
      }
    });
  }
};