import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        caption: {
            type: String,
            required: true,
            trim: true,
        },
        image: {
            type: String,
            required: false,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const Post = mongoose.model("Post", postSchema);

export default Post;