import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import AdminHome from '../../Screens/Admin/AdminHome';
import ServiceCreate from '../../Screens/Admin/AdminScreen/Services/ServiceCreate';
import ServiceUpdate from '../../Screens/Admin/AdminScreen/Services/ServiceUpdate';

const Stack = createStackNavigator();

const AdminHomeNavigation = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name='AdminHome' component={AdminHome} />
            <Stack.Screen name='ServiceCreate' component={ServiceCreate} />
            <Stack.Screen name='ServiceUpdate' component={ServiceUpdate} />
        </Stack.Navigator>
    )
}

export default AdminHomeNavigation

const styles = StyleSheet.create({})