import type { AxiosInstance } from "axios";
import axios from "axios";
import { env } from "./config/env";

export const apiClient:AxiosInstance = axios.create({
    baseURL:env.apiBaseUrl,
    headers:{
        'Content-type':'application/json'
    },
})
apiClient.interceptors.request.use(
    async(config)=>{
        const token = localStorage.getItem("token")
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    }
)
export default apiClient