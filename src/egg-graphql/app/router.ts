export default (app) => {
  app.resources("users", "/api/users", app.controller.user);
};
