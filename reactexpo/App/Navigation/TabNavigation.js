import { View, Text, SafeAreaView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Appointment from '../Screens/Appointment'
import Profile from '../Screens/Profile'
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import HomeNavigation from './HomeNavigation'
import AppointmentNavigation from './AppointmentNavigation'
import AdminHomeNavigation from './Admin/AdminHomeNavigation'

const Tab = createBottomTabNavigator()
export default function TabNavigation() {
    return (
            <SafeAreaView style={{ flex: 1 }}>

                <Tab.Navigator screenOptions={{
                    headerShown: false
                }}>
                    <Tab.Screen name='HomeNavigation' component={HomeNavigation}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <FontAwesome5 name="home" size={20} color={color} />
                            )
                        }}
                    />
                    <Tab.Screen name='AppointmentNavigation' component={AppointmentNavigation}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <Ionicons name="calendar" size={24} color={color} />
                            )
                        }}
                    />
                    <Tab.Screen name='Profile' component={Profile}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <FontAwesome5 name="user-circle" size={24} color={color} />
                            )
                        }}
                    />
                    <Tab.Screen name='AdminHomeNav' component={AdminHomeNavigation}
                        options={{
                            tabBarIcon: ({ color, size }) => (
                                <FontAwesome5 name="user-circle" size={24} color={color} />
                            )
                        }}
                    />
                </Tab.Navigator>
            </SafeAreaView>
    )
}