import { View, Text } from 'react-native'
import React from 'react' 
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../../assets/Shared/Colors'
import { TouchableOpacity } from 'react-native'
import {MaterialIcons} from "@expo/vector-icons"
import { ScrollView } from 'react-native-gesture-handler'

export default function Profile({}){
 
  const navigateToEditProfile = () => {
    navigation.navigate("EditProfile")
  };

  const navigateToSecurity =() =>{
    console.log("Security function")
  };

  const navigateToNotification =() =>{
    console.log("Notification function")
  };

  const navigateToPrivacy =() =>{
    console.log("Privacy function")
  };

  const navigateToSubscription =()=>{
    console.log("Subscription function")
  };

  const navigateToSupport =()=>{
    console.log("Support function")
  };

  const navigateToTermsAndPolicies=()=>{
    console.log("Terms and Policies function")
  };

 const navigateToFreeSpace=()=>{
   console.log("Free Space function")
 };
 
 const navigateToDateSaver=()=>{
  console.log("Date Save ")
 };

 const navigateToReportProblem=()=>{
  console.log("Report a problem")
 };

 const addAccount=()=>{
  console.log("Add Account")
 };

 const logout=()=>{
  console.log("Log out")

 }

  const accountItems =[
    {icon:"person-outline", text:"Edit Profile", action: navigateToEditProfile},
    {icon: "security", text: "Security", action: navigateToSecurity},
    {icon: "notifications-none", text: "Notifications", action: navigateToNotification},
    {icon: "lock-outline", text: "Privacy", action: navigateToPrivacy}
  ];

  const supportItems = [
    {icon:"credit-card", text:"My Subscription", action: navigateToSubscription },
    {icon:"help-outline", text:"Help & Support", action: navigateToSupport },
    {icon:"info-outline", text:"Terms & Policies", action: navigateToTermsAndPolicies}

  ];

  const cacheAndCellularItems=[
    {icon:"delete-outline", text:"Free up space", action: navigateToFreeSpace},
    {icon:"save-all", text:"Date Saver", action: navigateToDateSaver}
  ];

  const actionsItems=[
    {icon:"outline-flag", text:" Report a problem", action: navigateToReportProblem},
    {icon:"people-outline", text:" Add Account", action: addAccount},
    {icon:"logout", text:"Log out", action: logout}
  ]

  const renderSettingItem = ({ icon, text, action }) => {
    return (
      <TouchableOpacity
        onPress={action}
        style={{
          flexDirection: "row",
          alignItems: "center", // Corrected spelling
          paddingVertical: 8,
          paddingLeft: 12
        }}
      >
        <MaterialIcons name={icon} size={24} color="black" />
        <Text style={{
          marginLeft: 16, // Adjusted margin
          fontFamily: "sans-serif", // Corrected spelling
          fontWeight: "600", // Changed 600 to string
          fontSize: 16
        }}>
          {text} {/* Pass the text prop to display the text content */}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={{
      flex: 1,
      backgroundColor: Colors.white
      }}>
        <View style={{
          marginHorizontal: 12,
          flexDirection: "row",
          justifyContent: "center"
        }}>
          <TouchableOpacity
            onPress={()=>navigation.goBack()}
            style={{
              position: "absolute",
              left: 0
            }}
          >
            <MaterialIcons
              name="keyboard-arrow-left"
              size={24}
              color={Colors.black}
            />
          </TouchableOpacity>
          <Text style={{fontfamily:"sans-serif"}}>Settings</Text>
          </View>
          {/* {Account settings} */}
           <ScrollView style={{marginHorizontal: 12}}>
           <View style={{marginBottom: 12}}>
            <Text style={{fontfamily:"sans-serif", margin: 10}}>Account</Text>
            <View style={{
              borderRadius: 12,
              backgroundColor: Colors.grey
            }}>
              
              {
                accountItems.map((item,index)=>(
                 <React.Fragment key={index}>
                    {renderSettingItem(item)}
                 </React.Fragment>
                ))
              }
            </View>
          </View>
            {/* support and About settings */}
            <View style={{marginBottom: 12}}>
            <Text style={{fontfamily:"sans-serif", margin: 10}}>Support And About</Text>
            <View style={{
              borderRadius: 12,
              backgroundColor: Colors.grey
            }}>
              
              {
                supportItems.map((item,index)=>(
                 <React.Fragment key={index}>
                    {renderSettingItem(item)}
                 </React.Fragment>
                ))
              }
            </View>
          </View>
          {/* Cache and Cellular */}
          <View style={{marginBottom: 12}}>
            <Text style={{fontfamily:"sans-serif", margin: 10}}>Cache and Cellular</Text>
            <View style={{
              borderRadius: 12,
              backgroundColor: Colors.grey
            }}>
              
              {
                cacheAndCellularItems.map((item,index)=>(
                 <React.Fragment key={index}>
                    {renderSettingItem(item)}
                 </React.Fragment>
                ))
              }
            </View>
          </View>
          {/* Action setting */}
          <View style={{marginBottom: 12}}>
            <Text style={{fontfamily:"sans-serif", margin: 10}}>Actions</Text>
            <View style={{
              borderRadius: 12,
              backgroundColor: Colors.grey
            }}>
              
              {
                actionsItems.map((item,index)=>(
                 <React.Fragment key={index}>
                    {renderSettingItem(item)}
                 </React.Fragment>
                ))
              }
            </View>
          </View>
           </ScrollView>
          
     </SafeAreaView>
  )
}