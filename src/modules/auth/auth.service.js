const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ConflictError, UnauthorizedError } = require("../../errors/AppError");
const BCRYPT_ROUNDS = 12;

function createAuthService({ usersRepository, jwtSecret, jwtExpiresIn }) {
    async function register({ email, password }) {
        const existing = await usersRepository.findByEmail(email);
        if (existing) throw new ConflictError("Email already registered",
            "EMAIL_TAKEN");
        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        return usersRepository.create({ email, password_hash, role: "USER" });
    }
    async function login({ email, password }) {
        const user = await usersRepository.findByEmail(email);
        const passwordOk = user ? await bcrypt.compare(password,
            user.password_hash) : false;
        if (!user || !passwordOk) throw new UnauthorizedError("Invalid email orpassword");
        const accessToken = jwt.sign(
            { role: user.role },
            jwtSecret,
            {
                subject: String(user.id), expiresIn: jwtExpiresIn, algorithm:
                    "HS256"
            }
        );
        return { accessToken, tokenType: "Bearer", expiresIn: jwtExpiresIn };
    }
    return { register, login };
}
module.exports = { createAuthService };