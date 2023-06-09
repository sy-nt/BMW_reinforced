import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { description } = req.body;
        const { id } = req.user;
        const user = await User.findById(id);
        const picturePath = req.file ? req.file.filename : null;
        const newPost = new Post({
            userId: id,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath: picturePath,
            likes: {},
            comments: [],
        });
        await newPost.save();

        const post = await Post.find().sort({ createdAt: -1 });
        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const searchPost = async (req, res) => {
    try {
        const regexSearch = new RegExp(req.params.search);
        const results = await Post.find({
            $text: { $search: regexSearch },
        })
            .sort({ createdAt: -1 })
            .lean();
        res.status(200).json(results);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
