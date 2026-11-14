exports.up = async function (knex) {
    await knex.schema.createTable("users", table => {
        table.increments("id").primary();
        table.string("email", 254).notNullable().unique();
        table.string("password_hash", 100).notNullable();
        table.string("role", 20).notNullable().defaultTo("USER");
        table.timestamp("created_at", {
            useTz:
                true
        }).notNullable().defaultTo(knex.fn.now());
    });
    await knex.raw(`ALTER TABLE users ADD CONSTRAINT users_role_check CHECK
(role IN ('USER', 'ADMIN'))`);
    await knex.schema.alterTable("tasks", table => {

        table.integer("created_by").references("id").inTable("users").onDelete("SET NULL");
 });
};
exports.down = async function (knex) {
    await knex.schema.alterTable("tasks", table =>
        table.dropColumn("created_by"));
    await knex.schema.dropTable("users");
};