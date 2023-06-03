import axiosClient from "./axiosClient";

const postApi = {
    getAll: () => axiosClient.get("posts"),
    getSearchPost: (params) => axiosClient.get(`posts/${params}/search`),
    getPostByUserId: (id) => axiosClient.get(`posts/${id}/posts`),
    commentPost: ({ id, params }) => axiosClient(`comment/${id}`, params),
    likePost: ({ id, params }) => axiosClient.patch(`posts/${id}/like`, params),
    uploadPost: (params) => axiosClient.post(`posts`, params),
};

export default postApi;
