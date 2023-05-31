import axios from "axios";
import qs from "query-string";

const getToken = () => localStorage.getItem("accessToken");

const axiosClient = axios.create({
    baseURL: "https://localhost:4000",
    paramsSerializer: {
        serialize: function (params) {
            return qs.stringify(params, { arrayFormat: "repeat" });
        },
    },
});

axiosClient.interceptors.request.use(async (config) => {
    return {
        ...config,
        headers: {
            "Content-Type": "application/json",
            Authorization: getToken ? `Bearer ${getToken()}` : "",
        },
    };
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error.message);
    }
);

export default axiosClient;
