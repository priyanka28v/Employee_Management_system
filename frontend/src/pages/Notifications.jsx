import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaBell, FaCheck, FaCheckDouble, FaSpinner, FaUserClock, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://127.0.0.1:5000/api/notifications/admin', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://127.0.0.1:5000/api/notifications/admin/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const markAllRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const unreadItems = notifications.filter((n) => !n.read);
      await Promise.all(
        unreadItems.map((n) =>
          axios.patch(`http://127.0.0.1:5000/api/notifications/admin/${n._id}/read`, {}, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all as read', err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const getNotificationIcon = (message) => {
    if (message.includes('Login') || message.includes('logged in')) {
      return <FaUserClock className="text-blue-500 text-lg" />;
    } else if (message.includes('Leave') || message.includes('applied')) {
      return <FaCalendarAlt className="text-amber-500 text-lg" />;
    }
    return <FaInfoCircle className="text-teal-500 text-lg" />;
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600 relative">
            <FaBell className="text-2xl" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Notification Center</h1>
            <p className="text-sm text-slate-500">
              Live updates on employee logins, leave requests, and system activity
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium rounded-lg text-sm transition"
          >
            <FaCheckDouble /> Mark all as read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            filter === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Notifications ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            filter === 'unread'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
            filter === 'read'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      {/* Notification List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-slate-100">
          <FaSpinner className="animate-spin text-3xl text-indigo-600 mb-3" />
          <p className="text-slate-500">Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-100">
          <FaBell className="mx-auto text-4xl text-slate-300 mb-3" />
          <h3 className="text-lg font-semibold text-slate-700">No Notifications</h3>
          <p className="text-sm text-slate-500">
            {filter === 'unread'
              ? 'You have read all your notifications.'
              : 'No notification records found at this time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 rounded-xl border transition flex items-start justify-between gap-4 ${
                !notification.read
                  ? 'bg-indigo-50/50 border-indigo-200 shadow-xs'
                  : 'bg-white border-slate-100 text-slate-600'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 p-2.5 rounded-lg bg-white shadow-xs border border-slate-100">
                  {getNotificationIcon(notification.message)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p
                      className={`text-sm ${
                        !notification.read
                          ? 'font-semibold text-slate-900'
                          : 'font-normal text-slate-700'
                      }`}
                    >
                      {notification.message}
                    </p>
                    {!notification.read && (
                      <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {!notification.read && (
                <button
                  onClick={() => markRead(notification._id)}
                  className="flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 bg-white hover:bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg transition shrink-0"
                  title="Mark as read"
                >
                  <FaCheck /> Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
