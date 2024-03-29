import { Platform } from 'react-native'


let baseURL = '';

{Platform.OS == 'android'
<<<<<<< HEAD
// ? baseURL = 'http://192.168.0.189:8000/api/v1'
// : baseURL = 'http://192.168.0.189:8000/api/v1'

? baseURL = 'http://192.168.55.100:8000/api/v1'
: baseURL = 'http://192.168.55.100:8000/api/v1'

=======
? baseURL = 'http://192.168.100.47:8000/api/v1'
: baseURL = 'http://192.168.100.47:8000/api/v1'
>>>>>>> 590f3c6bd9539413894811b15d70ae257e2a49e9
}

export default baseURL;