import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { brokerApi } from '../services/api';
import { useBrokerAuth } from './AuthContext';

export interface BrokerNotification {
  _id: string;
  recipient: string;
  title: string;
  message: string;
  type: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

interface BrokerNotificationContextType {
  notifications: BrokerNotification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const BrokerNotificationContext = createContext<BrokerNotificationContextType | undefined>(undefined);

export const BrokerNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useBrokerAuth();
  const [notifications, setNotifications] = useState<BrokerNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }
    try {
      setIsLoading(true);
      const res = await brokerApi.getNotifications();
      if (res?.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch (err) {
      console.warn('Failed to fetch broker notifications:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchNotifications();

    if (!isAuthenticated) return;
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications, isAuthenticated]);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await brokerApi.markNotificationAsRead(id);
    } catch (err) {
      console.error('Failed to mark broker notification as read:', err);
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);

    try {
      await brokerApi.markAllNotificationsAsRead();
    } catch (err) {
      console.error('Failed to mark all broker notifications as read:', err);
      fetchNotifications();
    }
  };

  return (
    <BrokerNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </BrokerNotificationContext.Provider>
  );
};

export const useBrokerNotifications = () => {
  const context = useContext(BrokerNotificationContext);
  if (!context) {
    throw new Error('useBrokerNotifications must be used within BrokerNotificationProvider');
  }
  return context;
};
