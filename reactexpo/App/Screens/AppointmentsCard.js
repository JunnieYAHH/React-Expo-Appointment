import { View, Text, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppointmentsCard = ({ appointment }) => {

    const [service, setService] = useState([])
    const [doctor, setDoctor] = useState([])

    // console.log(service)
    // console.log(doctor)

    useEffect(() => {
        fetchService();
        fetchDoctor();
    }, [doctor, service]);

    const fetchService = async () => {
        try {
            const response = await axios.get('http://192.168.100.47:8000/get-service-to-appoint', {
                // const response = await axios.get('http://192.168.137.190:8000/get-service-to-appoint', {
                params: {
                    serviceId: appointment.service
                }
            });
            setService(response.data.service);
        } catch (error) {
            console.error('Fetch Services Error:', error.message);
        }
    };

    const fetchDoctor = async () => {
        try {
            const response = await axios.get('http://192.168.100.47:8000/get-doctor-to-appoint', {
                // const response = await axios.get('http://192.168.137.190:8000/get-doctor-to-appoint', {
                params: {
                    doctorId: appointment.doctor
                }
            });
            setDoctor(response.data.doctor);
        } catch (error) {
            console.error('Fetch Services Error:', error.message);
        }
    };
    return (
        <View style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 30, borderRadius: 12 }}>
            <Text style={{ fontWeight: 'bold' }}>Date: {appointment.date} - {appointment.time}</Text>
            <View style={{ flexDirection: 'row' }}>
                {doctor && doctor.image && doctor.image.length > 0 && (
                    <Image
                        source={{ uri: doctor.image[0].url }}
                        style={{ width: 125, height: 150, borderRadius: 100 }}
                    />)}
            </View>
            {/* <Text style={{ fontWeight: 'bold' }}>Doctor: {appointment.doctor}</Text> */}
            <Text style={{ fontWeight: 'bold' }}>Service: {appointment.service}</Text>
            <Text style={{ fontWeight: 'bold' }}>Status: {appointment.status}</Text>
            <Text style={{ fontWeight: 'bold' }}>Note: {appointment.note}</Text>
        </View>
    );
};

export default AppointmentsCard;
