import React, { createContext, useContext } from "react";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { useFavoritos, Favorito } from "@/hooks/useFavoritos";

interface AppContextType {
  // Notificações
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => Notification;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;

  // Favoritos
  favoritos: Favorito[];
  isFavorito: (artistaId: number) => boolean;
  toggleFavorito: (artistaId: number, artistaNome: string) => void;
  marcarComoNotificado: (artistaId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const notificationsHook = useNotifications();
  const favoritosHook = useFavoritos();

  const value: AppContextType = {
    // Notificações
    notifications: notificationsHook.notifications,
    addNotification: notificationsHook.addNotification,
    markAsRead: notificationsHook.markAsRead,
    markAllAsRead: notificationsHook.markAllAsRead,
    deleteNotification: notificationsHook.deleteNotification,
    clearAllNotifications: notificationsHook.clearAll,
    unreadCount: notificationsHook.unreadCount,

    // Favoritos
    favoritos: favoritosHook.favoritos,
    isFavorito: favoritosHook.isFavorito,
    toggleFavorito: favoritosHook.toggleFavorito,
    marcarComoNotificado: favoritosHook.marcarComoNotificado,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext deve ser usado dentro de AppProvider");
  }
  return context;
}
