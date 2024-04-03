const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const upload = require('../utils/multer')
// const userMiddleware = require('../middlewares/userMiddleware')

// Define routes related to user operations
router.post('/register', upload.single('image'), userController.register);
router.put('/update-user', upload.single('image'), userController.updateUser);
router.post('/login', userController.login);
router.get('/get-user', userController.getUser);
router.get('/get-current-user', userController.getCurrentUser);
router.get('/get-user-appointment', userController.getCurrentUserAppointment);
router.get('/get-all-users', userController.getAllUser);

module.exports = router;