import axiosClient from "./axiosClient";
import axios from "axios";

const authApi = {
    login: (params) => axiosClient.post("auth/login", params),
    register: (params) =>
        axios.post(process.env.REACT_APP_API_URL + "/auth/register", params),
};

export default authApi;
