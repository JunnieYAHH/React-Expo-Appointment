import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import { PieChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../../../../assets/common/baseURL';

const AdminRatingsOfDoctors = () => {
  const [doctorRatings, setDoctorRatings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        };

        const ratingsResult = await axios.get(`${baseURL}/doctors/aggregated-ratings`, config);
        setDoctorRatings(ratingsResult.data);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  // console.log(doctorRatings);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctor Ratings</Text>
      <View style={styles.chartContainer}>
        <PieChart
          data={doctorRatings.map(rating => ({
            name: `R ${rating._id} Stars`,
            count: rating.count,
            color: `#${((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0')}`, // Random color for each segment
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          }))}
          width={300}
          height={200}
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="count"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  chartContainer: {
    alignItems: 'center',
    marginRight: 50,
    marginLeft:40,
    borderWidth: 1
  },
});

export default AdminRatingsOfDoctors;
