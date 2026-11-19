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

    async function listAll() {
        return await db("users")
            .select("id", "email", "role", "created_at")
            .orderBy("id", "asc");
    }

    return {
        findByEmail,
        findById,
        listAll,
        create
    };
}

module.exports = { createUsersRepository };