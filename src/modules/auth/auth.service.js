const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { ConflictError, UnauthorizedError } = require("../../errors/AppError");
const BCRYPT_ROUNDS = 12;

function createAuthService({ usersRepository, jwtSecret, jwtExpiresIn }) {
    async function register({ email, password }) {
        const existing = await usersRepository.findByEmail(email);
        if (existing) {
            throw new ConflictError("Email already registered", "EMAIL_TAKEN");
        }

        const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
        try {
            return await usersRepository.create({
                email,
                password_hash: passwordHash,
                role: "USER"
            });
        } catch (error) {
            // UNIQUE w bazie chroni również przed równoczesną rejestracją tego samego e-maila.
            if (error.code === "23505") {
                throw new ConflictError("Email already registered", "EMAIL_TAKEN");
            }
            throw error;
        }
    }

    async function login({ email, password }) {
        const user = await usersRepository.findByEmail(email);
        const passwordOk = user
            ? await bcrypt.compare(password, user.password_hash)
            : false;

        if (!user || !passwordOk) {
            throw new UnauthorizedError("Invalid email or password");
        }

        const accessToken = jwt.sign(
            { role: user.role },
            jwtSecret,
            {
                subject: String(user.id),
                expiresIn: jwtExpiresIn,
                algorithm: "HS256"
            }
        );

        return { accessToken, tokenType: "Bearer", expiresIn: jwtExpiresIn };
    }

    return { register, login };
}

module.exports = { createAuthService };
