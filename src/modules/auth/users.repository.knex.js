function createUsersRepository(db) {
    async function findByEmail(email) {
        return await db("users").where({ email }).first();
    }

    async function findById(id) {
        return await db("users").where({ id }).first();
    }

    async function create({ email, password_hash, role }) {
        const [user] = await db("users")
            .insert({
                email,
                password_hash: password_hash,
                role
            })
            .returning(["id", "email", "role", "created_at"]);
        return user;
    }

    return {
        findByEmail,
        findById,
        create
    };
}

module.exports = { createUsersRepository };