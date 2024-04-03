import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
// ? baseURL = 'http://192.168.0.189:8000/api/v1'
// : baseURL = 'http://192.168.0.189:8000/api/v1'

? baseURL = 'http://192.168.68.104:8000/api/v1'
: baseURL = 'http://192.168.68.104:8000/api/v1'

// ? baseURL = 'http://192.168.0.189:8000/api/v1'
// : baseURL = 'http://192.168.0.189:8000/api/v1'

// ? baseURL = 'http://192.168.100.47:8000/api/v1'
// : baseURL = 'http://192.168.100.47:8000/api/v1'

// ? baseURL = 'http://192.168.55.100:8000/api/v1'
// : baseURL = 'http://192.168.55.100:8000/api/v1'

// ? baseURL = 'http://192.168.100.47:8000/api/v1'
// : baseURL = 'http://192.168.100.47:8000/api/v1'
// ? baseURL = 'http://192.168.100.47:8000/api/v1'
// : baseURL = 'http://192.168.100.47:8000/api/v1'

// ? baseURL = 'http://172.34.96.111:8000/api/v1'
// : baseURL = 'http://172.34.96.111:8000/api/v1'

<<<<<<< HEAD
? baseURL = 'http://192.168.68.51:8000/api/v1'
: baseURL = 'http://192.168.68.51:8000/api/v1'
=======
// ? baseURL = 'http://192.168.0.187:8000/api/v1'
// : baseURL = 'http://192.168.0.187:8000/api/v1'


// ? baseURL = 'http://192.168.68.104:8000/api/v1'
// : baseURL = 'http://192.168.68.104:8000/api/v1'
>>>>>>> 3b1603310a17332889a7841b24ad6241fb4d1058

}

export default baseURL;