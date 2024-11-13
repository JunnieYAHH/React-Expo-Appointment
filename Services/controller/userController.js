const User = require('../models/user');
const Doctor = require('../models/doctor');
const Appointment = require('../models/appointment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary');
const crypto = require('crypto');


const userController = {
    // Register a new user
    register: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            req.body.password = hashedPassword

            // const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

            // Get the URL of the uploaded image from req.file
            const imageUrl = req.file.path;
            // console.log(imageUrl)

            // Upload image to Cloudinary
            const result = await cloudinary.uploader.upload(imageUrl, {
                folder: 'Clinic/users',
                width: 150,
                crop: "scale"
            });

            // Create a new user object with the Cloudinary URL
            let user = new User({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: req.body.password,
                isAdmin: req.body.isAdmin,
                image: { public_id: result.public_id, url: result.secure_url }
            });

            // console.log(user)
            user = await user.save();
            return res.status(201).json({
                success: true,
                message: 'User Registered Successfully',
                user
            })

        } catch (error) {
            console.log(error)
            res.status(500).json({
                success: false,
                message: 'Error in Register API',
                error
            })
        }
    },

    // Login user
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: 'Invalid Email or Password' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid Password' });
            }

            const token = jwt.sign({ userId: user._id }, secretKey);
            res.status(200).json({ token, user });
        } catch (error) {
            console.error("Login Error:", error); // Add this line to log the error
            res.status(500).json({ message: "Login Error" });
        }
    },

    getUser: async (req, res) => {
        try {
            const { userId } = req.query;
            let query = {};
            if (userId) {
                query = { '_id': userId };
            }
            const user = await User.findById(query);
            console.log(user)

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ user });
        } catch (error) {
            console.error('Error fetching user:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    // Get current user
    getCurrentUser: async (req, res) => {
        try {
            const { user_id } = req.query;
            let query = {};
            if (user_id) {
                query = { '_id': user_id };
            }
            const user = await User.findById(query)
            // console.log(user);

            res.status(201).json({ message: "Current User fetch successfully", user });
        } catch (error) {
            console.error("Fetch User Error:", error);
            res.status(500).json({ message: "Get Current User Error" });
        }
    },

    // Get current user appointment
    getCurrentUserAppointment: async (req, res) => {
        try {
            const { user } = req.query;
            // console.log('User ID', user);

            // Find appointments for the specified user
            const appointment = await Appointment.find({ user: user });
            // console.log(appointment)

            res.status(200).json({ message: "Appointments fetched successfully", appointment });
        } catch (error) {
            console.log('Error on Getting the User Appointment', error.message);
            res.status(500).json({ message: "Error fetching appointments", error: error.message });
        }
    },

    getAllUser: async (req, res, next) => {
        try {
            const users = await User.find()

            res.status(200).json({ message: "User fetched successfully", users });
        } catch (error) {
            console.log('Error on Getting All User ', error.message);
            res.status(500).json({ message: "Error fetching Users", error: error.message });
        }
    },
    updateUser: async (req, res) => {
        try {
            const { _id, name, email, phone, isAdmin } = req.body
            // console.log(req.body);
            let user = await User.findById({ "_id": _id });

            const imageUrl = req.file.path;
            // console.log('reqbody',req.body)
            // console.log('user',user)
            // console.log('image',imageUrl)

            const resultDelete = await cloudinary.v2.uploader.destroy(user.image[0].public_id);

            const result = await cloudinary.uploader.upload(imageUrl, {
                folder: 'Clinic/users',
                width: 150,
                crop: "scale"
            });

            user.name = name;
            user.email = email;
            user.phone = phone;
            user.isAdmin = isAdmin;
            user.image = { public_id: result.public_id, url: result.secure_url };

            user = await User.findByIdAndUpdate(_id, user, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            });

            return res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: 'Update User Server Error'
            });
        }
    }
};

module.exports = userController;
