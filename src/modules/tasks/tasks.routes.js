const { Router } = require("express");
const validate = require("../../middleware/validate");
const { idParams, createTaskBody, updateTaskBody, listTasksQuery } = require("./tasks.schemas");
function createTasksRouter(controller) {
  const router = Router();
  router.get("/summary", controller.getSummary);
  router.get("/", validate({ query: listTasksQuery }), controller.getAll);
  router.get("/:id", validate({ params: idParams }), controller.getById);
  router.post("/", validate({ body: createTaskBody }), controller.create);
  router.patch("/:id", validate({ params: idParams, body: updateTaskBody }), controller.update);
  router.patch("/:id/cancel", validate({ params: idParams }), controller.cancel);
  return router;
}
module.exports = { createTasksRouter };
