const { toSubjectResponse } = require("./subjects.mapper");

function createSubjectsController(subjectService) {
    return {
        async getAll(req, res) {
            const subjects = await subjectService.getAll(req.user.id, req.validated.query);
            res.json(subjects.map(toSubjectResponse));
        },

        async getById(req, res) {
            const subject = await subjectService.getSubject(req.validated.params.id, req.user.id);
            res.json(toSubjectResponse(subject));
        },

        async create(req, res) {
            const subject = await subjectService.createSubject(req.validated.body, req.user.id);
            res.status(201)
                .location(`/api/subjects/${subject.id}`)
                .json(toSubjectResponse(subject));
        },

        async remove(req, res) {
            const subject = await subjectService.removeSubject(req.validated.params.id, req.user.id);
            res.json(toSubjectResponse(subject));
        }
    };
}

module.exports = { createSubjectsController };
