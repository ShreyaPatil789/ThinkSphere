import React, { useEffect, useState } from "react";
import "./Notifications.css"; // optional styling
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data);
    } catch (err) {
      console.error("Error fetching notifications", err);
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.blogId) {
      navigate(`/blogs/all/${notification.blogId}`);
    }
  };

  return (
    <div className="notification-page">
      <h2>Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul>
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={notif.read ? "read" : "unread"}
              onClick={() => handleNotificationClick(notif)}
            >
              {notif.message}
              <span className="time">{new Date(notif.createdAt).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
