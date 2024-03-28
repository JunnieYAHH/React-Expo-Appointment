const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const multer = require('multer');

// const FILE_TYPE_MAP = {
//     'image/png': 'png',
//     'image/jpeg': 'jpeg',
//     'image/jpg': 'jpg'
// };

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const isValid = FILE_TYPE_MAP[file.mimetype];
//         let uploadError = new Error('invalid image type');

//         if (isValid) {
//             uploadError = null;
//         }
//         cb(uploadError, 'public/uploads');
//     },
//     filename: function (req, file, cb) {
//         const fileName = file.originalname.split(' ').join('-');
//         const extension = FILE_TYPE_MAP[file.mimetype];
//         cb(null, `${fileName}-${Date.now()}.${extension}`);
//     }
// });

// const uploadOptions = multer({ storage: storage });

const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

mongoose
    .connect("mongodb+srv://gerelitopuyos:gerelitopuyos@atlascluster.7cyczkf.mongodb.net/ClinicAppointment?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("error connecting to MongoDB", err)
    });

app.listen(port, () => {
    console.log("Server is running on port " + port)
});


const User = require('./models/user');
const bcrypt = require('bcryptjs');

const upload = require('./utils/multer')
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'ds7jufrxl',
    api_key: '827497948387292',
    api_secret: 'qZygsilGaETbzQ5rnN8v-k8Ai4g',
})

//endpoint to register in the app
app.post("/register", upload.single('image'), async (req, res) => {
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

        console.log(user)
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
})



//endpoint to login in the app
const generateSecretKey = () => {
    const secretKey = crypto.randomBytes(32).toString("hex");
    return secretKey
}
const secretKey = generateSecretKey()


////////////////
// Login User //
////////////////

app.post('/login', async (req, res) => {
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
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Login Error" });
    }
});


//////////////////////
// Get Current User //
//////////////////////

app.get('/get-current-user', async (req, res) => {
    try {
        const { user_id } = req.query;
        let query = {};
        if (user_id) {
            query = { '_id': user_id };
        }
        // console.log(query);
        const user = await User.findOne(query)

        res.status(201).json({ message: "Current User fetch successfully", user });
    } catch (error) {
        console.error("Fetch User Error:", error);
        res.status(500).json({ message: "Get Current User Error" });
    }
})

///////////////////
// CreateService //
///////////////////

const Service = require('./models/service');

app.post('/create-service', upload.single('image'), async (req, res) => {
    try {
        const { name, doctor, date, description } = req.body;

        // Upload image to Cloudinary
        // const imageData = [];
        // const result = await cloudinary.uploader.upload(req.file.path, {
        //     folder: 'Clinic/services',
        //     width: 150,
        //     crop: "scale"
        // });
        // imageData.push({ public_id: result.public_id, url: result.secure_url });

        // Create a new service
        const service = new Service({
            name,
            doctor,
            date,
            description,
            // images: imageData,
        });

        // Save service to the database
        await service.save();

        // Return success response
        res.status(201).json({ message: "Service created successfully", service });
    } catch (error) {
        console.error("Create Service Error:", error);
        res.status(500).json({ message: "Create Service Error" });
    }
});

////////////////////////
// Fetch All services //
////////////////////////

app.get('/get-services', async (req, res) => {
    try {
        const services = await Service.find()

        res.status(201).json({ message: "Services fetch successfully", services });
    } catch (error) {
        console.error("Fetch Service Error:", error);
        res.status(500).json({ message: "Create Service Error" });
    }
})


///////////////////////////////////////////
// Fetch The Service You want to Appoint //
///////////////////////////////////////////

app.get('/get-service-to-appoint', async (req, res) => {
    try {
        const { serviceId } = req.query;
        let query = {};
        if (serviceId) {
            query = { '_id': serviceId };
        }
        // console.log(query);
        const service = await Service.findOne(query)

        res.status(201).json({ message: "Services fetch successfully", service });
    } catch (error) {
        console.error("Fetch Service Error:", error);
        res.status(500).json({ message: "Create Service Error" });
    }
})



//////////////////////
// Create A Doctor //
/////////////////////

const Doctor = require('./models/doctor')

app.post('/create-doctor', async (req, res) => {
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
})

///////////////////////
// Fetch All Doctors //
///////////////////////

app.get('/get-doctors', async (req, res) => {
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
});


//////////////////////////////////////////
// Fetch The Doctor You want to Appoint //
//////////////////////////////////////////
app.get('/get-doctor-to-appoint', async (req, res) => {
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
})

///////////////////////////////
// Create the Appoint of user//
///////////////////////////////
const Appointment = require('./models/appointment')

app.post('/create-doctor-appointment', async (req, res) => {
    try {
        const data = req.body;
        let newAppointment = {}
        if (req.body.userId) {
            newAppointment = ({
                user: req.body.userId,
                email: req.body.email,
                date: req.body.date,
                time: req.body.time,
                note: req.body.note,
                doctor: req.body.doctorId,
                service: req.body.serviceId,
                status: 'pending'
            });
        } else {
            newAppointment = ({
                user: req.body.googleId,
                email: req.body.googleEmail,
                date: req.body.date,
                time: req.body.date,
                note: req.body.note,
                doctor: req.body.doctorId,
                service: req.body.serviceId,
                status: 'pending'
            });
        }

        // console.log(newAppointment)

        const appointment = new Appointment(newAppointment)

        await appointment.save()
        console.log(appointment)

        res.status(200).json({ message: "Appointment created successfully", data: appointment });
    } catch (error) {
        console.log('cannot get the data')
    }
})

////////////////////////////
// Get the Appoint of user//
////////////////////////////

app.get('/get-user-appointment', async (req, res) => {
    try {
        const { user } = req.query;
        console.log('User ID', user);

        // Find appointments for the specified user
        const appointment = await Appointment.find({ user: user });
        console.log(appointment)

        res.status(200).json({ message: "Appointments fetched successfully", appointment });
    } catch (error) {
        console.log('Error on Getting the User Appointment', error.message);
        res.status(500).json({ message: "Error fetching appointments", error: error.message });
    }
});