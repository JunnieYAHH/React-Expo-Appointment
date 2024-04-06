import React, { useContext, useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import Colors from "../../assets/Shared/Colors";
import bg from "../../assets/images/bg.png";
import prof from "../../assets/images/dentist.jpg";
import { Entypo } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import baseURL from "../../assets/common/baseURL";
import { jwtDecode } from "jwt-decode";
import { UserType } from "../../UserContext";
import { useNavigation } from "@react-navigation/native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Fontisto } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

const Profile = () => {

  const [services, setServices] = useState([]);
  const [currentUser, setCurrentUser] = useState([]);
  const navigation = useNavigation();
  const { isLoaded, isSignedIn, user } = useUser();
  const { userId, setUserId } = useContext(UserType)
  const { signOut } = useAuth();

  if (!isSignedIn) {
    useEffect(() => {
      const fetchUser = async () => {
        const token = await AsyncStorage.getItem("authToken")
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.userId
        setUserId(userId)
        fetchCurrentUser(userId);
      }
      fetchUser();
    }, []);
  }
  const fetchCurrentUser = async (userId) => {
    try {
      if (userId) {
        const response = await axios.get(`${baseURL}/users/get-current-user`, {
          params: {
            user_id: userId
          }
        });
        setCurrentUser(response.data.user);
      }
    } catch (error) {
      console.error('Fetch Services Error:', error.message);
    }
  };
  useEffect(() => {
    fetchCurrentUser(userId)
  }, [currentUser])

  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const navigateToSecurity = () => {
    console.log("Security function");
  };

  const navigateToNotifications = () => {
    console.log("Notifications function");
  };

  const navigateToPrivacy = () => {
    console.log("Privacy function");
  };

  const navigateToSubscription = () => {
    console.log("Subscription function");
  };

  const navigateToSupport = () => {
    console.log("Support function");
  };

  const navigateToTermsAndPolicies = () => {
    console.log("Terms and Policies function");
  };


  const addAccount = () => {
    console.log("Aadd account ");
  };

  const logout = () => {
    setCurrentUser([]);
    AsyncStorage.clear()
      .then(() => {
        navigation.navigate('Login');
        console.log('AsyncStorage cleared successfully.');
      })
      .catch((error) => {
        console.error('Error clearing AsyncStorage:', error);
      });
  };

  const accountItems = [
    { icon: "security", text: "Security", action: navigateToSecurity },
    {
      icon: "notifications-none",
      text: "Notifications",
      action: navigateToNotifications,
    },
    { icon: "lock-outline", text: "Privacy", action: navigateToPrivacy },
  ];

  const supportItems = [
    { icon: "help-outline", text: "Help & Support", action: navigateToSupport },
    {
      icon: "info-outline",
      text: "Terms and Policies",
      action: navigateToTermsAndPolicies,
    },
  ];

  const actionsItems = [
    { icon: "logout", text: "Log out", action: logout },
  ];

  const renderSettingsItem = ({ icon, text, action }) => (
    <TouchableOpacity
      onPress={action}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingLeft: 12,
        backgroundColor: Colors.gray,
      }}
    >
      <MaterialIcons name={icon} size={24} color="black" />
      <Text
        style={{
          marginLeft: 36,
          fontFamily: "sans-serif",
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        {text}{" "}
      </Text>
    </TouchableOpacity>
  );

  // console.log(userId)
  console.log(user)
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <StatusBar backgroundColor={Colors.gray} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <Image
            source={bg}
            resizeMode="cover"
            style={{
              height: 228,
              width: "100%",
            }}
          />
        </View>

        <View style={{ alignItems: "center", marginTop: 20 }}>
          {currentUser && currentUser.image && currentUser.image.length > 0 && (
            <Image
              source={{ uri: currentUser.image[0].url }}
              resizeMode="contain"
              style={{
                height: 155,
                width: 155,
                borderRadius: 999,
                borderColor: Colors.primaries,
                borderWidth: 2,
                marginBottom: 10,
              }}
            />
          )}
          {user && (
            <Image
              source={{ uri: user.externalAccounts[0].imageUrl }}
              resizeMode="contain"
              style={{
                height: 155,
                width: 155,
                borderRadius: 999,
                borderColor: Colors.primaries,
                borderWidth: 2,
                marginBottom: 10,
              }}
            />
          )}
          <Text
            style={{
              fontSize: 20,
              color: Colors.primary,
              marginVertical: 5,
            }}
          >
            {currentUser.name}
            {user && (
              user.fullName
            )}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Fontisto name="email" size={20} color="black" />
            <Text
              style={{
                fontSize: 14,
                lineHeight: 15,
                marginLeft: 4,
              }}
            >
              {currentUser.email}
              {user && user.primaryEmailAddress && (
                <Text>Email: {user.primaryEmailAddress.emailAddress}</Text>
              )}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Feather name="phone" size={20} color="black" />
            <Text
              style={{
                fontSize: 14,
                lineHeight: 20,
                marginLeft: 4,
              }}
            >
              {currentUser.phone}

            </Text>
          </View>
        </View>
        {!isSignedIn && (
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileUpdate', {
              userId: userId
            })}
            style={{
              width: 124,
              height: 46,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.secondaryGray,
              borderRadius: 10,
              marginTop: 20,
              alignSelf: "center",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: Colors.black,
              }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        )}

        <ScrollView style={{ marginHorizontal: 12 }}>
          {/* <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: "sans-serif", marginVertical: 10 }}>Account</Text>
            <View>
              {accountItems.map((item, index) => (
                <React.Fragment key={index}>
                  {renderSettingsItem(item)}
                </React.Fragment>
              ))}
            </View>
          </View> */}

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontFamily: "sans-serif", marginVertical: 10 }}>Support & About</Text>
            <View>
              {supportItems.map((item, index) => (
                <React.Fragment key={index}>
                  {renderSettingsItem(item)}
                </React.Fragment>
              ))}
            </View>
          </View>

          <View style={{ marginBottom: 12 }}>
            <Text style={{ fontFamily: "sans-serif", marginVertical: 10 }}>Actions</Text>
            <View>
              {user ? (
                <Button
                  title="Sign Out"
                  onPress={() => signOut()}
                  style={{ borderRadius: 100 }}
                />
              ) : (
                actionsItems.map((item, index) => (
                  <React.Fragment key={index}>
                    {renderSettingsItem(item)}
                  </React.Fragment>
                ))
              )}
            </View>
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;