import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import ServiceCreate from '../../Screens/Admin/AdminScreen/Services/ServiceCreate';
import ServiceUpdate from '../../Screens/Admin/AdminScreen/Services/ServiceUpdate';
import DoctorCreate from '../../Screens/Admin/AdminScreen/Doctors/DoctorCreate';
import DoctorUpdate from '../../Screens/Admin/AdminScreen/Doctors/DoctorUpdate';
import AdminServices from '../../Screens/Admin/AdminScreen/Services/AdminServices';
import AdminDoctor from '../../Screens/Admin/AdminScreen/Doctors/AdminDoctor';
import AdminHomeCharts from '../../Screens/Admin/AdminScreen/Chart/AdminHomeCharts';

const Stack = createStackNavigator();

const AdminHomeNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name='AdminHomeCharts' component={AdminHomeCharts} />
            <Stack.Screen name='AdminServices' component={AdminServices} />
            <Stack.Screen name='ServiceCreate' component={ServiceCreate} />
            <Stack.Screen name='ServiceUpdate' component={ServiceUpdate} />
            <Stack.Screen name='AdminDoctors' component={AdminDoctor} />
            <Stack.Screen name='DoctorCreate' component={DoctorCreate} />
            <Stack.Screen name='DoctorUpdate' component={DoctorUpdate} />
        </Stack.Navigator>
    )
}

export default AdminHomeNavigation

const styles = StyleSheet.create({})