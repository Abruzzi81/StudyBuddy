function createKnexUnitOfWork(db) {
  function createTasksRepository(trx) {
    return {
      async list(userId, { page = 1, limit = 20, sortBy = "id", order = "desc", status, subject_id } = {}) {
        const query = trx("tasks");

        if (userId !== null) {
          query.where({ user_id: userId });
        } if (status) query.where({ status });

        if (subject_id) query.where({ subject_id });
        const countRow = await query.clone().count({ total: "*" }).first();
        const total = Number(countRow.total);
        const data = await query.clone().select("*").orderBy(sortBy === "createdAt" ? "created_at" : sortBy, order)
          .limit(limit).offset((page - 1) * limit);
        return { data, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
      },
      async summary(userId) {
        const query = trx("tasks");

        if (userId !== null) {
          query.where({ user_id: userId });
        }

        const rows = await query
          .select("status")
          .count({ count: "*" })
          .groupBy("status");

        const summary = {
          total: 0,
          PENDING: 0,
          IN_PROGRESS: 0,
          COMPLETED: 0,
          CANCELED: 0
        };

        for (const row of rows) {
          const count = Number(row.count);
          summary[row.status] = count;
          summary.total += count;
        }

        return summary;
      },
      async findById(id, userId) {
        const query = trx("tasks").where({ id });

        if (userId !== null) {
          query.where({ user_id: userId });
        }

        return (await query.first()) ?? null;
      },
      async create(data, userId) {
        const [task] = await trx("tasks").insert({
          user_id: userId, subject_id: data.subject_id ?? null, title: data.title,
          description: data.description ?? null, due_date: data.due_date ?? null,
          type: data.type ?? "OTHER", status: data.status ?? "PENDING"
        }).returning("*");
        return task;
      },
      async update(id, data, userId) {
        const [task] = await trx("tasks").where({ id, user_id: userId }).update(data).returning("*");
        return task ?? null;
      },
      async cancel(id, userId) {
        const [task] = await trx("tasks").where({ id, user_id: userId })
          .update({ status: "CANCELED" }).returning("*");
        return task ?? null;
      }
    };
  }
  async function runInTransaction(work) {
    return db.transaction(async trx => work({ tasksRepository: createTasksRepository(trx), trx }));
  }
  return { runInTransaction };
}
module.exports = { createKnexUnitOfWork };
