const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        email: {
            type: String,
            required: [true, "email is required"],
            unique: true,
        },
        phone: {
            type: String,
            required: [true, "Phone is requied"],
        },
        password: {
            type: String,
            required: [true, "password is requied"],
        },
        isAdmin: {
            type: String,
            default: 'user'
        },
        address: {
            type: String,
        },
        phone: {
            type: String,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);