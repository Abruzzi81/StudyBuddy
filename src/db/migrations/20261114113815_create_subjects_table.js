/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('subjects', function(table) {
        table.increments('id').primary();
        table.integer('user_id').nullable();
        table.string('name', 100).notNullable();
        table.string('teacher', 100).nullable();
        table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTable('subjects');
};