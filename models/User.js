import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            min: [2, "Must be at least 2 letters"],
            max: [50, "Must be below 50 letters"],
        },
        lastName: {
            type: String,
            required: true,
            min: [2, "Must be at least 2 letters"],
            max: [50, "Must be below 50 letters"],
        },
        email: {
            type: String,
            required: true,
            max: [50, "Must be below 50 letters"],
            unique: true,
        },
        password: {
            type: String,
            required: true,
            min: [5, "Must be at least 5 letters"],
        },
        picturePath: {
            type: String,
            default: "",
        },
        friends: {
            type: Array,
            default: [],
        },
        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number,
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
