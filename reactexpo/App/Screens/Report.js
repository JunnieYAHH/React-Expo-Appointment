import { View, Text } from 'react-native'
import React from 'react'
import { WebView } from 'react-native-webview';

export default function Report() {
    return (
        <View style={{ flex: 1 }}>
            <WebView source={{
                uri: "https://tawk.to/chat/660cc5f8a0c6737bd127b4c3/1hqgualqb",
            }}></WebView>
        </View>
    )
}