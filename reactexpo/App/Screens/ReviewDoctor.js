import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, TextInput, Alert, ScrollView } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import PageHeader from '../Components/Shared/PageHeader'
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import baseURL from '../../assets/common/baseURL';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { UserType } from '../../UserContext';
import { useUser } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const ReviewDoctor = () => {
  const [doctor, setDoctorToReview] = useState([]);
  const { isSignedIn, user } = useUser();
  const [currentUser, setCurrentUser] = useState([]);
  const [currentGoogleId, setGoogleAuthId] = useState([])
  const param = useRoute().params;
  const navigation = useNavigation();
  const [comment, setComment] = useState([]);
  const [rating, setRating] = useState(0);
  const [userWhoReview, setUserWhoReview] = useState()
  const { userId, setUserId } = useContext(UserType)
  const doctorId = param?.doctorId || '';
  const serviceName = param?.serviceName || '';

  // console.log(doctorId)

  useEffect(() => {
    if (user) {
      setGoogleAuthId(user.id);
    }
  }, [user, currentGoogleId]);

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const token = await AsyncStorage.getItem("authToken")
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId
          setUserId(userId)
          const response = await axios.get(`${baseURL}/users/get-current-user`, {
            // const response = await axios.get('http://192.168.137.190:8000/get-current-user', {
            params: {
              user_id: userId
            }
          });
          setCurrentUser(response.data.user);
        } catch (error) {
          console.error('Fetch User Error:', error.message);
        }
      }
      fetchUser();
    }
  }, [userId]);

  // console.log(rating)

  useEffect(() => {
    if (param && param.doctorId) {
      getReviewDoctor(param.doctorId);
    }
  }, [param]);

  const getReviewDoctor = async (doctorId) => {
    try {
      const response = await axios.get(`${baseURL}/doctors/get-doctor-to-review`, {
        params: {
          doctorId: param.doctorId
        }
      });

      const reviewsWithUserData = await Promise.all(response.data.doctor.review.map(async (review) => {
        try {
          const userResponse = await axios.get(`${baseURL}/users/get-user`, {
            params: {
              userId: review.user
            }
          });

          if (!userResponse.data.user) {
            console.error('User not found for review:', review);
            return {
              ...review,
              userData: null
            };
          }
          return {
            ...review,
            userData: userResponse.data.user
          };
        } catch (error) {
          console.error('Error fetching user for review:', error);
          return {
            ...review,
            userData: null
          };
        }
      }));
      // console.log('Makuha na sana', reviewsWithUserData)

      setDoctorToReview({
        ...response.data.doctor,
        review: reviewsWithUserData
      });

      // setDoctorToReview(response.data.doctor);

    } catch (error) {
      console.error('Fetch The doctor, Error:', error);
    }
  };

  const handleStarPress = (ratingValue) => {
    setRating(ratingValue);
  };

  const renderStars = () => {
    const stars = [];
    const starSize = 30;
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => handleStarPress(i)}>
          <Text style={{ fontSize: starSize, margin: 5, color: '#FFD700', fontWeight: '900' }}>{rating >= i ? '★' : '☆'}</Text>
        </TouchableOpacity>
      );
    }
    return stars;
  };
  // console.log(appointment)

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;

    const totalRating = reviews.reduce((acc, curr) => acc + curr.rating, 0);
    return totalRating / reviews.length;
  };

  // console.log(doctors)
  const averageRating = calculateAverageRating(doctor.review);

  const handleAddReviewToDoctor = async () => {
    try {
      let data = {};
      if (user) {
        data = {
          googleId: currentGoogleId,
          comment: comment,
          rating: rating,
          doctorId: doctorId
        }
      } else {
        data = {
          userId: userId,
          comment: comment,
          rating: rating,
          doctorId: doctorId
        }
      }
      console.log(data);
      const response = await axios.put(`${baseURL}/doctors/create-doctor-review`, data);
      Alert.alert('You have successfully reviewed the doctor')
      getReviewDoctor(doctorId);
    } catch (error) {
      console.log('The error creating the Comment is', error.message)
      // Alert.alert('Error To Create A Review', error.message)
    }
  }

  // console.log('The doctor', doctor)
  const handleDeleteReview = async (idReview) => {
    try {
      // Add the logic to delete the review here
      // console.log('Deleting review:', idReview);
      // console.log('Associated doctor:', doctorId);

      const response = await axios.delete(`${baseURL}/doctors/delete-doctor-review`, {
        params: {
          review_id: idReview,
          doctor_id: doctorId,
        }
      });
      getReviewDoctor(doctorId);
      Alert.alert('The review is now deleted.')
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <View style={{ padding: 10, marginTop: 40, flex: 1 }}>
      <PageHeader title={'Review Doctor'} />
      <ScrollView>
        <View style={{ padding: 20, marginTop: 20, backgroundColor: '#FAF9F6' }} >
          <View style={{ marginTop: 25 }}>
            <View key={doctor._id} style={{ marginBottom: 10, padding: 15, backgroundColor: '#FFFFFF', borderRadius: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#87CEEB', padding: 5, borderRadius: 10, width: 140 }} >
                <MaterialCommunityIcons name="check-decagram" size={10} color="blue" />
                <Text style={{ color: 'blue' }} > Proffesional Doctor</Text>
              </View>
              <View style={{ flexDirection: 'row', padding: 15 }}>
                {doctor.image && doctor.image.length > 0 && (
                  <Image
                    source={{ uri: doctor.image[0].url }}
                    style={{ width: 100, height: 125, borderRadius: 10 }}
                  />
                )}
                <View style={{ padding: 10 }}>
                  {/* <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#87CEEB', padding: 5, borderRadius: 10, width: 140 }} >
                  <MaterialCommunityIcons name="check-decagram" size={10} color="blue" />
                  <Text style={{ color: 'blue' }} > Proffesional Doctor</Text>
                </View> */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', marginTop: 5 }} >
                    <Text style={{ fontSize: 17 }} >Dr. {doctor.name}</Text>
                    {doctor.gender === 'male' ? (
                      <Ionicons name="male" size={15} style={{ marginLeft: 5 }} color="blue" />
                    ) : doctor.gender === 'female' ? (
                      <Ionicons name="female" size={15} style={{ marginLeft: 5 }} color="#FF00FF" />
                    ) : null}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', alignContent: 'center', marginTop: 5, justifyContent: 'center' }}>
                    <MaterialIcons name="email" size={12} color="black" />
                    <Text style={{ color: 'gray', marginLeft: 5 }} >{doctor.email}</Text>
                  </View>
                  <Text style={{ marginTop: 8, color: 'gray' }} >{serviceName}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map((star, index) => (
                  <View key={index}>
                    <MaterialCommunityIcons
                      key={index}
                      name={star <= calculateAverageRating(doctor.review) ? 'star' : 'star-outline'}
                      size={20}
                      color="#FFD700"
                    />
                  </View>
                ))}
                <Text style={{ fontWeight: 'bold', marginTop: 5 }}>{averageRating.toFixed(1)}</Text>
              </View>
              <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Text>Review</Text>
                <KeyboardAvoidingView>
                  <TextInput
                    // numberOfLines={3}
                    onChangeText={(value) => setComment(value)}
                    style={{ backgroundColor: '#E5E4E2', padding: 5, borderRadius: 10, color: 'gray', marginTop: 10, width: 300 }}
                  />
                </KeyboardAvoidingView>
                <Text>{renderStars()}</Text>
                <TouchableOpacity
                  onPress={() => handleAddReviewToDoctor()}
                  style={{ backgroundColor: 'blue', padding: 10, borderRadius: 10, marginTop: 20 }} >
                  <Text style={{ color: 'white', fontFamily: 'System', fontSize: 16 }}>Review Doctor</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
        <View style={{ padding: 20, marginTop: 20, backgroundColor: '#FAF9F6' }}>
          {doctor.review && doctor.review.map((review) => (
            <View key={review._id} style={{ marginBottom: 20 }}>
              {review.userData && review.userData.image && (
                <Image
                  source={{ uri: review.userData.image[0].url }} 
                  style={{ width: 40, height: 40, borderRadius: 50, marginTop: 10 }}
                />
              )}
              <Text>User: {review.userData ? review.userData.email : review.user}</Text>
              <Text>Rating: {review.rating}</Text>
              <Text>Comment: {review.comment}</Text>
              <Text>DoctorID: {doctor._id}</Text>
              <Text>reviewId: {review._id}</Text>
              {((review.user === currentUser._id) || (review.user === currentGoogleId)) && (
                <TouchableOpacity
                  onPress={() => handleDeleteReview(review._id)}
                  style={{ backgroundColor: 'blue', padding: 10, borderRadius: 10, marginTop: 20 }}
                >
                  <Text style={{ color: 'white', fontFamily: 'System', fontSize: 16 }}>Delete Review</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </View >
  )
}

export default ReviewDoctor