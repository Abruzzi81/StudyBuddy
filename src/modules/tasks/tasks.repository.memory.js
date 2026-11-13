function createInMemoryTasksRepository(seed = {}) {
    const state = {
        tasks: structuredClone(seed.tasks ?? [])
    };
    let nextTaskId = Math.max(0, ...state.tasks.map(r => r.id)) + 1;

    const tasksRepository = {

        async list() {
            return state.tasks;
        },

        async findById(id) {
            return state.tasks.find(r => r.id === id) ?? null;
        },

        async create(data) {
            const task = { 
                id: nextTaskId++,
                title: null,
                description: null,
                due_date: null,
                type: null,
                createdAt: new Date().toISOString(),
                status: null,
                ...data
            };
            state.tasks.push(task);
            return task;
        },

        async cancel(id) {
            const task = state.tasks.find(t => t.id === id);

            if(!task) {
                console.log("No task with this id");
                return null;
            }
            task.status = "CANCELED";
            return task;
        }
    };

    return tasksRepository;
}

module.exports = { createInMemoryTasksRepository }