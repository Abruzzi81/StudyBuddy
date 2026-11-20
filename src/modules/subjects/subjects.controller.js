const { toSubjectResponse } = require("./subjects.mapper");

function createSubjectsController(subjectService) {
    return {
        async getAll(req, res) {
            const userId = req.user.role === "ADMIN"
                ? null
                : req.user.id;
            const result = await subjectService.getAll(userId, req.validated.query);
            res.json({ data: result.data.map(toSubjectResponse), pagination: result.pagination });
        },

        async getById(req, res) {
            const userId = req.user.role === "ADMIN"
                ? null
                : req.user.id;
            const subject = await subjectService.getSubject(req.validated.params.id, userId);
            res.json(toSubjectResponse(subject));
        },

        async create(req, res) {
            const subject = await subjectService.createSubject(req.validated.body, req.user.id);
            res.status(201)
                .location(`/api/subjects/${subject.id}`)
                .json(toSubjectResponse(subject));
        },

        async update(req, res) {
            const subject = await subjectService.updateSubject(req.validated.params.id, req.validated.body, req.user.id);
            res.json(toSubjectResponse(subject));
        },

        async remove(req, res) {
            const subject = await subjectService.removeSubject(req.validated.params.id, req.user.id);
            res.json(toSubjectResponse(subject));
        }
    };
}

module.exports = { createSubjectsController };
