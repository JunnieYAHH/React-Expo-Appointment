import React from "react";
import * as WebBrowser from "expo-web-browser";
import { Button, Dimensions, Text, TouchableOpacity } from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useWarmUpBrowser } from "../../hooks/useWarmUpBrowser";
// import { useNavigation } from '@react-navigation/native';
import Colors from "../../assets/Shared/Colors";


WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  // Warm up the android browser to improve UX
  // https://docs.expo.dev/guides/authentication/#improving-user-experience
  useWarmUpBrowser();
  // const navigation = useNavigation(); // Get navigation object

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow();

      if (createdSessionId) {
        setActive({ session: createdSessionId });
        // navigation.navigate('TabNavigation');

      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{ marginTop: 10, marginLeft:225 }}> 
      <Text style={{ fontWeight: '500', color: '#007FFF', textAlign: 'center' }}>Login with Google!</Text>
    </TouchableOpacity>
  );
}
export default SignInWithOAuth;