import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell } from 'react-icons/fa';

const Notifications = () => {
  console.log('Notifications component rendered');
  const [notifications, setNotifications] = useState([]);
  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/notifications/admin');
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id) => {
    try {
      await axios.patch(`/api/notifications/admin/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Notifications Page Debug</h2>
      <p>This is a placeholder to verify component rendering.</p>
    </div>
  );
};

export default Notifications;
