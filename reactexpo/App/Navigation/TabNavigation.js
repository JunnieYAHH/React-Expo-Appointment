import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Home from '../Screens/Home'
import Appointment from '../Screens/Appointment'
import Profile from '../Screens/Profile'
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const Tab=createBottomTabNavigator()
export default function TabNavigation() {
  return (
    <Tab.Navigator screenOptions={{
        headerShown:false
    }}>
        <Tab.Screen name='Home' component={Home}
            options={{
                tabBarIcon:({ color, size})=>(
                    <FontAwesome5 name="home" size={20} color={color} />
                )
            }}
        />
        <Tab.Screen name='Appointment' component={Appointment}
           options={{
            tabBarIcon:({color,size})=>(
                <Ionicons name="calendar" size={24} color={color} />
            )
        }} 
        />
        <Tab.Screen name='Profile' component={Profile} 
         options={{
            tabBarIcon:({color,size})=>(
                <FontAwesome5 name="user-circle" size={24} color={color} />
            )
        }}
        />
    </Tab.Navigator>
  )
}