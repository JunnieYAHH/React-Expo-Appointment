import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import Login from './App/Screens/Login';
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import SignInWithOAuth from './App/Components/SignInWithOAuth';
import Home from './App/Screens/Home';



export default function App() {
  return (
    <ClerkProvider publishableKey={"pk_test_Z29yZ2VvdXMtc3VuYmVhbS03LmNsZXJrLmFjY291bnRzLmRldiQ"}>
      <SafeAreaView style={styles.container}>
        <SignedIn>
          <Home/>
        </SignedIn>
        <SignedOut>
        <SignInWithOAuth/>
         
        </SignedOut>
      </SafeAreaView>
    </ClerkProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'

  },
});
