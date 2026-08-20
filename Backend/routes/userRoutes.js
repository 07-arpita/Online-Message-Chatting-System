const express = require("express");
const router = express.Router();

const User = require("../models/User");

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1E9);

        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage
});
// ==============================
// Upload Profile Image
// ==============================

router.put(
    "/profile-image/:id",
    upload.single("profileImage"),
    async (req, res) => {
        try {

            if (!req.file) {
                return res.status(400).json({
                    message: "Please select an image"
                });
            }

            const user = await User.findByIdAndUpdate(
                req.params.id,
                {
                    profileImage: `/uploads/${req.file.filename}`
                },
                { new: true }
            ).select("-password");

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            res.json({
                message: "Profile photo updated successfully",
                user: user
            });

        } catch (error) {

            res.status(500).json({
                message: error.message
            });

        }
    }
);
// ==============================
// Remove Profile Image
// ==============================

router.delete("/profile-image/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { profileImage: "" },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Profile photo removed successfully",
            user: user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
// ==============================
// Get All Users
// ==============================

router.get("/", async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.json(users);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// ==============================
// Update User Name
// ==============================

router.put("/update/:id", async (req, res) => {
    try {
        const { name } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Name updated successfully",
            user: user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// ==============================
// Change Password
// ==============================

router.put("/change-password/:id", async (req, res) => {
    try {

        const {
            currentPassword,
            newPassword
        } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Please fill all fields"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check current password
        if (currentPassword !== user.password) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        // Update password
        user.password = newPassword;

        await user.save();

        res.json({
            message: "Password changed successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});


// ==============================
// Delete Account
// ==============================

router.delete("/:id", async (req, res) => {
    try {

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json({
            message: "Account deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
});


module.exports = router;