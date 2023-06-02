import axiosClient from "./axiosClient";

const userApi = {
    addFriend: ({ id, friendId }) =>
        axiosClient.patch(`users/${id}/${friendId}`),
    getImage: (image) => axiosClient.get(`assets/${image}`),
    getUser: (id) => axiosClient.get(`users/${id}`),
    getUserFriend: (id) => axiosClient.get(`users/${id}/friends`),
};

export default userApi;
