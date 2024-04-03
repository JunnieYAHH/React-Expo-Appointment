const express = require('express');
const router = express.Router();
const appointmentController = require('../controller/appointmentController');
const upload = require('../utils/multer')

// Define routes related to user operations
router.post('/create-doctor-appointment', appointmentController.createDoctorAppointment);
router.get('/get-user-appointment', appointmentController.getUserAppointment);
router.get('/get-pending-appointments', appointmentController.getPendingAppointments);
router.get('/get-accepted-appointments', appointmentController.getAcceptedAppointments);
router.get('/get-declined-appointments', appointmentController.getDeclinedAppointments);
router.get('/get-completed-appointments', appointmentController.getCompletedAppointments);
router.put('/accept-appointment/:id', appointmentController.acceptAppointment);
router.put('/decline-appointment/:id', appointmentController.declineAppointment);
router.put('/complete-appointment/:id', appointmentController.completeAppointment);
router.delete('/delete-appointment/:id', appointmentController.deleteAppointment);
router.get('/get-all-appointments', appointmentController.getAllAppointment);

module.exports = router;