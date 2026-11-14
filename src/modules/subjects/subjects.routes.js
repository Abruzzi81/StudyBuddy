const { Router } = require("express");
const validate = require("../../middleware/validate");
const { idParams, createSubjectBody, listSubjectsQuery } = require("./subjects.schemas");

function createSubjectsRouter(controller) {
    const router = Router();

    router.get("/", validate({ query: listSubjectsQuery }), controller.getAll);
    router.get("/:id", validate({ params: idParams }), controller.getById);
    router.post("/", validate({ body: createSubjectBody }), controller.create);
    router.delete("/:id", validate({ params: idParams }), controller.remove);

    return router;
}

module.exports = { createSubjectsRouter };