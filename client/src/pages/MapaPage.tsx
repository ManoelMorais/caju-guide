/*
 * CAJU GUIDE — Mapa dos Palcos
 * Google Maps embed real + pontos de apoio + filtros
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, X, Clock, Accessibility, Navigation, Heart,
  Shield, Stethoscope, Info, Filter, Music2,
} from "lucide-react";

// Coordenadas reais de Aracaju/SE para os palcos e pontos de apoio
const ARACAJU_CENTER = { lat: -10.9167, lng: -37.0528 };

type PontoTipo = "palco" | "medico" | "seguranca" | "apoio" | "cultural";

interface Ponto {
  id: number;
  nome: string;
  subNome: string;
  bairro: string;
  tipo: PontoTipo;
  lat: number;
  lng: number;
  cor: string;
  emoji: string;
  proximoShow?: string;
  lotacao?: string;
  acessivel?: boolean;
  descricao: string;
  telefone?: string;
}

const PONTOS: Ponto[] = [
  // Palcos — locais reais do ciclo junino 2026
  {
    id: 1, nome: "Arraiá do Povo", subNome: "Orla da Atalaia", bairro: "Atalaia",
    tipo: "palco", lat: -10.9982, lng: -37.0489, cor: "#C4521A", emoji: "🎪",
    proximoShow: "Joelma · 22:30 (30/05)", lotacao: "alta", acessivel: true,
    descricao: "Maior evento junino à beira-mar do Brasil — 30 noites de show gratuito na Orla da Atalaia. Palco Rogério + Palco 360°.",
  },
  {
    id: 2, nome: "Circ. Farolândia", subNome: "Praça Acrísio Garcez", bairro: "Farolândia",
    tipo: "palco", lat: -10.9635, lng: -37.0598, cor: "#E8B84B", emoji: "🪗",
    proximoShow: "Alceu Valença · 23:30 (04/06)", lotacao: "alta", acessivel: true,
    descricao: "1° circuito do Forró Caju (04–06/Jun). Praça Acrísio Garcez no Conjunto Augusto Franco.",
  },
  {
    id: 3, nome: "Circ. Santos Dumont", subNome: "Praça Ulisses Guimarães", bairro: "Santos Dumont",
    tipo: "palco", lat: -10.9342, lng: -37.0625, cor: "#3D6B4F", emoji: "🥁",
    proximoShow: "Waldonys · 22:00 (12/06)", lotacao: "media", acessivel: true,
    descricao: "2° circuito do Forró Caju (12–13/Jun). Praça Ulisses Guimarães no bairro Santos Dumont.",
  },
  {
    id: 4, nome: "Circ. Praça dos Mercados", subNome: "Praça Hilton Lopes", bairro: "Centro",
    tipo: "palco", lat: -10.9172, lng: -37.0485, cor: "#C4521A", emoji: "🎸",
    proximoShow: "Wesley Safadão · 22:20 (27/06)", lotacao: "alta", acessivel: true,
    descricao: "3° circuito do Forró Caju (20–28/Jun). Palco Gerson Filho + Palco Luiz Gonzaga no coração do Centro.",
  },
  {
    id: 5, nome: "Rua São João", subNome: "Segundona do Turista", bairro: "Bairro Industrial",
    tipo: "palco", lat: -10.9045, lng: -37.0581, cor: "#E8B84B", emoji: "🎵",
    proximoShow: "Toda segunda · 18:00", lotacao: "baixa", acessivel: true,
    descricao: "Rua histórica com 114 anos de tradição junina. Forró pé de serra, quadrilhas e comidas típicas toda segunda-feira.",
  },
  {
    id: 6, nome: "Complexo Gonzagão", subNome: "Concurso de Quadrilhas", bairro: "Farolândia",
    tipo: "palco", lat: -10.9718, lng: -37.0572, cor: "#6B46C1", emoji: "💃",
    proximoShow: "Concurso Quadrilhas (08–15/Jun)", lotacao: "media", acessivel: true,
    descricao: "Espaço cultural reinaugurado em 2025. Sede do Concurso de Quadrilhas Juninas do Gonzagão e da Salva Junina (28/Mai).",
  },
  // Pontos de suporte
  {
    id: 7, nome: "Posto Médico — Atalaia", subNome: "Próximo à entrada do Arraiá", bairro: "Atalaia",
    tipo: "medico", lat: -10.9965, lng: -37.0472, cor: "#E53E3E", emoji: "⚕️",
    descricao: "Atendimento de primeiros socorros, 24h durante o Arraiá do Povo.",
    telefone: "(79) 3179-1001",
  },
  {
    id: 8, nome: "Posto Médico — Centro", subNome: "Próximo ao Circ. Praça dos Mercados", bairro: "Centro",
    tipo: "medico", lat: -10.9155, lng: -37.0490, cor: "#E53E3E", emoji: "⚕️",
    descricao: "Atendimento rápido durante o Circuito Praça dos Mercados.",
    telefone: "(79) 3179-1003",
  },
  {
    id: 9, nome: "Guarda Municipal", subNome: "Praça Fausto Cardoso", bairro: "Centro",
    tipo: "seguranca", lat: -10.9170, lng: -37.0505, cor: "#2B6CB0", emoji: "👮",
    descricao: "Base da Guarda Municipal — crianças perdidas, segurança geral e atendimento prioritário.",
    telefone: "153",
  },
  {
    id: 10, nome: "Central de Atendimento", subNome: "FUNCAJU — Praça dos Mercados", bairro: "Centro",
    tipo: "apoio", lat: -10.9158, lng: -37.0500, cor: "#6B46C1", emoji: "📍",
    descricao: "Informações, achados e perdidos, pulseiras infantis, comunicação alternativa para PCDs.",
    telefone: "(79) 3179-1000",
  },
];

const lotacaoLabel: Record<string, string> = {
  baixa: "Espaço disponível",
  media: "Lotação moderada",
  alta: "Lotação alta",
};

const lotacaoColor: Record<string, string> = {
  baixa: "#3D6B4F",
  media: "#E8B84B",
  alta: "#C4521A",
};

function filtrarPontos(pontos: Ponto[], filtro: string): Ponto[] {
  if (filtro === "todos") return pontos;
  if (filtro === "seguranca") return pontos.filter(p => p.tipo === "seguranca" || p.tipo === "apoio");
  return pontos.filter(p => p.tipo === filtro);
}

// Componente do Mapa Real usando OpenStreetMap (sem necessidade de API key)
function MapaReal({ pontoSelecionado, onPontoClick, filtro }: {
  pontoSelecionado: Ponto | null;
  onPontoClick: (p: Ponto) => void;
  filtro: string;
}) {
  const pontosFiltrados = filtrarPontos(PONTOS, filtro);

  // Bounding box cobre todos os pontos do ciclo junino: do Bairro Industrial (norte) à Orla da Atalaia (sul)
  const latMin = -11.02, latMax = -10.88;
  const lngMin = -37.09, lngMax = -37.02;

  function toPercent(lat: number, lng: number) {
    const x = ((lng - lngMin) / (lngMax - lngMin)) * 100;
    const y = ((latMax - lat) / (latMax - latMin)) * 100;
    return { x: Math.min(Math.max(x, 2), 98), y: Math.min(Math.max(y, 2), 98) };
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {/* Mapa OpenStreetMap via iframe — pointer-events: none mantém os pins alinhados ao mapa fixo */}
      <iframe
        src="https://www.openstreetmap.org/export/embed.html?bbox=-37.09%2C-11.02%2C-37.02%2C-10.88&layer=mapnik"
        className="w-full h-full border-0"
        title="Mapa de Aracaju — Forró Caju 2026"
        loading="lazy"
        scrolling="no"
        style={{ filter: "saturate(0.85) contrast(1.05)", pointerEvents: "none" }}
      />

      {/* Pins sobrepostos ao mapa */}
      {pontosFiltrados.map((ponto) => {
        const pos = toPercent(ponto.lat, ponto.lng);
        const isSelected = pontoSelecionado?.id === ponto.id;

        return (
          <motion.button
            key={ponto.id}
            onClick={() => onPontoClick(ponto)}
            aria-label={`${ponto.nome} — ${ponto.subNome}`}
            aria-pressed={pontoSelecionado?.id === ponto.id}
            className="absolute z-10"
            style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -100%)" }}
            whileTap={{ scale: 0.9 }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: ponto.id * 0.05, type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                className="w-9 h-9 rounded-full flex items-center justify-center shadow-lg text-base"
                style={{
                  background: ponto.cor,
                  border: isSelected ? "3px solid white" : "2px solid rgba(255,255,255,0.8)",
                  boxShadow: isSelected ? `0 0 0 3px ${ponto.cor}40, 0 4px 12px rgba(0,0,0,0.3)` : "0 2px 8px rgba(0,0,0,0.25)",
                }}
                animate={{ scale: isSelected ? 1.25 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {ponto.emoji}
              </motion.div>
              <div className="w-1.5 h-1 rounded-full mt-0.5" style={{ background: "rgba(0,0,0,0.3)" }} />
            </div>
          </motion.button>
        );
      })}

      {/* Legenda */}
      <div
        className="absolute top-3 left-3 rounded-xl p-2 shadow-md z-10"
        style={{ background: "var(--card)", backdropFilter: "blur(8px)", border: "1px solid var(--border)" }}
      >
        <p className="text-[9px] font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--muted-foreground)" }}>
          Pontos
        </p>
        {[
          { label: "Palcos", color: "#C4521A", emoji: "🎸" },
          { label: "Médico", color: "#E53E3E", emoji: "⚕️" },
          { label: "Apoio", color: "#6B46C1", emoji: "📍" },
          { label: "Guarda", color: "#2B6CB0", emoji: "👮" },
        ].map(({ label, color, emoji }) => (
          <div key={label} className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs">{emoji}</span>
            <span className="text-[9px]" style={{ color: "var(--foreground)" }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MapaPage() {
  const [pontoSelecionado, setPontoSelecionado] = useState<Ponto | null>(null);
  const [filtro, setFiltro] = useState<string>("todos");

  const filtros = [
    { id: "todos", label: "Todos", icon: <MapPin size={12} /> },
    { id: "palcos", label: "Palcos", icon: <Music2 size={12} /> },
    { id: "medico", label: "Médico", icon: <Stethoscope size={12} /> },
    { id: "seguranca", label: "Apoio", icon: <Shield size={12} /> },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ paddingBottom: "80px", background: "var(--background)" }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex-shrink-0">
        <h1 className="page-title text-xl">
          Mapa dos Palcos
        </h1>
        <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
          Toque em um pin para ver detalhes
        </p>

        {/* Filtros do mapa */}
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {filtros.map((f) => (
            <button
              key={f.id}
              onClick={() => setFiltro(f.id)}
              aria-pressed={filtro === f.id}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                background: filtro === f.id ? "var(--primary)" : "var(--card)",
                color: filtro === f.id ? "white" : "var(--foreground)",
                border: `1.5px solid ${filtro === f.id ? "var(--primary)" : "var(--border)"}`,
              }}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mapa */}
      <div className="relative flex-1 mx-4 rounded-2xl overflow-hidden shadow-lg" style={{ minHeight: 0 }}>
        <MapaReal
          pontoSelecionado={pontoSelecionado}
          onPontoClick={(p) => setPontoSelecionado(pontoSelecionado?.id === p.id ? null : p)}
          filtro={filtro}
        />

        {/* Painel de detalhes */}
        <AnimatePresence>
          {pontoSelecionado && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="absolute bottom-3 left-3 right-3 z-20"
            >
              <div
                className="rounded-2xl p-4 shadow-xl"
                style={{
                  background: "var(--card)",
                  borderTop: `4px solid ${pontoSelecionado.cor}`,
                  border: `1px solid var(--border)`,
                  borderTopWidth: "4px",
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{pontoSelecionado.emoji}</span>
                      <h3 className="section-title text-sm leading-tight">
                        {pontoSelecionado.nome}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={10} style={{ color: "var(--muted-foreground)" }} />
                      <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                        {pontoSelecionado.subNome}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setPontoSelecionado(null)}
                    aria-label="Fechar detalhes"
                    className="p-1.5 rounded-full ml-2 flex-shrink-0"
                    style={{ background: "var(--secondary)" }}
                  >
                    <X size={12} style={{ color: "var(--muted-foreground)" }} />
                  </button>
                </div>

                <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {pontoSelecionado.descricao}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  {pontoSelecionado.proximoShow && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: "oklch(0.52 0.16 38 / 0.12)", color: "oklch(0.52 0.16 38)" }}>
                      <Clock size={10} />
                      {pontoSelecionado.proximoShow}
                    </div>
                  )}
                  {pontoSelecionado.lotacao && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: `${lotacaoColor[pontoSelecionado.lotacao]}18`,
                        color: lotacaoColor[pontoSelecionado.lotacao],
                      }}>
                      <div className="w-1.5 h-1.5 rounded-full"
                        style={{ background: lotacaoColor[pontoSelecionado.lotacao] }} />
                      {lotacaoLabel[pontoSelecionado.lotacao]}
                    </div>
                  )}
                  {pontoSelecionado.acessivel && (
                    <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: "oklch(0.50 0.18 120 / 0.12)", color: "oklch(0.35 0.12 140)" }}>
                      <Accessibility size={10} />
                      Acessível
                    </div>
                  )}
                  {pontoSelecionado.telefone && (
                    <a
                      href={`tel:${pontoSelecionado.telefone.replace(/\D/g, "")}`}
                      aria-label={`Ligar para ${pontoSelecionado.nome}: ${pontoSelecionado.telefone}`}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: "oklch(0.55 0.20 290 / 0.12)", color: "oklch(0.45 0.18 290)" }}
                    >
                      📞 {pontoSelecionado.telefone}
                    </a>
                  )}
                </div>

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${pontoSelecionado.lat},${pontoSelecionado.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: pontoSelecionado.cor, color: "white" }}
                >
                  <Navigation size={14} />
                  Como chegar
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lista horizontal */}
      <div className="px-4 pt-3 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filtrarPontos(PONTOS, filtro).map((ponto) => (
            <button
              key={ponto.id}
              onClick={() => setPontoSelecionado(pontoSelecionado?.id === ponto.id ? null : ponto)}
              aria-label={ponto.nome}
              aria-pressed={pontoSelecionado?.id === ponto.id}
              className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200"
              style={{
                background: pontoSelecionado?.id === ponto.id ? ponto.cor : "var(--card)",
                color: pontoSelecionado?.id === ponto.id ? "white" : "var(--foreground)",
                border: `1.5px solid ${pontoSelecionado?.id === ponto.id ? ponto.cor : "var(--border)"}`,
              }}
            >
              <span>{ponto.emoji}</span>
              <span className="max-w-[80px] truncate">{ponto.bairro}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
