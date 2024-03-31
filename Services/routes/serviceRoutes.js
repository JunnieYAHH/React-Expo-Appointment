const express = require('express');
const router = express.Router();
const serviceController = require('../controller/serviceController');
const upload = require('../utils/multer')
// const userMiddleware = require('../middlewares/auth')
const { authorizeRoles, isAuthenticatedUser } = require('../middlewares/auth');

// Define routes related to user operations
router.post('/create-service', upload.array('images[]'), serviceController.createService);
router.get('/get-services', serviceController.getServices);
router.get('/get-service-to-appoint', serviceController.getServiceToAppoint);
router.get('/get-admin-services', serviceController.getAllServicesAdmin);
router.put('/update-service/:id', upload.array('images[]'), serviceController.updateService);
router.delete('/delete-service/:id', serviceController.deleteService);

module.exports = router;