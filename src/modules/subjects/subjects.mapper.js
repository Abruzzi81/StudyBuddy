function toSubjectResponse(subject) {
    return {
        id: subject.id,
        user_id: subject.user_id,
        name: subject.name,
        teacher: subject.teacher,
        createdAt: subject.createdAt,
    };
}

module.exports = { toSubjectResponse };