import axios from 'axios';
import { baseURL } from './Config';
console.log(baseURL)
const instance= axios.create({
    baseURL:baseURL,
    timeout:1000
});


instance.interceptors.request.use(
   async (config)=>{

      try{  const token= localStorage.getItem('access_token')
        config.headers.Authorization= `Bearer${token}`
        return config;
    }
    catch(e){

    }
    }
)
export default instance
