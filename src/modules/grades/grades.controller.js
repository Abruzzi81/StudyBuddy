const { toGradeResponse } = require("./grades.mapper");

function createGradesController(gradeService) {
    return {
        async getAll(req, res) {
            const grades = await gradeService.getAll(req.user.id, req.validated.query);
            res.json(grades.map(toGradeResponse));
        },

        async getById(req, res) {
            const grade = await gradeService.getGrade(req.validated.params.id, req.user.id);
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
