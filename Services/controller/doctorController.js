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
            const { name, email, gender, service } = req.body;

            const images = req.files;


            let imageData = []

            for (let i = 0; i < images.length; i++) {
                const imagePath = images[i].path;
                try {
                    const result = await cloudinary.uploader.upload(imagePath, {
                        folder: 'Clinic/doctors',
                        width: 150,
                        crop: 'scale'
                    });
                    // console.log('These are the uploaded images:', result);
                    imageData.push({ public_id: result.public_id, url: result.secure_url });
                } catch (error) {
                    console.log(error.message);
                }
            }


            const doctor = new Doctor({
                name,
                email,
                gender,
                service,
                image: imageData,
            });

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
    updateDoctorReview: async (req, res) => {
        // const { review_id, doctor_id } = req.params;
        const { comment, rating, review_id, doctor_id } = req.body;
    
        try {
            const doctor = await Doctor.findById(doctor_id);
    
            if (!doctor) {
                return res.status(404).json({ error: "Doctor not found" });
            }
    
            const reviewIndex = doctor.review.findIndex(review => review._id.toString() === review_id);
    
            if (reviewIndex === -1) {
                return res.status(404).json({ error: "Review not found" });
            }
    
            doctor.review[reviewIndex].comment = comment;
            doctor.review[reviewIndex].rating = rating;
    
            await doctor.save();
    
            return res.status(200).json({ message: "Review updated successfully", doctor });
        } catch (error) {
            console.error("Error updating review:", error);
            return res.status(500).json({ error: "Internal server error" });
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
    },
    getAllDoctors: async (req, res) => {
        try {
            const doctors = await Doctor.find()
            return res.status(200).json({ success: true, message: 'doctors fetch successfully', doctors });
        } catch (error) {
            console.error('Error Fetching all doctors:', error);
            res.status(500).json({ message: "Error fetching all doctors", error: error.message });
        }
    },
    deleteDoctor: async (req, res) => {
        try {
            // console.log(req.params.id)
            const doctor = await Doctor.findByIdAndDelete(req.params.id);
            if (!doctor) {
                return next(new ErrorHandler('Doctor not found', 404));
            }
            res.status(200).json({
                success: true,
                message: 'Doctor is Deleted.'
            })
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: 'Delete Doctor Server Error'
            });
        }
    },
    getDoctorToUpdate: async (req, res) => {
        try {
            const { doctorId } = req.query;
            let query = {};
            if (doctorId) {
                query = { '_id': doctorId };
            }

            const doctor = await Doctor.findById(query)
            res.status(201).json({ message: "Doctor fetch to update successfully", doctor });
        } catch (error) {
            console.error("Fetch Doctor To update:", error);
            res.status(500).json({ message: "Update Fetching Doctor Error" });
        }
    },
    updateDoctor: async (req, res) => {
        try {
            const { name, email, gender, service } = req.body;
            let doctor = await Doctor.findById(req.params.id);
            let images = req.files || [];

            for (let i = 0; i < doctor.image.length; i++) {
                // console.log(doctor.image[i].public_id);
                const result = await cloudinary.v2.uploader.destroy(doctor.image[i].public_id);
            }

            let imageData = []
            for (let i = 0; i < images.length; i++) {
                const imagePath = images[i].path;
                try {
                    const result = await cloudinary.uploader.upload(imagePath, {
                        folder: 'Clinic/doctors',
                        width: 150,
                        crop: 'scale'
                    });
                    // console.log('These are the uploaded images:', result);
                    imageData.push({ public_id: result.public_id, url: result.secure_url });
                } catch (error) {
                    console.log(error.message);
                }
            }

            doctor.name = name;
            doctor.email = email;
            doctor.gender = gender;
            doctor.service = service;

            if (imageData.length > 0) {
                doctor.image = imageData;
            }

            doctor = await Doctor.findByIdAndUpdate(req.params.id, doctor, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            });

            return res.status(200).json({
                success: true,
                doctor
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: 'Update Doctor Server Error'
            });
        }
    },
    doctorAggregatedRatings: async (req, res) => {
        try {
            const aggregatedRatings = await Doctor.aggregate([
                {
                    $unwind: "$review"
                },
                {
                    $group: {
                        _id: "$review.rating",
                        count: { $sum: 1 }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            res.json(aggregatedRatings);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
};

module.exports = doctorController;
