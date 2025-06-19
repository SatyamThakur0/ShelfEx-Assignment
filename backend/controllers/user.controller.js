import User from "../models/user.model.js";

export const searchCeleb = async (req, res) => {
    try {
        const { username } = req.query;
        const celebs = await User.find({
            role: "celeb",
            username: { $regex: username, $options: "i" },
        });
        return res.status(200).json({ ok: true, celebs });
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
};

export const followUnfollowCeleb = async (req, res) => {
    try {
        const { celebUsername } = req.params;

        const user = await User.findById(req.user._id);
        const celeb = await User.findOne({ username: celebUsername });
        if (celeb.role === "public")
            return res
                .status(400)
                .json({ ok: false, message: "cannot follow a public user" });

        if (user.following.includes(celeb._id)) {
            await Promise.all([
                User.updateOne(
                    { _id: user._id },
                    { $pull: { following: celeb._id } }
                ),
                User.updateOne(
                    { _id: celeb._id },
                    { $pull: { followers: user._id } }
                ),
            ]);
            return res.status(200).json({
                ok: true,
                message: "unfollowed successfully",
                type: "unfollow",
            });
        } else {
            await Promise.all([
                User.updateOne(
                    { _id: user._id },
                    { $push: { following: celeb._id } }
                ),
                User.updateOne(
                    { _id: celeb._id },
                    { $push: { followers: user._id } }
                ),
            ]);
            return res.status(200).json({
                ok: true,
                message: "followed successfully",
                type: "follow",
            });
        }
    } catch (error) {
        return res.status(500).json({ ok: false, message: error.message });
    }
};

export const getFollowingUsers = async (req, res) => {
    try {
        const { select } = req.query;
        const user = await User.findById(req.user._id).populate({
            path: "following",
            select: select, // Select only necessary fields
        });

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            ok: true,
            followed: user.following,
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error.message,
        });
    }
};
export const getProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            ok: true,
            user,
        });
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error.message,
        });
    }
};
