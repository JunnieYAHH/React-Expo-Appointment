import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import AdminHomeNavigation from './AdminHomeNavigation';

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
                            <FontAwesome5 name="home" size={20} color={color} />
                        )
                    }}
                />
            </Tab.Navigator>
        </SafeAreaView>
    )
}

export default AdminTabNavigation