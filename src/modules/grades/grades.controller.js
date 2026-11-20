const { toGradeResponse } = require("./grades.mapper");

function createGradesController(gradeService) {
    return {
        async getAll(req, res) {
            const userId = req.user.role === "ADMIN"
                ? null
                : req.user.id;
            const result = await gradeService.getAll(userId, req.validated.query);
            res.json({ data: result.data.map(toGradeResponse), pagination: result.pagination });
        },

        async getAverage(req, res) {
            const userId = req.user.role === "ADMIN"
                ? null
                : req.user.id;
            const result = await gradeService.getAverage(userId, req.validated.query.subject_id);
            res.json(result);
        },

        async getById(req, res) {
            const userId = req.user.role === "ADMIN"
                ? null
                : req.user.id;
            const grade = await gradeService.getGrade(req.validated.params.id, userId);
            res.json(toGradeResponse(grade));
        },

        async create(req, res) {
            const grade = await gradeService.createGrade(req.validated.body, req.user.id);
            res.status(201)
                .location(`/api/grades/${grade.id}`)
                .json(toGradeResponse(grade));
        },

        async remove(req, res) {
            const grade = await gradeService.removeGrade(req.validated.params.id, req.user.id);
            res.json(toGradeResponse(grade));
        }
    };
}

module.exports = { createGradesController };
