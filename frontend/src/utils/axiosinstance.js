import axios from "axios";
import { BASE_URL } from "./constants";

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});
    axiosInstance.interceptors.request.use(
        (config)=>{
                const accessToken = localStorage.getItem("token");
                if(accessToken) {
                    config.header.Auothorization = `bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
    );


export default axiosInstance;