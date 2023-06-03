import axiosClient from "./axiosClient";
import axios from "axios";
const getAccessToken = () => localStorage.getItem("accessToken");

const postApi = {
    getAll: () => axiosClient.get("posts"),
    getSearchPost: (params) => axiosClient.get(`posts/${params}/search`),
    getPostByUserId: (id) => axiosClient.get(`posts/${id}/posts`),
    commentPost: ({ id, params }) => axiosClient.post(`comments/${id}`, params),
    likePost: ({ id, params }) => axiosClient.patch(`posts/${id}/like`, params),
    uploadPost: (params) =>
        axios.post(process.env.REACT_APP_API_URL + "/posts", params, {
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
            },
        }),
};

export default postApi;
