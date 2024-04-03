const express = require('express');
const router = express.Router();
const doctorController = require('../controller/doctorController');
const upload = require('../utils/multer')
const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/auth');


// Define routes related to user operations
router.post('/create-doctor', upload.array('images[]'), doctorController.createDoctor);
router.put('/update-doctor/:id', upload.array('images[]'), doctorController.updateDoctor);
router.get('/get-doctors', doctorController.getDoctors);
router.get('/get-all-doctors', doctorController.getAllDoctors);
router.get('/get-doctor-to-update', doctorController.getDoctorToUpdate);
router.get('/get-doctor-to-appoint', doctorController.getDoctorToAppoint);
router.get('/get-doctor-to-review', doctorController.getDoctorToReview);
router.get('/aggregated-ratings', doctorController.doctorAggregatedRatings);
router.put('/create-doctor-review', doctorController.createDoctorReview);
router.put('/update-doctor-review', doctorController.updateDoctorReview);
router.delete('/delete-doctor-review', doctorController.deleteDoctorReview);
router.delete('/delete-doctor/:id', doctorController.deleteDoctor);

module.exports = router;