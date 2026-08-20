import "./Sidebar.css";
import { FaSearch } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar({
  sender,
  users,
  selectedUser,
  setSelectedUser,
  onlineUsers,
  unreadCounts,
  lastMessages,
  lastMessageTimes,
}) {

  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || null
  );
  const [showProfile, setShowProfile] = useState(false);

  const filteredUsers = [...users]
    .filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const timeA = lastMessageTimes?.[a.name]
        ? new Date(lastMessageTimes[a.name]).getTime()
        : 0;

      const timeB = lastMessageTimes?.[b.name]
        ? new Date(lastMessageTimes[b.name]).getTime()
        : 0;

      return timeB - timeA;
    });

  return (
    <div className="sidebar">

      {/* ================= PROFILE ================= */}

      <div className="sidebar-top">
        <div className="profile">

          <div className="profile-avatar">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
                className="profile-image"
              />
            ) : (
              sender.charAt(0).toUpperCase()
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            hidden
            id="profile-upload"
            onChange={(e) => {
              const file = e.target.files[0];

              if (file) {
                const imageUrl = URL.createObjectURL(file);
                setProfileImage(imageUrl);
                localStorage.setItem("profileImage", imageUrl);
              }
            }}
          />

          <div>
            <h3>{sender}</h3>

            <button
              className="my-account-btn"
              onClick={() => navigate("/profile")}
            >
              My Account
            </button>
          </div>

        </div>
      </div>

      {/* ================= SEARCH ================= */}

      <div className="search-bar">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= USERS ================= */}

      <div className="sidebar-users">

        {filteredUsers.map((user) => (

          <div
            key={user._id}
            className={`sidebar-user ${selectedUser?._id === user._id ? "active" : ""
              }`}
            onClick={() => setSelectedUser(user)}
          >

            <div className="avatar">
              {user.profileImage ? (
                <img
                  src={`http://localhost:5000${user.profileImage}`}
                  alt={user.name}
                  className="user-profile-image"
                />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>

            <div className="user-details">

              <h4>
                {user.name}

                {unreadCounts?.[user.name] > 0 && (
                  <span className="unread-count">
                    {unreadCounts[user.name]}
                  </span>
                )}
              </h4>

              <p className="last-message">
                {lastMessages?.[user.name] || "No messages yet"}
              </p>

              <span>
                {onlineUsers.includes(user.name)
                  ? "🟢 Online"
                  : "Offline"}
              </span>

            </div>

          </div>

        ))}

      </div>

      {/* ================= PROFILE PANEL ================= */}

      {showProfile && (
        <div className="profile-panel">

          {/* Header */}

          <div className="profile-panel-header">

            <button
              className="back-btn"
              onClick={() => setShowProfile(false)}
            >
              ←
            </button>

            <h3>Profile</h3>

          </div>

          {/* Profile Content */}

          <div className="profile-panel-content">

            <div className="big-profile-avatar">

              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                sender.charAt(0).toUpperCase()
              )}

            </div>

            <h2>{sender}</h2>

            {/* Change DP */}

            <label
              htmlFor="profile-upload"
              className="profile-change-btn"
            >
              📷 Change Profile Photo
            </label>

            {/* Remove DP */}

            {profileImage && (
              <button
                className="remove-dp-btn"
                onClick={() => setProfileImage(null)}
              >
                🗑️ Remove Photo
              </button>
            )}

            {/* Settings */}

            <div className="settings-list">

              <button>
                ✏️ Edit Profile
              </button>

              <button>
                🎨 Theme
              </button>

              <button>
                🔔 Notifications
              </button>

              <button>
                🔒 Privacy
              </button>

              <button>
                🔐 Change Password
              </button>

              <button>
                🗑️ Delete Account
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Sidebar;