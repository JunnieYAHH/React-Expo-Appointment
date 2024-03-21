import { View, Text, Image, StyleSheet, Dimensions ,TouchableOpacity} from 'react-native'
import React from 'react'
import walls from './../../assets/images/walls.gif'
import Colors from '../../assets/Shared/Colors'
import SignInWithOAuth from '../Components/SignInWithOAuth'

export default function Login() {
    return (
    <View style={{alignItems:'center',
    backgroundColor:Colors.LIGHT_GRAY}}> 
        <Image source={walls}
        style={styles.wallImage} />

    <View style={{ backgroundColor:Colors.white,
        padding:25,
        alignItems:'center', 
         marginTop:-50,
         borderTopLeftRadius: 20,
         borderTopRightRadius:20,
         }}>
        <Text style={styles.heading }>Your Ultimate Doctor</Text>
        <Text style={styles.heading }>Online Appointment App</Text>
        <Text style={{textAlign:'center',marginTop:20}}>
            Book Appointment Effortlessly and monitor your health Journey
        </Text>
        <SignInWithOAuth/>

    </View>
    </View>
    )
}

const styles = StyleSheet.create({
    wallImage: {
        width: 400,
        height: 600,
        objectFit: 'cover',
        marginTop:50,
        borderRadius:20,
        borderWidth:6,
        borderColor:'#000'
    },
    heading :{
            fontSize:28,
            fontWeight:'bold'
    }

})