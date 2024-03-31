const Doctor = require('../models/doctor');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'ds7jufrxl',
    api_key: '827497948387292',
    api_secret: 'qZygsilGaETbzQ5rnN8v-k8Ai4g',
})

const doctorController = {
    // Register a new user
    createDoctor: async (req, res) => {
        try {
            const { name, email, gender, service, image, review } = req.body;

            // Upload image to Cloudinary
            // const uploadedImage = await cloudinary.uploader.upload(image, { folder: 'doctors' });

            // Map the reviews array to properly format the reviews
            const reviews = review.map(item => ({
                rating: item.rating,
                comment: item.comment
            }));

            // Create new doctor instance
            const doctor = new Doctor({
                name,
                email,
                gender,
                service,
                // image: { public_id: uploadedImage.public_id, url: uploadedImage.secure_url },
                review: reviews
            });

            // Save doctor to database
            await doctor.save();

            res.status(201).json({ message: 'Doctor created successfully', doctor });
        } catch (error) {
            console.error('Error on Creating a Doctor: ', error.message);
            res.status(500).json({ message: 'Create a Doctor Error' });
        }
    },
    getDoctors: async (req, res) => {
        try {
            const { serviceId } = req.query;
            let query = {};
            if (serviceId) {
                query = { 'service': serviceId };
            }

            const doctors = await Doctor.find(query);
            // console.log(doctors)

            res.status(200).json({ message: "Doctors fetched successfully", doctors });
        } catch (error) {
            console.error("Fetch Doctors Error:", error);
            res.status(500).json({ message: "Fetch Doctors Error" });
        }
    },
    getDoctorToAppoint: async (req, res) => {
        try {
            const { doctorId } = req.query;
            let query = {};
            if (doctorId) {
                query = { '_id': doctorId };
            }
            // console.log(query);
            const doctor = await Doctor.findOne(query)

            res.status(201).json({ message: "Services fetch successfully", doctor });
        } catch (error) {
            console.error("Fetch Service Error:", error);
            res.status(500).json({ message: "Create Service Error" });
        }
    },
    getDoctorToReview: async (req, res) => {
        try {
            const { doctorId } = req.query;
            let query = {};
            if (doctorId) {
                query = { '_id': doctorId };
            }
            // console.log(query);
            const doctor = await Doctor.findOne(query)
            // console.log(appointment)
            res.status(200).json({ message: "Doctor to Review fetched successfully", doctor });
        } catch (error) {
            console.log('Error on Getting the Doctor to review', error.message);
            res.status(500).json({ message: "Error on Getting the Doctor to review", error: error.message });
        }
    },
    createDoctorReview: async (req, res) => {
        try {
            const { doctorId } = req.body;
            let newReview = {}
            if (req.body.userId) {
                newReview = ({
                    user: req.body.userId,
                    comment: req.body.comment,
                    rating: req.body.rating,

                });
            } else {
                newReview = ({
                    user: req.body.googleId,
                    comment: req.body.comment,
                    rating: req.body.rating,
                });
            }

            const doctor = await Doctor.findById(doctorId);

            // console.log('The doctor', doctor)
            // console.log('The Review', newReview)

            doctor.review.push(newReview);

            // console.log('The doctor new review', doctor)
            await doctor.save();

            res.status(201).json({ message: "Review added successfully", doctor });
        } catch (error) {
            console.error('Error adding review:', error);
            res.status(500).json({ message: "Error adding review", error: error.message });
        }
    },
    deleteDoctorReview: async (req, res) => {
        try {
            const { doctor_id, review_id } = req.query;
            // console.log(doctor_id)
            // console.log('review', review_id)

            const doctor = await Doctor.findById(doctor_id)
            // console.log('doctor', doctor)
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }

            doctor.review = doctor.review.filter(review => review._id.toString() !== review_id);

            await doctor.save();
            return res.status(200).json({ success: true, message: 'Comment deleted successfully' });
        } catch (error) {
            console.error('Error deleting review:', error);
            res.status(500).json({ message: "Error deleting review", error: error.message });
        }
    }
};

module.exports = doctorController;
