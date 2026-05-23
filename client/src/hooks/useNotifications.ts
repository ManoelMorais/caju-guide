import { useState, useCallback, useEffect, useMemo } from "react";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "lotacao" | "transito" | "favorito" | "info";
  timestamp: Date;
  read: boolean;
  data?: Record<string, any>;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Carregar notificações do localStorage
    const saved = localStorage.getItem("caju-notifications");
    return saved ? JSON.parse(saved).map((n: any) => ({ ...n, timestamp: new Date(n.timestamp) })) : [];
  });

  // Persistir notificações
  useEffect(() => {
    localStorage.setItem("caju-notifications", JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    return newNotification;
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  return {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    unreadCount,
  };
}
