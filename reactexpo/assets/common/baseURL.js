import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
? baseURL = 'http://192.168.0.189:8000'
: baseURL = 'http://192.168.0.189:8000'
}

export default baseURL;