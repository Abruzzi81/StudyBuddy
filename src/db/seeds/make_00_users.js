const bcrypt = require("bcryptjs");
exports.seed = async function (knex) {
    await knex.raw('TRUNCATE tasks, subjects, users RESTART IDENTITY CASCADE');

    const saltRounds = 12;

    const adminPasswordHash = await bcrypt.hash("AdminPassword123", saltRounds);
    const userPasswordHash = await bcrypt.hash("UserPassword123", saltRounds);
    const secondUserPasswordHash = await bcrypt.hash("StudentPassword123", saltRounds);

    await knex('users').insert([
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