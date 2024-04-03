const Appointment = require('../models/appointment');
const User = require('../models/user');
const Doctor = require('../models/doctor');
const Service = require('../models/service');
const sendUserEmail = require('../utils/sendUserEmail')
const nodemailer = require('nodemailer');

const appointmentController = {
  //  For create an appointment in the backend
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
      if (req.body.userId) {
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
                  <p>Best regards,<br>Your Loyal Customer</p>
                </div>
              </body>
              </html>`;

        await sendUserEmail({
          sender: userinfo.email,
          receiver: `admin@clinic.com`,
          subject: 'Admin Appointment TransactionL Request',
          message
        });
      }


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
  getPendingAppointments: async (req, res) => {
    try {

      const pendingAppointment = await Appointment.find({ status: 'pending' });

      res.status(200).json({ message: "Pending Appointment Fetch successfully", pendingAppointment });
    } catch (error) {
      console.log('Error on Getting the Pending Appointments', error.message);
      res.status(500).json({ message: "Error fetching ending appointments", error: error.message });
    }
  },
  getAcceptedAppointments: async (req, res) => {
    try {

      const acceptedAppointment = await Appointment.find({ status: 'accepted' });

      res.status(200).json({ message: "Pending Appointment Fetch successfully", acceptedAppointment });
    } catch (error) {
      console.log('Error on Getting the Pending Appointments', error.message);
      res.status(500).json({ message: "Error fetching ending appointments", error: error.message });
    }
  },
  getDeclinedAppointments: async (req, res) => {
    try {

      const declinedAppointment = await Appointment.find({ status: 'declined' });

      res.status(200).json({ message: "Declined Appointment Fetch successfully", declinedAppointment });
    } catch (error) {
      console.log('Error on Getting the Declined Appointments', error.message);
      res.status(500).json({ message: "Error fetching Declined appointments", error: error.message });
    }
  },
  getCompletedAppointments: async (req, res) => {
    try {

      const declinedAppointment = await Appointment.find({ status: 'completed' });

      res.status(200).json({ message: "Declined Appointment Fetch successfully", declinedAppointment });
    } catch (error) {
      console.log('Error on Getting the Declined Appointments', error.message);
      res.status(500).json({ message: "Error fetching Declined appointments", error: error.message });
    }
  },
  acceptAppointment: async (req, res) => {
    try {
      const { id } = req.params;

      const appointmentData = await Appointment.findById(id);

      // console.log('Appointment user id', appointment.user)

      const user = await User.findById(appointmentData.user)
      const service = await Service.findById(appointmentData.service)
      const doctor = await Doctor.findById(appointmentData.doctor)

      console.log(user)

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
          <p>Dear User,</p>
          <p>Your appointment has been now accepted. Here are the details:</p>
          <ul>
          <li><strong> <img src="${user.image[0].url}" alt="User Image" style="max-width: 100px; max-height: 100px;"/></li>
            <li><strong>User Email:</strong> ${user.email} </li>
            <li><strong>Transaction ID:</strong> ${user.name} </li>
            <li><strong>User Number:</strong> ${user.phone} </li>
          </ul>
          <li><strong>Appointing in:</strong> ${service.name} </li>
          <li><img src="${service.image[0].url}" alt="Service Image" style="max-width: 100px; max-height: 100px;"/></li>
          <li><strong>Appointment Date:</strong> ${appointmentData.date} </li>
            <li><strong>Appointment Time:</strong> ${appointmentData.time} </li>
            <li><strong>Appointment Note:</strong> ${appointmentData.note} </li>
            <li><strong>To Doctor: </strong> ${doctor.name} ||  ${doctor.email} </li>
          </ul>
          <p>Please review this appointment and ensure that all processes are good and successful.</p>
          <p>Thank you for your attention.</p>
          <p>Best regards,<br>Your Lovely Clinic</p>
        </div>
      </body>
      </html>`;

      await sendUserEmail({
        sender: `admin@clinic.com`,
        receiver: user.email,
        subject: 'User Appointment Notification: Accepted',
        message
      });


      const AppointmentStatus = {
        status: 'accepted',
      };
      const appointment = await Appointment.findByIdAndUpdate(id, AppointmentStatus, {
        new: true,
      });
      res.status(200).json({ message: "Pending Appointment Was Accepted", appointment });
    } catch (error) {
      console.log('Error on Accepting the Pending Appointments', error.message);
      res.status(500).json({ message: "Error Accepting Pending Appointments", error: error.message });
    }
  },
  declineAppointment: async (req, res) => {
    try {
      const { id } = req.params;


      const appointmentData = await Appointment.findById(id);

      // console.log('Appointment user id', appointment.user)

      const user = await User.findById(appointmentData.user)
      const service = await Service.findById(appointmentData.service)
      const doctor = await Doctor.findById(appointmentData.doctor)

      console.log(user)

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
          <p>Dear User,</p>
          <p>Your appointment has been Declined. Here are the details:</p>
          <ul>
          <li><strong> <img src="${user.image[0].url}" alt="User Image" style="max-width: 100px; max-height: 100px;"/></li>
            <li><strong>User Email:</strong> ${user.email} </li>
            <li><strong>Transaction ID:</strong> ${user.name} </li>
            <li><strong>User Number:</strong> ${user.phone} </li>
          </ul>
          <li><strong>Appointing in:</strong> ${service.name} </li>
          <li><img src="${service.image[0].url}" alt="Service Image" style="max-width: 100px; max-height: 100px;"/></li>
          <li><strong>Appointment Date:</strong> ${appointmentData.date} </li>
            <li><strong>Appointment Time:</strong> ${appointmentData.time} </li>
            <li><strong>Appointment Note:</strong> ${appointmentData.note} </li>
            <li><strong>To Doctor: </strong> ${doctor.name} ||  ${doctor.email} </li>
          </ul>
          <p>We are sorry for the inconvenient we may implied. There are maybe a conflictiong schedule.</p>
          <p>Regardless, we will be thankful and help you more in the future</p>
          <p>Thank you for your attention.</p>
          <p>Best regards,<br>Your Lovely Clinic</p>
        </div>
      </body>
      </html>`;

      await sendUserEmail({
        sender: `admin@clinic.com`,
        receiver: user.email,
        subject: 'User Appointment Notification: Declined',
        message
      });

      const AppointmentStatus = {
        status: 'declined',
      };

      const appointment = await Appointment.findByIdAndUpdate(id, AppointmentStatus, {
        new: true,
      });
      res.status(200).json({ message: "Pending Appointment Was Declined", appointment });
    } catch (error) {
      console.log('Error on Declining the Pending Appointments', error.message);
      res.status(500).json({ message: "Error Declining Pending Appointments", error: error.message });
    }
  },
  completeAppointment: async (req, res) => {
    try {
      const { id } = req.params;

      const appointmentData = await Appointment.findById(id);

      // console.log('Appointment user id', appointment.user)

      const user = await User.findById(appointmentData.user)
      const service = await Service.findById(appointmentData.service)
      const doctor = await Doctor.findById(appointmentData.doctor)

      console.log(user)

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
          <p>Dear User,</p>
          <p>We are more delight for your trust for our Lovely Clinic, Here are the details:</p>
          <ul>
          <li><strong> <img src="${user.image[0].url}" alt="User Image" style="max-width: 100px; max-height: 100px;"/></li>
            <li><strong>User Email:</strong> ${user.email} </li>
            <li><strong>Transaction ID:</strong> ${user.name} </li>
            <li><strong>User Number:</strong> ${user.phone} </li>
          </ul>
          <li><strong>Appointing in:</strong> ${service.name} </li>
          <li><img src="${service.image[0].url}" alt="Service Image" style="max-width: 100px; max-height: 100px;"/></li>
          <li><strong>Appointment Date:</strong> ${appointmentData.date} </li>
            <li><strong>Appointment Time:</strong> ${appointmentData.time} </li>
            <li><strong>Appointment Note:</strong> ${appointmentData.note} </li>
            <li><strong>To Doctor: </strong> ${doctor.name} ||  ${doctor.email} </li>
          </ul>
          <p>We are thankful for the You Dear User</p>
          <p>Thank you for your attention.</p>
          <p>Best regards,<br>Your Lovely Clinic</p>
        </div>
      </body>
      </html>`;

      await sendUserEmail({
        sender: `admin@clinic.com`,
        receiver: user.email,
        subject: 'User Appointment Notification: Complete',
        message
      });

      const AppointmentStatus = {
        status: 'completed',
      };

      const appointment = await Appointment.findByIdAndUpdate(id, AppointmentStatus, {
        new: true,
      });
      res.status(200).json({ message: "Process Appointment Was Completed", appointment });
    } catch (error) {
      console.log('Error on Completing the Accepted Appointment', error.message);
      res.status(500).json({ message: "Error Completing the Accepted Appointment", error: error.message });
    }
  },
  deleteAppointment: async (req, res) => {
    try {
      const { id } = req.params;

      const appointment = await Appointment.findByIdAndDelete(id);
      res.status(200).json({ message: " Appointment Was Deleted", appointment });
    } catch (error) {
      console.log('Error on Deleted The Appointment', error.message);
      res.status(500).json({ message: "Error Deleted Appointment", error: error.message });
    }
  }
};

module.exports = appointmentController;