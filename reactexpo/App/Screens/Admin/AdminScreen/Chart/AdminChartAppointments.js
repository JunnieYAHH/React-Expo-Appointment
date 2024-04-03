import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import baseURL from '../../../../../assets/common/baseURL'
import { PieChart } from 'react-native-chart-kit';

const AdminChartAppointments = () => {

    const [appointments, setAppointments] = useState([])

    useEffect(() => {
        const getAllAppointments = async () => {
            try {
                const token = AsyncStorage.getItem('authToken')

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }

                const result = await axios.get(`${baseURL}/appointments/get-all-appointments`, config)
                setAppointments(result.data.appointments)
            } catch (error) {
                console.log('Error on getting appointments in the chart', error.message)
                Alert.alert('Cant get all the appoinments')
            }
        }
        getAllAppointments()
    }, [])

    // console.log(appointments)

    // Count the number of appointments for each status
    const statusCounts = appointments.reduce((acc, curr) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
    }, {});

    // Extract data for the pie chart
    const data = Object.keys(statusCounts).map(status => ({
        name: status,
        count: statusCounts[status],
        color: status === 'pending' ? '#FFC107' :
            status === 'accepted' ? '#4CAF50' :
                status === 'completed' ? '#2196F3' : '#F44336'
    }));

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Appointment Status Distribution</Text>
            <View style={styles.chartContainer}>
                <PieChart
                    data={data}
                    width={300}
                    height={200}
                    chartConfig={{
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                    }}
                    accessor="count"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
            </View>
        </View>
    )
}

export default AdminChartAppointments
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