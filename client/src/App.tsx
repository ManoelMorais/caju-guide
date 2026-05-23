/*
 * CAJU GUIDE — App Router
 * Design: "Festa na Praça" — Modernismo Popular Brasileiro
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppProvider } from "./contexts/AppContext";
import { AccessibilityProvider, useAccessibility } from "./contexts/AccessibilityContext";
import Home from "./pages/Home";
import MapaPage from "./pages/MapaPage";
import AcessibilidadePage from "./pages/AcessibilidadePage";
import PassaportePage from "./pages/PassaportePage";
import TransitoPage from "./pages/TransitoPage";
import LocalizacaoPage from "./pages/LocalizacaoPage";
import BottomNav from "./components/BottomNav";
import NotificationCenter from "./components/NotificationCenter";
import { useAppContext } from "./contexts/AppContext";
import { useTheme } from "./contexts/ThemeContext";
import { Sun, Moon, Accessibility } from "lucide-react";
import { useLocation } from "wouter";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {theme === "dark" ? (
        <Sun size={16} strokeWidth={2} />
      ) : (
        <Moon size={16} strokeWidth={2} />
      )}
    </button>
  );
}

// Botão flutuante de atalho para acessibilidade
function A11yShortcut() {
  const [, navigate] = useLocation();
  const { prefs } = useAccessibility();
  const anyActive =
    prefs.contraste !== "normal" ||
    prefs.tamanhoFonte !== "normal" ||
    prefs.espacamentoLetras ||
    prefs.reduzirAnimacoes ||
    prefs.audioAtivo;

  return (
    <button
      onClick={() => navigate("/acessibilidade")}
      aria-label="Abrir painel de acessibilidade"
      title="Acessibilidade"
      className="theme-toggle relative"
      style={{
        background: anyActive ? "rgba(232,82,26,0.15)" : undefined,
        borderColor: anyActive ? "var(--primary)" : undefined,
      }}
    >
      <Accessibility size={16} strokeWidth={2} />
      {anyActive && (
        <span
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
          style={{ background: "var(--primary)" }}
          aria-label="Preferências de acessibilidade ativas"
        />
      )}
    </button>
  );
}

function RouterWithNotifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAllNotifications } = useAppContext();

  return (
    <>
      {/* Header */}
      <div
        className="fixed top-0 left-0 right-0 z-30"
        style={{ background: "var(--background)", backdropFilter: "blur(12px)" }}
      >
        <div className="bandeirola-line" />
        <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
          <h1
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }}
          >
            🎸 Caju Guide
          </h1>
          <div className="flex items-center gap-2">
            <A11yShortcut />
            <ThemeToggle />
            <NotificationCenter
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDelete={deleteNotification}
              onClearAll={clearAllNotifications}
            />
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ paddingTop: "60px" }}>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/mapa"} component={MapaPage} />
          <Route path={"/transito"} component={TransitoPage} />
          <Route path={"/localizacao"} component={LocalizacaoPage} />
          <Route path={"/acessibilidade"} component={AcessibilidadePage} />
          <Route path={"/passaporte"} component={PassaportePage} />
          <Route path={"/404"} component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark" switchable={true}>
        <AccessibilityProvider>
          <AppProvider>
            <TooltipProvider>
              <Toaster />
              <RouterWithNotifications />
            </TooltipProvider>
          </AppProvider>
        </AccessibilityProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
