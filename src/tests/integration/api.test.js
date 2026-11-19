const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const { createApp } = require("../../app");

const secret = "integration-test-secret-at-least-32-characters";
const token = role => jwt.sign({ role }, secret, { subject: role === "ADMIN" ? "1" : "2", expiresIn: "5m", algorithm: "HS256" });

const emptyUow = work => work({
    tasksRepository: {
        list: async () => ({ data: [{ id: 10, title: "Kartkówka", user_id: 2 }], pagination: { page: 2, limit: 1, total: 2, totalPages: 2 } }),
        summary: async () => ({ total: 1, PENDING: 1, IN_PROGRESS: 0, COMPLETED: 0, CANCELED: 0 })
    },
    subjectsRepository: { list: async () => ({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }) },
    gradesRepository: { list: async () => ({ data: [], pagination: { page: 1, limit: 20, total: 0, totalPages: 0 } }) }
});

let baseUrl;
let server;
test.before(async () => {
    const app = createApp({
        config: { JWT_SECRET: secret, JWT_EXPIRES_IN: "5m" },
        tasksRunInTransaction: emptyUow,
        subjectsRunInTransaction: emptyUow,
        gradesRunInTransaction: emptyUow,
        usersRepository: {
            findByEmail: async () => null,
            findById: async id => ({ id, email: "user@example.com", role: "USER", created_at: new Date() }),
            listAll: async () => [
                { id: 1, email: "admin@example.com", role: "ADMIN", created_at: new Date().toISOString() },
                { id: 2, email: "user@example.com", role: "USER", created_at: new Date().toISOString() }
            ],
            create: async () => ({ id: 3, email: "new@example.com", role: "USER", created_at: new Date() })
        }
    });
    server = app.listen(0);
    await new Promise(resolve => server.once("listening", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});
test.after(async () => {
    if (server) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
});

test("GET /api/tasks rejects requests without JWT", async () => {
    const response = await fetch(`${baseUrl}/api/tasks`);
    assert.equal(response.status, 401);
});

test("USER receives paginated task response and cannot access admin users", async () => {
    const response = await fetch(`${baseUrl}/api/tasks?page=2&limit=1`, {
        headers: { Authorization: `Bearer ${token("USER")}` }
    });
    assert.equal(response.status, 200);
    const body = await response.json();
    assert.equal(body.data.length, 1);
    assert.equal(body.pagination.page, 2);
    assert.equal(body.pagination.totalPages, 2);

    const forbidden = await fetch(`${baseUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token("USER")}` }
    });
    assert.equal(forbidden.status, 403);
});

test("ADMIN can access GET /api/admin/users", async () => {
    const response = await fetch(`${baseUrl}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token("ADMIN")}` }
    });
    assert.equal(response.status, 200);
    const users = await response.json();
    assert.equal(users.length, 2);
    assert.equal(users.some(user => Object.hasOwn(user, "password_hash")), false);
});
