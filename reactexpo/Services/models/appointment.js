const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, "Donor Email is Required"]
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctor",
    },
    status: {
        type: String,
        defaultValue: 'pending',
    }
}, { timestamps: true });

module.exports = mongoose.model('appointment ', appointmentSchema)