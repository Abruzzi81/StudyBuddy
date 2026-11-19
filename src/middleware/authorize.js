const { ForbiddenError } = require("../errors/AppError");

function authorize(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return next(new ForbiddenError("You do not have permission to access this resource"));
        }
        next();
    };
}

module.exports = authorize;
