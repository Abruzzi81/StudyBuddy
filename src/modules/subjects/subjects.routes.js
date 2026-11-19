const { Router } = require("express");
const validate = require("../../middleware/validate");
const { idParams, createSubjectBody, updateSubjectBody, listSubjectsQuery } = require("./subjects.schemas");

function createSubjectsRouter(controller) {
    const router = Router();

    router.get("/", validate({ query: listSubjectsQuery }), controller.getAll);
    router.get("/:id", validate({ params: idParams }), controller.getById);
    router.post("/", validate({ body: createSubjectBody }), controller.create);
    router.patch("/:id", validate({ params: idParams, body: updateSubjectBody }), controller.update);
    router.delete("/:id", validate({ params: idParams }), controller.remove);

    return router;
}

module.exports = { createSubjectsRouter };