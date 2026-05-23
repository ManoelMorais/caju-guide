/*
 * CAJU GUIDE — Notification Center
 * Exibe notificações de lotação, trânsito e favoritos
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X, AlertTriangle, TrendingUp, Heart, Info, Trash2 } from "lucide-react";
import { Notification } from "@/hooks/useNotifications";

interface NotificationCenterProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const iconByType: Record<Notification["type"], React.ReactNode> = {
  lotacao: <AlertTriangle size={16} />,
  transito: <TrendingUp size={16} />,
  favorito: <Heart size={16} />,
  info: <Info size={16} />,
};

const colorByType: Record<Notification["type"], string> = {
  lotacao: "#E8521A",
  transito: "#D4A017",
  favorito: "#7B5CB8",
  info: "#3A9E68",
};

export default function NotificationCenter({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
}: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Botão de sino */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notificações${unreadCount > 0 ? ` (${unreadCount} não lidas)` : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        className="relative p-2 rounded-lg transition-colors hover:bg-card"
        style={{ color: "var(--foreground)" }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-0 right-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: colorByType.favorito }}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </motion.div>
        )}
      </button>

      {/* Painel de notificações */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              role="presentation"
              className="fixed inset-0 z-40"
            />

            {/* Painel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Central de notificações"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-2 w-80 rounded-lg border border-border shadow-lg z-50"
              style={{ background: "var(--card)" }}
            >
              {/* Header */}
              <div className="p-3 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                  Notificações
                </h3>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllAsRead}
                      className="text-xs px-2 py-1 rounded hover:bg-primary/10"
                      style={{ color: "var(--primary)" }}
                    >
                      Marcar tudo
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Fechar notificações"
                    className="p-1 hover:bg-muted rounded"
                  >
                    <X size={16} style={{ color: "var(--muted-foreground)" }} />
                  </button>
                </div>
              </div>

              {/* Lista de notificações */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                      Nenhuma notificação por enquanto
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="p-3 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => onMarkAsRead(notif.id)}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className="flex-shrink-0 p-2 rounded-lg"
                            style={{ background: `${colorByType[notif.type]}20`, color: colorByType[notif.type] }}
                          >
                            {iconByType[notif.type]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-semibold"
                              style={{ color: "var(--foreground)" }}
                            >
                              {notif.title}
                            </p>
                            <p
                              className="text-xs mt-0.5 leading-relaxed"
                              style={{ color: "var(--muted-foreground)" }}
                            >
                              {notif.message}
                            </p>
                            <p
                              className="text-[10px] mt-1"
                              style={{ color: "var(--muted-foreground)" }}
                            >
                              {notif.timestamp.toLocaleTimeString("pt-BR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {!notif.read && (
                            <div
                              className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                              style={{ background: colorByType[notif.type] }}
                            />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(notif.id);
                            }}
                            aria-label="Excluir notificação"
                            className="p-1 hover:bg-destructive/10 rounded"
                          >
                            <Trash2 size={12} style={{ color: "var(--muted-foreground)" }} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="p-2 border-t border-border text-center">
                  <button
                    onClick={onClearAll}
                    className="text-xs px-3 py-1 rounded hover:bg-destructive/10"
                    style={{ color: "var(--destructive)" }}
                  >
                    Limpar tudo
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
