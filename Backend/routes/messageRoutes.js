const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const multer = require("multer");
const path = require("path");

// ==========================
// Multer Storage
// ==========================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ==========================
// Send Message
// ==========================

router.post(
  "/send",
  upload.single("image"),
  async (req, res) => {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    try {
      const { sender, receiver, message } = req.body;

      const image = req.file
        ? `/uploads/${req.file.filename}`
        : "";

      const newMessage = new Message({
        sender,
        receiver,
        message,
        image,
      });

      await newMessage.save();

      const io = req.app.get("io");

      // Message receive event
      io.emit("receiveMessage", newMessage);


      res.status(201).json(newMessage);
    } catch (error) {
      console.log("UPLOAD ERROR:", error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);

// ==========================
// Get Messages
// ==========================

router.get("/", async (req, res) => {
  try {
    const { sender, receiver } = req.query;

    let messages;

    if (sender && receiver) {
      messages = await Message.find({
        $or: [
          { sender, receiver },
          { sender: receiver, receiver: sender },
        ],
      }).sort({ time: 1 });
    } else {
      messages = await Message.find().sort({ time: 1 });
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});
// ==========================
// Mark Messages as Read
// ==========================

router.put("/read", async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    await Message.updateMany(
      {
        sender: sender,
        receiver: receiver,
        status: { $in: ["sent", "delivered"] },
      },
      {
        $set: { status: "read" },
      }
    );

    const io = req.app.get("io");

    console.log("MESSAGE READ:", sender, "→", receiver);

    io.emit("messageRead", {
      sender,
      receiver,
    });

    res.json({
      message: "Messages marked as read",
    });

  } catch (error) {
    console.log("READ ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});
// ==========================
// Clear Chat
// ==========================

router.delete("/clear", async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    if (!sender || !receiver) {
      return res.status(400).json({
        message: "Sender and receiver are required",
      });
    }

    await Message.deleteMany({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    });

    const io = req.app.get("io");

    io.emit("chatCleared", {
      sender,
      receiver,
    });

    res.json({
      message: "Chat cleared successfully",
    });

  } catch (error) {
    console.log("CLEAR CHAT ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});
// ==========================
// Delete Message
// ==========================

router.delete("/:id", async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);

    if (!deletedMessage) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    const io = req.app.get("io");
    io.emit("messageDeleted", req.params.id);

    res.json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;