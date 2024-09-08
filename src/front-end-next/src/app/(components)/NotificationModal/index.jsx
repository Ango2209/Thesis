import { Bell } from "lucide-react";
import React from "react";

function NotificationModal({ notificationsList, markAsRead }) {
  return (
    <div className="absolute right-0 mt-2 w-120 bg-white shadow-lg rounded-lg z-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Notifications</h3>
        </div>
        <div className="max-h-96 w-96 overflow-y-auto">
          {notificationsList && notificationsList.length > 0 ? (
            notificationsList.map((notification, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 bg-white shadow-md rounded-lg mb-4 ${
                  notification.isRead ? "opacity-60" : ""
                }`}
              >
                {/* Icon */}
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-500">
                    <Bell size={20} />
                  </div>
                  <div className="ml-4">
                    {/* Notification content */}
                    <p className="text-md font-semibold text-gray-800">
                      {notification.content}
                    </p>
                    {/* Time */}
                    <p className="text-sm text-gray-500">
                      {new Date(notification.date).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center space-x-4">
                  {!notification.isRead && (
                    <button
                      className="text-blue-500 text-sm font-medium hover:underline"
                      onClick={() => markAsRead(index)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">
              No notifications available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
