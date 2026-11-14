const { Router } = require("express");
const validate = require("../../middleware/validate");
const { idParams, createGradeBody, listGradesQuery } = require("./grades.schemas");

function createGradesRouter(controller) {
    const router = Router();

    router.get("/", validate({ query: listGradesQuery }), controller.getAll);
    router.get("/:id", validate({ params: idParams }), controller.getById);
    router.post("/", validate({ body: createGradeBody }), controller.create);
    router.delete("/:id", validate({ params: idParams }), controller.remove);

    return router;
}

module.exports = { createGradesRouter };