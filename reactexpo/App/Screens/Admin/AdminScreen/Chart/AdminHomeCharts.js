import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AdminHomeHeader from '../../AdminHomeHeader';
import AdminChartAppointments from './AdminChartAppointments';
import AdminDoctorsPerServiceChart from './AdminDoctorsPerServiceChart';
import AdminRatingsOfDoctors from './AdminRatingsOfDoctors';

const AdminHomeCharts = () => {
    const [activeIndex, setActiveIndex] = useState(0)
    // const [currentUser, setCurrentUser] = useState([]);
    return (
        <View>
            <AdminHomeHeader />
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 5, textAlign: 'center' }}>
                <MaterialCommunityIcons name="chart-donut-variant" size={60} color="gray" />
                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>         Charts         </Text>
                <MaterialCommunityIcons name="chart-donut-variant" size={60} color="gray" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 5, textAlign: 'center' }}>
                <TouchableOpacity
                    style={[activeIndex == 0 ? styles.activeTab : styles.inActiveTab]}
                    onPress={() => setActiveIndex(0)}>
                    <Text style={[activeIndex == 0 ? styles.activeText : styles.inActiveText]} >Appointment</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[activeIndex == 1 ? styles.activeTab : styles.inActiveTab]}
                    onPress={() => setActiveIndex(1)}>
                    <Text style={[activeIndex == 1 ? styles.activeText : styles.inActiveText]} >DoctorsPerService</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[activeIndex == 2 ? styles.activeTab : styles.inActiveTab]}
                    onPress={() => setActiveIndex(2)}>
                    <Text style={[activeIndex == 2 ? styles.activeText : styles.inActiveText]} >DoctorRatings</Text>
                </TouchableOpacity>
            </View>
            {activeIndex === 0 && (
                <View style={{ padding: 15, marginLeft: 15 }} >
                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 24, fontWeight: 'bold', marginBottom: 30 }}>Appointment Status</Text>
                    <AdminChartAppointments />
                </View>
            )}
            {activeIndex === 1 && (
                <View style={{ marginTop: 2, marginLeft: 15 }} >
                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 24, fontWeight: 'bold', marginBottom: 30 }}>Doctors Per Service</Text>
                    <AdminDoctorsPerServiceChart />
                </View>
            )}
            {activeIndex === 2 && (
                <View style={{ padding: 15, marginLeft: 15 }} >
                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 24, fontWeight: 'bold', marginBottom: 30 }}>Clinic Ratings</Text>
                    <AdminRatingsOfDoctors />
                </View>
            )}
        </View>
    )
}

export default AdminHomeCharts

const styles = StyleSheet.create({
    activeText: {
        alignItems: 'center',
        color: '#0000FF',
        fontSize: 16,
        padding: 5,
    },
    inActiveText: {
        alignItems: 'center',
        color: 'gray',
        fontSize: 16,
        padding: 5,
    },
    activeTab: {
        borderBottomWidth: 1,
        borderBottomColor: '#0000FF',
        padding: 3,
    },
    inActiveTab: {
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        padding: 3,
    },
});