exports.up = function(knex) {
    return knex.schema.createTable('grades', function(table) {
        table.increments('id').primary();
        table.integer('subject_id').unsigned().notNullable();
        table.decimal('grade', 3, 2).notNullable();
        table.decimal('weight', 3, 2).notNullable().defaultTo(1.0);
        table.string('description', 150).nullable();
        table.date('grade_date').notNullable().defaultTo(knex.fn.now());
        table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('grades');
};