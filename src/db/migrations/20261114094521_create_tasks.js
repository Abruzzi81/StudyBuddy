exports.up = async function (knex) {
    await knex.schema.createTable('tasks', (table) => {
        table.increments('id').primary();

        table.string('title', 150).notNullable();

        table.text('description').nullable();

        table.timestamp('due_date').nullable();

        table.enum('type', ['HOMEWORK', 'TEST', 'OTHER'])
            .notNullable()
            .defaultTo('OTHER');

        table.timestamp('createdAt')
            .notNullable()
            .defaultTo(knex.fn.now());

        table.enum('status', ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELED'])
            .notNullable()
            .defaultTo('PENDING');
    });
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('tasks');
};
