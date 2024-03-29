const Appointment = require('../models/appointment');
const User = require('../models/user');
const Doctor = require('../models/doctor');
const Service = require('../models/service');
const sendUserEmail = require('../utils/sendUserEmail')
const nodemailer = require('nodemailer');

const appointmentController = {
    // Register a new user
    createDoctorAppointment: async (req, res) => {
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
            let userinfo = {}
            let doctorinfo = {}
            let serviceinfo = {}
            if (req.body.userId) {
                userinfo = await User.findById(req.body.userId)
                doctorinfo = await Doctor.findById(req.body.doctorId)
                serviceinfo = await Service.findById(req.body.serviceId)
            }
            // console.log(userinfo)
            // console.log(doctorinfo)
            // console.log(serviceinfo)
            // console.log(appointment)

            const message = `
            <html>
            <head>
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  background-color: #f4f4f4;
                  padding: 20px;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                h2 {
                  color: #333333;
                }
                p {
                  color: #555555;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h2>User Appointment Notification</h2>
                <p>Dear Admin,</p>
                <p>A new user appointment has been requested. Here are the details:</p>
                <ul>
                <li><strong> <img src="${userinfo.image[0].url}" alt="User Image" style="max-width: 100px; max-height: 100px;"/></li>
                  <li><strong>User Email:</strong> ${userinfo.email} </li>
                  <li><strong>Transaction ID:</strong> ${userinfo.name} </li>
                  <li><strong>User Number:</strong> ${userinfo.phone} </li>
                </ul>
                <li><strong>Appointing in:</strong> ${serviceinfo.name} </li>
                <li><img src="${serviceinfo.image[0].url}" alt="Service Image" style="max-width: 100px; max-height: 100px;"/></li>
                <li><strong>Appointment Date:</strong> ${newAppointment.date} </li>
                  <li><strong>Appointment Time:</strong> ${newAppointment.time} </li>
                  <li><strong>Appointment Note:</strong> ${newAppointment.note} </li>
                  <li><strong>To Doctor: </strong> ${doctorinfo.name} ||  ${doctorinfo.email} </li>
                </ul>
                <p>Please review this appointment and ensure that all processes are good and successful.</p>
                <p>Thank you for your attention.</p>
                <p>Best regards,<br>Your E-commerce Team</p>
              </div>
            </body>
            </html>`;

            await sendUserEmail({
                email: `admin@clinic.com`,
                subject: 'User Appointment Transaction',
                message
            });

            const appointment = new Appointment(newAppointment)

            await appointment.save()

            res.status(200).json({ message: "Appointment created successfully", data: appointment });
        } catch (error) {
            console.log('cannot get the data')
        }
    },
    getUserAppointment: async (req, res) => {
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
    },
};

module.exports = appointmentController;
