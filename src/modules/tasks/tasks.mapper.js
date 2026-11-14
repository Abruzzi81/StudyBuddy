function toTaskResponse(task) {
    return {
        id: task.id,
        subject_id: task.subject_id,
        title: task.title,
        description: task.description,
        due_date: task.due_date,
        type: task.type,
        createdAt: task.createdAt,
        status: task.status,
    };
}

module.exports = { toTaskResponse };