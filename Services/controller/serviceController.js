const Service = require('../models/service');
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'ds7jufrxl',
    api_key: '827497948387292',
    api_secret: 'qZygsilGaETbzQ5rnN8v-k8Ai4g',
})

const serviceController = {
    // Register a new user
    createService: async (req, res) => {
        try {
            const { name, description } = req.body;

            const images = req.files;

            let imageData = []

            for (let i = 0; i < images.length; i++) {
                const imagePath = images[i].path;
                try {
                    const result = await cloudinary.uploader.upload(imagePath, {
                        folder: 'Clinic/services',
                        width: 150,
                        crop: 'scale'
                    });
                    // console.log('These are the uploaded images:', result);
                    imageData.push({ public_id: result.public_id, url: result.secure_url });
                } catch (error) {
                    console.log(error.message);
                }
            }

            console.log(imageData)

            const service = new Service({
                name,
                description,
                image: imageData,
            });

            // console.log('This is the service', service)

            await service.save();

            res.status(201).json({ message: "Service created successfully", service });
        } catch (error) {
            console.error("Create Service Error:", error);
            res.status(500).json({ message: "Create Service Error" });
        }
    },
    getServices: async (req, res) => {
        try {
            const services = await Service.find()
            // console.log(services)
            res.status(201).json({ message: "Services fetch successfully", services });
        } catch (error) {
            console.error("Fetch All Service Error:", error.message);
            res.status(500).json({ message: "Create Service Error" });
        }
    },
    getServiceToAppoint: async (req, res) => {
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
            console.error("Fetch Service To Appoint:", error);
            res.status(500).json({ message: "Create Service Error" });
        }
    },
    getAllServicesAdmin: async (req, res) => {
        try {
            const services = await Service.find()
            // console.log(services)
            res.status(201).json({ message: "Admin Services fetch successfully", services });
        } catch (error) {
            console.error("Fetch All Service Error:", error.message);
            res.status(500).json({ message: "Create Service Error" });
        }
    },
    updateService: async (req, res) => {
        try {
            const { name, description } = req.body;
            let service = await Service.findById(req.params.id);
            let images = req.files || [];

            for (let i = 0; i < service.image.length; i++) {
                // console.log(service.image[i].public_id);
                const result = await cloudinary.v2.uploader.destroy(service.image[i].public_id);
            }

            let imageData = []
            for (let i = 0; i < images.length; i++) {
                const imagePath = images[i].path;
                try {
                    const result = await cloudinary.uploader.upload(imagePath, {
                        folder: 'Clinic/services',
                        width: 150,
                        crop: 'scale'
                    });
                    // console.log('These are the uploaded images:', result);
                    imageData.push({ public_id: result.public_id, url: result.secure_url });
                } catch (error) {
                    console.log(error.message);
                }
            }

            service.name = name;
            service.description = description;

            if (imageData.length > 0) {
                service.image = imageData;
            }

            service = await Service.findByIdAndUpdate(req.params.id, service, {
                new: true,
                runValidators: true,
                useFindAndModify: false
            });

            return res.status(200).json({
                success: true,
                service
            });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({
                success: false,
                message: 'Update Service Server Error'
            });
        }
    },
    deleteService: async (req, res) => {
        try {
            // console.log(req.params.id)
            const service = await Service.findByIdAndDelete(req.params.id);
            if (!service) {
                return next(new ErrorHandler('Product not found', 404));
            }
            res.status(200).json({
                success: true,
                message: 'Service is Deleted.'
            })
        } catch (error) {

        }
    }
};

module.exports = serviceController;
