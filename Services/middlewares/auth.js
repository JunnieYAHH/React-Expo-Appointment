const User = require("../models/user");

const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncError");
const dotenv = require('dotenv');
const path = require('path');

// Specify the correct path to the config.env file
const envPath = path.resolve(__dirname, '..', 'config', 'config.env');
// console.log(envPath)
dotenv.config({ path: envPath });
// console.log(process.env.JWT_SECRET)
// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    // console.log(authorizationHeader)

    if (!authorizationHeader) {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }

    const tokenWithBearer = authorizationHeader.split(' ')[1];
    const token = tokenWithBearer.replace(/^Bearer\s/, '');
    // console.log('Token:', token);

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return next(new ErrorHandler('Invalid token', 401));
    }

    if (!req.user) {
        return next(new ErrorHandler('User not found', 404));
    }

    next();
});

// Handling users roles
exports.authorizeRoles = () => {
    return (req, res, next) => {
        // console.log(req.user); // Log the req.user object
        if (!req.user || !req.user.isAdmin) {
            return next(
                new ErrorHandler(`User is not authorized to access this resource. Requires admin privileges.`,
                    403)
            );
        }
        next();
    };
};