const toUserResponse = u => ({
    id: u.id,
    email: u.email,
    role: u.role,
    created_at: new Date(u.createdAt).toISOString()
});