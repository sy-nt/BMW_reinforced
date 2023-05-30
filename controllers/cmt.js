import Post from "../models/Post.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";
/* CREATE */
export const createComment = async (req, res) => {
    try {
        const { userId, text } = req.body;
        const postId = req.params.postId;
        const foundPost = await Post.findById(postId);
        const newComment = await Comment.create({
            userId,
            postId,
            text,
        });
        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            {
                comments: [...foundPost.comments, newComment],
            },
            { new: true }
        );

        res.status(201).json(updatedPost);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* READ */
export const getCommentByPostId = async (req, res) => {
    try {
        const comments = Comment.find({ postId: req.postId });
        res.status(200).json(comments);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
