import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
// ? baseURL = 'http://192.168.0.189:8000/api/v1'
// : baseURL = 'http://192.168.0.189:8000/api/v1'

// ? baseURL = 'http://192.168.0.37:8000/api/v1'
// : baseURL = 'http://192.168.0.37:8000/api/v1'

// ? baseURL = 'http://192.168.0.189:8000/api/v1'
// : baseURL = 'http://192.168.0.189:8000/api/v1'

? baseURL = 'http://192.168.100.47:8000/api/v1'
: baseURL = 'http://192.168.100.47:8000/api/v1'
}

export default baseURL;