import mongoose from "mongoose";
const Schema = mongoose.Schema;
const CommentSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            require: true,
        },
        postId: {
            type: Schema.Types.ObjectId,
            require: true,
        },
        text: {
            type: String,
        },
    },
    { timestamps: true }
);

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;
