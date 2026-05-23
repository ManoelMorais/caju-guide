
/*
 * CAJU GUIDE — BottomNav
 * Design: "Festa na Praça" — navegação por abas na base, mobile-first
 * Ícones: sanfona (home), mapa, acessibilidade, passaporte
 */

import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Calendar, Map, Accessibility, BookOpen, Navigation, MapPin } from "lucide-react";

const navItems = [
  { path: "/", label: "Programação", icon: Calendar },
  { path: "/mapa", label: "Mapa", icon: Map },
  { path: "/transito", label: "Trânsito", icon: Navigation },
  { path: "/localizacao", label: "Localização", icon: MapPin },
  { path: "/acessibilidade", label: "Acesso", icon: Accessibility },
  { path: "/passaporte", label: "Passaporte", icon: BookOpen },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();

  return (
    <nav className="bottom-nav safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`nav-item px-3 py-2 rounded-xl relative min-w-[44px] min-h-[44px]${isActive ? " nav-item--active" : ""}`}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="nav-pill"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.6} />
              <span className="text-[10px] font-medium leading-none">
                {label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area spacer */}
      <div style={{ height: "env(safe-area-inset-bottom, 0px)" }} />
    </nav>
  );
}
