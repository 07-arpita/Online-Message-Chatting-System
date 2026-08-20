import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
    const navigate = useNavigate();

    const savedUser = localStorage.getItem("user");

    const user =
        savedUser && savedUser !== "undefined"
            ? JSON.parse(savedUser)
            : null;

    const sender = user?.name || "User";
    const savedChatUser = localStorage.getItem("selectedChatUser");

    const selectedUser = savedChatUser
        ? JSON.parse(savedChatUser)
        : null;

    const [profileImage, setProfileImage] = useState(
        user?.profileImage
            ? `http://localhost:5000${user.profileImage}`
            : null
    );

    const [darkMode, setDarkMode] = useState(
        localStorage.getItem("darkMode") === "true"
    );

    const [showEditProfile, setShowEditProfile] = useState(false);

    const [showChatSettings, setShowChatSettings] = useState(false);

    const [chatFontSize, setChatFontSize] = useState(
        localStorage.getItem("chatFontSize") || "medium"
    );
    const [enterToSend, setEnterToSend] = useState(
        localStorage.getItem("enterToSend") !== "false"
    );

    const [newName, setNewName] = useState(sender);
    const handleUpdateName = async () => {
        if (!newName.trim()) {
            alert("Please enter a name");
            return;
        }

        try {
            const res = await fetch(
                `http://localhost:5000/api/users/update/${user._id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: newName,
                    }),
                }
            );

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );

                setShowEditProfile(false);

                window.location.reload();
            } else {
                alert(data.message || "Name update failed");
            }
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    };
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [notificationsEnabled, setNotificationsEnabled] = useState(
        localStorage.getItem("notificationsEnabled") !== "false"
    );
    const [privacyEnabled, setPrivacyEnabled] = useState(
        localStorage.getItem("privacyEnabled") !== "false"
    );
    const [readReceipts, setReadReceipts] = useState(
        localStorage.getItem("readReceipts") !== "false"
    );
    const [typingIndicator, setTypingIndicator] = useState(
        localStorage.getItem("typingIndicator") !== "false"
    );

    const handleLogout = () => {
        localStorage.removeItem("user");
        window.location.href = "/";
    };

    return (
        <div className={`profile-page ${darkMode ? "dark-mode" : ""}`}>

            {/* Header */}
            <div className="profile-header">

                <button
                    className="back-btn"
                    onClick={() => navigate("/chat")}
                >
                    ←
                </button>

                <h2>Profile & Settings</h2>

            </div>

            {/* Profile */}
            <div className="profile-section">

                <div className="large-profile-avatar">

                    {profileImage ? (
                        <img
                            src={profileImage}
                            alt="Profile"
                        />
                    ) : (
                        sender.charAt(0).toUpperCase()
                    )}

                </div>

                <input
                    type="file"
                    accept="image/*"
                    hidden
                    id="profile-image-upload"
                    onChange={async (e) => {
                        const file = e.target.files[0];

                        if (!file) return;

                        const formData = new FormData();

                        formData.append("profileImage", file);

                        try {
                            const res = await fetch(
                                `http://localhost:5000/api/users/profile-image/${user._id}`,
                                {
                                    method: "PUT",
                                    body: formData,
                                }
                            );

                            const data = await res.json();

                            if (res.ok) {
                                const imageUrl =
                                    `http://localhost:5000${data.user.profileImage}`;

                                setProfileImage(imageUrl);

                                localStorage.setItem(
                                    "profileImage",
                                    imageUrl
                                );

                                localStorage.setItem(
                                    "user",
                                    JSON.stringify(data.user)
                                );

                                alert("Profile photo updated successfully!");
                            } else {
                                alert(data.message || "Upload failed");
                            }

                        } catch (error) {
                            console.log(error);
                            alert("Server error");
                        }
                    }}
                />

                <label
                    htmlFor="profile-image-upload"
                    className="change-profile-btn"
                >
                    📷 Change Profile Photo
                </label>

                {profileImage && (
                    <button
                        className="remove-profile-btn"
                        onClick={async () => {
                            try {
                                const res = await fetch(
                                    `http://localhost:5000/api/users/profile-image/${user._id}`,
                                    {
                                        method: "DELETE",
                                    }
                                );

                                const data = await res.json();

                                if (res.ok) {
                                    setProfileImage(null);
                                    localStorage.removeItem("profileImage");
                                    localStorage.setItem("user", JSON.stringify(data.user));

                                    alert("Profile photo removed successfully!");
                                } else {
                                    alert(data.message || "Failed to remove photo");
                                }

                            } catch (error) {
                                console.log(error);
                                alert("Server error");
                            }
                        }}
                    >
                        Remove Photo
                    </button>
                )}

                <h2>{sender}</h2>

                <p>My Account</p>

            </div>

            {/* Settings */}

            <div className="settings-container">

                <h3>Account</h3>

                <button
                    className="setting-item"
                    onClick={() => setShowEditProfile(true)}
                >
                    <span>✏️</span>

                    <div>
                        <strong>Edit Profile</strong>
                        <small>Change your name and profile information</small>
                    </div>
                </button>
                {showEditProfile && (
                    <div className="edit-profile-box">

                        <h3>Edit Profile</h3>

                        <input
                            type="text"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="Enter your name"
                        />

                        <div className="edit-profile-buttons">

                            <button
                                onClick={() => setShowEditProfile(false)}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleUpdateName}
                            >
                                Save
                            </button>

                        </div>

                    </div>
                )}
                <button
                    className="setting-item"
                    onClick={() => setShowChangePassword(true)}
                >
                    <span>🔐</span>
                    <div>
                        <strong>Change Password</strong>
                        <small>Update your account password</small>
                    </div>
                </button>
                {showChangePassword && (
                    <div className="change-password-box">

                        <h3>Change Password</h3>

                        <input
                            type="password"
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <div className="password-buttons">

                            <button
                                onClick={() => setShowChangePassword(false)}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={async () => {

                                    if (!currentPassword || !newPassword || !confirmPassword) {
                                        alert("Please fill all fields");
                                        return;
                                    }

                                    if (newPassword !== confirmPassword) {
                                        alert("New passwords do not match");
                                        return;
                                    }

                                    try {
                                        const res = await fetch(
                                            `http://localhost:5000/api/users/change-password/${user._id}`,
                                            {
                                                method: "PUT",
                                                headers: {
                                                    "Content-Type": "application/json",
                                                },
                                                body: JSON.stringify({
                                                    currentPassword: currentPassword,
                                                    newPassword: newPassword,
                                                }),
                                            }
                                        );

                                        const data = await res.json();

                                        if (res.ok) {
                                            setCurrentPassword("");
                                            setNewPassword("");
                                            setConfirmPassword("");
                                            setShowChangePassword(false);

                                            alert("Password changed successfully!");
                                        } else {
                                            alert(data.message);
                                        }

                                    } catch (error) {
                                        console.log(error);
                                        alert("Server error");
                                    }
                                }}
                            >
                                Save
                            </button>
                        </div>

                    </div>
                )}

                <button
                    className="setting-item"
                    onClick={async () => {

                        const confirmDelete = window.confirm(
                            "Are you sure you want to permanently delete your account?"
                        );

                        if (!confirmDelete) {
                            return;
                        }

                        try {
                            const res = await fetch(
                                `http://localhost:5000/api/users/${user._id}`,
                                {
                                    method: "DELETE",
                                }
                            );

                            const data = await res.json();

                            if (res.ok) {

                                localStorage.removeItem("user");
                                localStorage.removeItem("profileImage");
                                localStorage.removeItem("darkMode");

                                alert("Account deleted successfully!");

                                window.location.href = "/";

                            } else {

                                alert(data.message || "Account deletion failed");

                            }

                        } catch (error) {

                            console.log(error);

                            alert("Server error. Please try again.");
                        }
                    }}
                >
                    <span>🗑️</span>

                    <div>
                        <strong>Delete Account</strong>

                        <small>
                            Permanently delete your account
                        </small>
                    </div>
                </button>


                <h3>Appearance</h3>

                <button
                    className="setting-item"
                    onClick={() => {
                        const newMode = !darkMode;
                        setDarkMode(newMode);
                        localStorage.setItem("darkMode", newMode);
                    }}
                >
                    <span>{darkMode ? "☀️" : "🎨"}</span>

                    <div>
                        <strong>Theme</strong>
                        <small>
                            {darkMode ? "Dark mode" : "Light mode"}
                        </small>
                    </div>
                </button>


                <h3>Notifications</h3>

                <button
                    className="setting-item"
                    onClick={() => {
                        const newStatus = !notificationsEnabled;

                        setNotificationsEnabled(newStatus);

                        localStorage.setItem(
                            "notificationsEnabled",
                            newStatus
                        );
                    }}
                >
                    <span>🔔</span>

                    <div>
                        <strong>Notifications</strong>

                        <small>
                            {notificationsEnabled
                                ? "Notifications are ON"
                                : "Notifications are OFF"}
                        </small>
                    </div>
                </button>

                <h3>Privacy</h3>

                <button
                    className="setting-item"
                    onClick={() => {
                        const newStatus = !privacyEnabled;

                        setPrivacyEnabled(newStatus);

                        localStorage.setItem(
                            "privacyEnabled",
                            newStatus
                        );
                    }}
                >
                    <span>🔒</span>

                    <div>
                        <strong>Privacy</strong>

                        <small>
                            {privacyEnabled
                                ? "Privacy is ON"
                                : "Privacy is OFF"}
                        </small>
                    </div>
                </button>


                <button
                    className="setting-item"
                    onClick={() => {
                        const newStatus = !readReceipts;

                        setReadReceipts(newStatus);

                        localStorage.setItem(
                            "readReceipts",
                            newStatus
                        );
                    }}
                >
                    <span>✓✓</span>

                    <div>
                        <strong>Read Receipts</strong>

                        <small>
                            {readReceipts
                                ? "Read receipts are ON"
                                : "Read receipts are OFF"}
                        </small>
                    </div>
                </button>

                <button
                    className="setting-item"
                    onClick={() => {
                        const newStatus = !typingIndicator;

                        setTypingIndicator(newStatus);

                        localStorage.setItem(
                            "typingIndicator",
                            newStatus
                        );
                    }}
                >
                    <span>⌨️</span>

                    <div>
                        <strong>Typing Indicator</strong>

                        <small>
                            {typingIndicator
                                ? "Typing indicator is ON"
                                : "Typing indicator is OFF"}
                        </small>
                    </div>
                </button>


                <h3>Chats</h3>

                <button
                    className="setting-item"
                    onClick={() => setShowChatSettings(true)}
                >
                    <span>💬</span>

                    <div>
                        <strong>Chat Settings</strong>
                        <small>Manage your chat preferences</small>
                    </div>
                </button>
                {showChatSettings && (
                    <div className="chat-settings-box">

                        <div className="chat-settings-title">
                            <h3>Chat Settings</h3>

                            <button
                                onClick={() => setShowChatSettings(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="chat-setting-option">
                            <span>🖼️</span>

                            <div>
                                <strong>Chat Wallpaper</strong>
                                <small>Change your chat background</small>
                            </div>

                            <input
                                type="color"
                                value={localStorage.getItem("chatWallpaper") || "#efeae2"}
                                onChange={(e) => {
                                    const color = e.target.value;

                                    localStorage.setItem("chatWallpaper", color);

                                    document.documentElement.style.setProperty(
                                        "--chat-wallpaper",
                                        color
                                    );
                                }}
                            />
                        </div>

                        <div className="chat-setting-option">
                            <span>🔤</span>

                            <div>
                                <strong>Font Size</strong>
                                <small>Choose message text size</small>
                            </div>

                            <select
                                value={chatFontSize}
                                onChange={(e) => {
                                    const size = e.target.value;

                                    setChatFontSize(size);
                                    localStorage.setItem("chatFontSize", size);
                                }}
                            >
                                <option value="small">Small</option>
                                <option value="medium">Medium</option>
                                <option value="large">Large</option>
                            </select>
                        </div>

                        <button
                            className="chat-setting-option"
                            onClick={() => {
                                const newStatus = !enterToSend;

                                setEnterToSend(newStatus);
                                localStorage.setItem("enterToSend", newStatus);
                            }}
                        >
                            ↵
                            <div>
                                <strong>Enter to Send</strong>

                                <small>
                                    {enterToSend
                                        ? "Press Enter to send messages"
                                        : "Enter creates a new line"}
                                </small>
                            </div>
                        </button>

                        <button
                            className="chat-setting-option"
                            onClick={() => {
                                const newStatus = !notificationsEnabled;

                                setNotificationsEnabled(newStatus);

                                localStorage.setItem(
                                    "notificationsEnabled",
                                    newStatus
                                );
                            }}
                        >
                            🔔
                            <div>
                                <strong>Chat Notifications</strong>

                                <small>
                                    {notificationsEnabled
                                        ? "Chat notifications are ON"
                                        : "Chat notifications are OFF"}
                                </small>
                            </div>
                        </button>

                        <button
                            className="chat-setting-option"
                            onClick={async () => {

                                const confirmClear = window.confirm(
                                    "Are you sure you want to clear this chat?"
                                );

                                if (!confirmClear) {
                                    return;
                                }

                                if (!user) {
                                    alert("User not found");
                                    return;
                                }

                                if (!selectedUser) {
                                    alert("Please select a chat first");
                                    return;
                                }

                                try {
                                    const res = await fetch(
                                        "http://localhost:5000/api/messages/clear",
                                        {
                                            method: "DELETE",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({
                                                sender: user.name,
                                                receiver: selectedUser.name,
                                            }),
                                        }
                                    );

                                    const data = await res.json();

                                    if (res.ok) {
                                        alert("Chat cleared successfully!");
                                    } else {
                                        alert(data.message || "Failed to clear chat");
                                    }

                                } catch (error) {
                                    console.log(error);
                                    alert("Server error");
                                }
                            }}
                        >
                            🗑️
                            <div>
                                <strong>Clear Chat</strong>
                                <small>Clear your chat messages</small>
                            </div>
                        </button>
                    </div>
                )}

                <h3>Account</h3>

                <button
                    className="logout-setting-btn"
                    onClick={handleLogout}
                >
                    🚪 Logout
                </button>

            </div>

        </div>
    );
}

export default Profile;