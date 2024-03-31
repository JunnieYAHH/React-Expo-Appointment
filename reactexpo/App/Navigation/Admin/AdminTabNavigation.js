import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import AdminHomeNavigation from './AdminHomeNavigation';
import ManageAppointment from '../../Screens/Admin/AdminScreen/Appointment/ManageAppointment';
import AdminProfile from '../../Screens/Admin/AdminProfile';
import AdminAppointmentNavigation from './AdminAppointmentNavigation';
import { FontAwesome } from '@expo/vector-icons';


const Tab = createBottomTabNavigator()

const AdminTabNavigation = () => {

    return (
        <SafeAreaView style={{ flex: 1 }}>

            <Tab.Navigator screenOptions={{
                headerShown: false
            }}>
                <Tab.Screen name='Dashboard' component={AdminHomeNavigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="dashboard" size={24} color={color} />)
                    }}
                />
                <Tab.Screen name='Appointment' component={AdminAppointmentNavigation}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <FontAwesome name="list-alt" size={24} color="black" />)
                    }}
                />
                <Tab.Screen name='Profile' component={AdminProfile}
                    options={{
                        tabBarIcon: ({ color, size }) => (
                            <MaterialIcons name="admin-panel-settings" size={20} color="black" />)
                    }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    )
}

export default AdminTabNavigation