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
import postApi from "api/postApi";
import userApi from "api/userApi";
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
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;

    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;

    const patchLike = async () => {
        const response = await postApi.likePost({
            id: postId,
            params: { userId: loggedInUserId },
        });
        dispatch(setPost({ post: response }));
    };

    const createComment = async () => {
        if (comment) {
            const response = await postApi.commentPost({
                id: postId,
                params: {
                    userId: loggedInUserId,
                    text: comment,
                },
            });
            dispatch(setPost({ post: response }));
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
                    src={`${process.env.REACT_APP_API_URL}/assets/${picturePath}`}
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
    const [user, setUser] = useState({});
    const getUserInfor = async () => {
        const response = await userApi.getUser(userId);
        setUser(response);
    };
    useEffect(() => {
        getUserInfor();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
