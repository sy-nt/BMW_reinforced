import axiosClient from "./axiosClient";

const authApi = {
    login: (params) => axiosClient.post("auth/login", params),
    register: (params) => axiosClient.post("auth/register", params),
};

export default authApi;
