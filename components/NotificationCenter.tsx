import React, { useState, useEffect } from 'react';
import type { Notification } from '../types';
import { BellIcon, XMarkIcon, CheckIcon } from './icons';

interface NotificationCenterProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (notificationId: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'match':
      return '🎯';
    case 'message':
      return '💬';
    case 'new_listing':
      return '📝';
    case 'system':
      return '⚙️';
    default:
      return '🔔';
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'match':
      return 'bg-green-50 border-green-200 text-green-800';
    case 'message':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    case 'new_listing':
      return 'bg-purple-50 border-purple-200 text-purple-800';
    case 'system':
      return 'bg-gray-50 border-gray-200 text-gray-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Şimdi';
    if (diffInMinutes < 60) return `${diffInMinutes} dk önce`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} saat önce`;
    return date.toLocaleDateString('tr-TR');
  };

  return (
    <div className="relative">
      {/* Bildirim Butonu */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors duration-200 focus:outline-none flex items-center justify-center"
        aria-label="Bildirimler"
      >
        <BellIcon className="w-5 h-5 sm:w-6 sm:h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full h-4 sm:h-5 min-w-[16px] sm:min-w-[20px] px-1 flex items-center justify-center border-2 border-white shadow-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Arka plan overlay (mobil için tıklandığında kapatma) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/25 sm:bg-transparent"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bildirim Dropdown */}
      {isOpen && (
        <div className="fixed top-14 right-3 left-3 sm:absolute sm:top-full sm:right-0 sm:left-auto sm:mt-2 sm:w-80 sm:max-w-sm bg-white rounded-2xl sm:rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[75vh] sm:max-h-96 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3.5 sm:p-4 border-b border-gray-100 bg-gray-50/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold text-gray-900">Bildirimler</h3>
                {unreadCount > 0 && (
                  <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {unreadCount} yeni
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={onMarkAllAsRead}
                    className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                  >
                    Tümünü Oku
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200/60"
                  aria-label="Kapat"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <BellIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm font-medium">Henüz bildirim yok</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3.5 sm:p-4 transition-colors duration-200 ${
                    !notification.read ? 'bg-indigo-50/40' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-lg leading-none mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-xs sm:text-sm font-semibold ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-1 shrink-0">
                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="Okundu işaretle"
                            >
                              <CheckIcon className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onDeleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Sil"
                          >
                            <XMarkIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-snug break-words">
                        {notification.message}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400 mt-1.5">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};




