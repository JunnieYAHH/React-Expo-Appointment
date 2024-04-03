import { View, Text, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import baseURL from '../../../../../assets/common/baseURL';
import { BarChart } from 'react-native-chart-kit';

const AdminDoctorsPerServiceChart = () => {
    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`,
                    }
                };

                const doctorsResult = await axios.get(`${baseURL}/doctors/get-all-doctors`, config);
                setDoctors(doctorsResult.data.doctors);

                const servicesResult = await axios.get(`${baseURL}/services/get-admin-services`, config);
                setServices(servicesResult.data.services);
            } catch (error) {
                console.log(error.message);
            }
        };

        fetchData();
    }, []);

    const doctorsPerService = services.map(service => {
        const doctorsCount = doctors.filter(doctor => doctor.service === service._id).length;
        return { name: service.name, doctorsCount };
    });

    const data = {
        labels: doctorsPerService.map(item => item.name),
        datasets: [
            {
                data: doctorsPerService.map(item => item.doctorsCount)
            }
        ]
    };

    return (
        <View style={styles.container}>
            <Text>AdminDoctorsPerServiceChart</Text>
            <View style={styles.chartContainer}>
                <BarChart
                    data={data}
                    width={350}
                    height={400}
                    yAxisLabel=""
                    verticalLabelRotation={90}
                    horizontal={true}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        barPercentage: 0.5, // Adjust the width of the bars
                        propsForLabels: {
                            fontSize: 7, // Set the font size for labels
                        },
                    }}
                    style={{
                        marginVertical: 8,
                        borderRadius: 16,
                    }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 1,
    },
    chartContainer: {
        width: '100%',
        height: '100',
        alignItems: 'center',
        marginRight: 15,
        borderWidth: 1
    },
});

export default AdminDoctorsPerServiceChart;
