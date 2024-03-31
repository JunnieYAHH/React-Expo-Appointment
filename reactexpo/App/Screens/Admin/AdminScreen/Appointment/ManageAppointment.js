import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '../../../../../assets/Shared/Colors';
import PageHeader from '../../../../Components/Shared/PageHeader';
import PendingAppointments from './PendingAppointments';

const ManageAppointment = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const DrawerItem = ({ label, index }) => {
        return (
            <TouchableOpacity
                style={[styles.tabContainer, activeIndex === index ? styles.activeTab : styles.inActiveTab]}
                onPress={() => setActiveIndex(index)}>
                <Text style={activeIndex === index ? styles.activeText : styles.inActiveText}>{label}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.headerContainer}>
                <PageHeader title={'Manage Appointment'} />
            </View>
            <ScrollView>
                <View>
                    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                        <DrawerItem label="Pending" index={0} />
                        <DrawerItem label="Processing" index={1} />
                        <DrawerItem label="Complete" index={2} />
                        <DrawerItem label="Denied" index={3} />
                    </ScrollView>
                </View>
                <View style={{ marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                    {activeIndex === 0 && (
                        <PendingAppointments />
                    )}
                    {activeIndex === 1 && (
                        <Text>Processing</Text>
                    )}
                    {activeIndex === 2 && (
                        <Text>Complete</Text>
                    )}
                    {activeIndex === 3 && (
                        <Text>Denied</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default ManageAppointment;

const styles = StyleSheet.create({
    headerContainer: {
        borderWidth: 1,
        padding: 10,
        marginBottom: 10,
        borderRadius: 12,
        borderColor: Colors.LIGHT_GRAY,
        backgroundColor: Colors.white,
        marginTop: 30,
        marginRight: 10,
        alignItems: 'center',
    },
    scrollViewContainer: {
        marginTop: 20,
        marginLeft: 6,
        flexDirection: 'row',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
    },
    tabContainer: {
        borderBottomWidth: 1,
        padding: 3,
        width: '44%', // Adjust width to fit all items comfortably
        alignItems: 'center',
        marginBottom: 10, // Add margin to separate items
    },
    activeTab: {
        borderBottomColor: '#0000FF',
    },
    inActiveTab: {
        borderBottomColor: 'gray',
    },
    activeText: {
        color: '#0000FF',
        fontSize: 16,
        textAlign: 'center',
    },
    inActiveText: {
        color: 'gray',
        fontSize: 16,
        textAlign: 'center',
    },
});
