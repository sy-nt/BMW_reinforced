import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
} from "@mui/icons-material";
import {
    Box,
    Divider,
    IconButton,
    Typography,
    useTheme,
    InputBase,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { useEffect } from "react";
const PostWidget = ({
    postId,
    postUserId,
    name,
    description,
    location,
    picturePath,
    userPicturePath,
    likes,
    comments,
}) => {
    const [comment, setComment] = useState("");
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    const patchLike = async () => {
        const response = await fetch(
            `https://localhost:4000/posts/${postId}/like`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: loggedInUserId }),
            }
        );
        const updatedPost = await response.json();
        dispatch(setPost({ post: updatedPost }));
    };

    const createComment = async () => {
        if (comment) {
            const response = await fetch(
                `https://localhost:4000/comments/${postId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        userId: loggedInUserId,
                        text: comment,
                    }),
                }
            );
            const newComment = await response.json();
            dispatch(setPost({ post: newComment }));
        }
    };

    return (
        <WidgetWrapper m="2rem 0">
            <Friend
                friendId={postUserId}
                name={name}
                subtitle={location}
                userPicturePath={userPicturePath}
            />
            <Typography color={main} sx={{ mt: "1rem" }}>
                {description}
            </Typography>
            {picturePath && (
                <img
                    width="100%"
                    height="auto"
                    alt="post"
                    style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
                    src={`https://localhost:4000/assets/${picturePath}`}
                />
            )}
            <FlexBetween mt="0.25rem">
                <FlexBetween gap="1rem">
                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={patchLike}>
                            {isLiked ? (
                                <FavoriteOutlined sx={{ color: primary }} />
                            ) : (
                                <FavoriteBorderOutlined />
                            )}
                        </IconButton>
                        <Typography>{likeCount}</Typography>
                    </FlexBetween>

                    <FlexBetween gap="0.3rem">
                        <IconButton onClick={() => setIsComments(!isComments)}>
                            <ChatBubbleOutlineOutlined />
                        </IconButton>
                        <Typography>{comments.length}</Typography>
                    </FlexBetween>
                </FlexBetween>

                <IconButton>
                    <ShareOutlined />
                </IconButton>
            </FlexBetween>
            {isComments && (
                <>
                    <Box mt="0.5rem">
                        {comments.map((comment, i) => (
                            <Comment
                                userId={comment.userId}
                                text={comment.text}
                                color={main}
                                index={`${comment.userId}-${i}`}
                            />
                        ))}
                        <Divider />
                    </Box>
                    <InputBase
                        placeholder="Your comment..."
                        values={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                                await createComment();
                                setIsComments(false);
                            }
                        }}
                    />
                </>
            )}
        </WidgetWrapper>
    );
};

function Comment({ userId, text, color }) {
    const token = useSelector((state) => state.token);
    const [user, setUser] = useState({});
    const getUserInfor = async () => {
        const response = await fetch(
            `https://localhost:4000/users/${userId}`,
            {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        const data = await response.json();
        setUser(data);
    };
    useEffect(() => {
        getUserInfor();
    }, []);
    return (
        <>
            {user && (
                <Box
                    sx={{
                        color: color,
                        m: "0.5rem 0",
                        pl: "1rem",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <UserImage image={user.picturePath} size="40px" />
                    <Typography
                        fontWeight="500"
                        variant="h5"
                        sx={{
                            color: color,
                            m: "0.5rem 0",
                            pl: "1rem",
                        }}
                    >
                        {user.firstName} {user.lastName}
                    </Typography>
                </Box>
            )}
            <Typography
                sx={{
                    color: color,
                    m: "0.5rem 0",
                    pl: "1rem",
                }}
            >
                {text}
            </Typography>
            <Divider />
        </>
    );
}

export default PostWidget;
