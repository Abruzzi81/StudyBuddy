const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
    const tables = ["tasks", "subjects", "users"];
    const existingTables = [];

    for (const table of tables) {
        const exists = await knex.schema.hasTable(table);
        if (exists) {
            existingTables.push(table);
        }
    }

    if (existingTables.length > 0) {
        await knex.raw(
            `TRUNCATE TABLE ${existingTables.join(", ")} RESTART IDENTITY CASCADE`
        );
    }

    const saltRounds = 12;

    const adminPasswordHash = await bcrypt.hash("AdminPassword123", saltRounds);
    const userPasswordHash = await bcrypt.hash("UserPassword123", saltRounds);
    const secondUserPasswordHash = await bcrypt.hash("StudentPassword123", saltRounds);

    await knex("users").insert([
        {
            email: "admin@studybuddy.pl",
            password_hash: adminPasswordHash,
            role: "ADMIN"
        },
        {
            email: "student@studybuddy.pl",
            password_hash: userPasswordHash,
            role: "USER"
        },
        {
            email: "jan.kowalski@studybuddy.pl",
            password_hash: secondUserPasswordHash,
            role: "USER"
        }
    ]);
};