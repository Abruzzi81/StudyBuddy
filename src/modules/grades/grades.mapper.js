function toGradeResponse(grade) {
    return {
        id: grade.id,
        subject_id: grade.subject_id,
        grade: grade.grade,
        weight: grade.weight,
        description: grade.description,
        grade_date: grade.grade_date,
        createdAt: grade.createdAt,
    };
}

module.exports = { toGradeResponse };