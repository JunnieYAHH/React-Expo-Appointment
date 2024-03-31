import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
// import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import AdminHome from '../../Screens/Admin/AdminHome';
import ServiceCreate from '../../Screens/Admin/AdminScreen/Services/ServiceCreate';
import ServiceUpdate from '../../Screens/Admin/AdminScreen/Services/ServiceUpdate';

const Stack = createStackNavigator();
// const Drawer = createDrawerNavigator();

const AdminHomeNavigation = () => {

    // const CustomDrawerContent = (props) => {
    //     return (
    //         <DrawerContentScrollView {...props}>
    //             <DrawerItemList {...props} />
    //             <DrawerItem label="Logout" onPress={handleLogout} />
    //         </DrawerContentScrollView>

    //     );
    // };

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} >
            <Stack.Screen name='AdminHome' component={AdminHome} />
            <Stack.Screen name='ServiceCreate' component={ServiceCreate} />
            <Stack.Screen name='ServiceUpdate' component={ServiceUpdate} />
            {/* <Stack.Screen name='clinic-service-screen' component={ClinicServiceScreen} />
            <Stack.Screen name='book-appointment-now' component={BookAppointment} />
            <Stack.Screen name='ReviewDoctor' component={ReviewDoctor} /> */}
        </Stack.Navigator>
        // <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />}>
        //     <Drawer.Screen name="AdminDashboard" component={AdminDashboard} />
        // </Drawer.Navigator>
    )
}

export default AdminHomeNavigation

const styles = StyleSheet.create({})