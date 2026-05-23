/*
 * CAJU GUIDE — Trânsito & Congestionamento
 * Design: Tema escuro com bandeirinhas de festa junina
 * Foco: Alertas de congestionamento em Aracaju durante o Forró Caju
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Navigation, Clock, TrendingUp, MapPin, AlertCircle } from "lucide-react";

// Dados simulados de trânsito (em produção, viriam de API)
const rotasAracaju = [
  {
    id: 1,
    nome: "Avenida Getúlio Vargas",
    destino: "Centro → Palco Principal",
    congestionamento: "alto",
    tempoEstimado: "25 min",
    tempoNormal: "8 min",
    velocidade: "12 km/h",
    incidentes: ["Acidente menor", "Trânsito intenso"],
  },
  {
    id: 2,
    nome: "Rua João Pessoa",
    destino: "Augusto Franco → Centro",
    congestionamento: "medio",
    tempoEstimado: "18 min",
    tempoNormal: "5 min",
    velocidade: "18 km/h",
    incidentes: ["Trânsito moderado"],
  },
  {
    id: 3,
    nome: "Avenida Beira Mar",
    destino: "Farolândia → Centro",
    congestionamento: "baixo",
    tempoEstimado: "12 min",
    tempoNormal: "7 min",
    velocidade: "28 km/h",
    incidentes: [],
  },
  {
    id: 4,
    nome: "Rua Laranjeiras",
    destino: "Bugio → Centro",
    congestionamento: "alto",
    tempoEstimado: "22 min",
    tempoNormal: "6 min",
    velocidade: "15 km/h",
    incidentes: ["Trânsito intenso", "Obra na via"],
  },
];

const corPorCongestionamento: Record<string, string> = {
  baixo: "#3A9E68",
  medio: "#D4A017",
  alto:  "#E8521A",
};

const labelCongestionamento: Record<string, string> = {
  baixo: "Fluxo livre",
  medio: "Moderado",
  alto: "Congestionado",
};

export default function TransitoPage() {
  const [rotaSelecionada, setRotaSelecionada] = useState<typeof rotasAracaju[0] | null>(null);
  const [atualizacaoAgora, setAtualizacaoAgora] = useState(new Date());

  // Simular atualização de dados a cada 30 segundos
  useEffect(() => {
    const intervalo = setInterval(() => {
      setAtualizacaoAgora(new Date());
    }, 30000);
    return () => clearInterval(intervalo);
  }, []);

  const congestaoAlta = rotasAracaju.filter((r) => r.congestionamento === "alto").length;

  return (
    <div className="flex flex-col min-h-screen" style={{ paddingBottom: "80px", background: "var(--background)" }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex-shrink-0 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Navigation size={20} style={{ color: "var(--primary)" }} />
          <h1 className="page-title text-xl">Trânsito em Aracaju</h1>
        </div>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Dados em tempo real durante o Forró Caju
        </p>
      </div>

      {/* Alerta de congestionamento */}
      {congestaoAlta > 0 && (
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mx-4 mt-4 alert-band"
          style={{ background: "rgba(232,82,26,0.1)", borderColor: "#E8521A" }}
        >
          <AlertTriangle size={16} style={{ color: "#E8521A", flexShrink: 0, marginTop: "2px" }} />
          <div>
            <p className="text-xs font-semibold" style={{ color: "#E8521A" }}>
              ⚠️ Congestionamento Detectado
            </p>
            <p className="text-xs mt-1 label-muted">
              {congestaoAlta} via(s) com trânsito intenso. Considere rotas alternativas.
            </p>
          </div>
        </motion.div>
      )}

      {/* Resumo de trânsito */}
      <div className="px-4 py-3 grid grid-cols-3 gap-2">
        {[
          { label: "Fluxo Livre", count: rotasAracaju.filter((r) => r.congestionamento === "baixo").length, cor: "oklch(0.50 0.18 120)" },
          { label: "Moderado", count: rotasAracaju.filter((r) => r.congestionamento === "medio").length, cor: "oklch(0.75 0.20 72)" },
          { label: "Congestionado", count: rotasAracaju.filter((r) => r.congestionamento === "alto").length, cor: "oklch(0.68 0.22 18)" },
        ].map((item) => (
          <div
            key={item.label}
            className="p-2.5 rounded-lg border border-border text-center"
            style={{ background: "var(--card)" }}
          >
            <div className="w-2 h-2 rounded-full mx-auto mb-1" style={{ background: item.cor }} />
            <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
              {item.count}
            </p>
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {/* Lista de rotas */}
      <div className="flex-1 px-4 py-4 space-y-2">
        <h2 className="section-title text-sm mb-3">Principais Rotas</h2>
        {rotasAracaju.map((rota, idx) => (
          <motion.button
            key={rota.id}
            onClick={() => setRotaSelecionada(rotaSelecionada?.id === rota.id ? null : rota)}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="w-full text-left p-3 rounded-lg border border-border transition-all"
            style={{
              background: "var(--card)",
              borderColor: rotaSelecionada?.id === rota.id ? corPorCongestionamento[rota.congestionamento] : "var(--border)",
              borderLeft: `4px solid ${corPorCongestionamento[rota.congestionamento]}`,
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                  {rota.nome}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                  <MapPin size={10} />
                  {rota.destino}
                </div>
              </div>
              <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                <TrendingUp size={12} style={{ color: corPorCongestionamento[rota.congestionamento] }} />
                <span
                  className="text-xs font-semibold"
                  style={{ color: corPorCongestionamento[rota.congestionamento] }}
                >
                  {labelCongestionamento[rota.congestionamento]}
                </span>
              </div>
            </div>

            {/* Tempo estimado */}
            <div className="flex items-center gap-2 text-xs">
              <Clock size={12} style={{ color: "var(--muted-foreground)" }} />
              <span style={{ color: "var(--foreground)" }}>
                <strong>{rota.tempoEstimado}</strong>
                <span style={{ color: "var(--muted-foreground)" }}> (normal: {rota.tempoNormal})</span>
              </span>
            </div>

            {/* Detalhes expandidos */}
            <AnimatePresence>
              {rotaSelecionada?.id === rota.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 pt-3 border-t border-border space-y-2 overflow-hidden"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--muted-foreground)" }}>Velocidade média:</span>
                    <span style={{ color: "var(--foreground)" }} className="font-semibold">
                      {rota.velocidade}
                    </span>
                  </div>

                  {rota.incidentes.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                        Incidentes:
                      </p>
                      {rota.incidentes.map((inc, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs mb-1">
                          <AlertCircle size={10} style={{ color: corPorCongestionamento[rota.congestionamento] }} />
                          <span style={{ color: "var(--muted-foreground)" }}>{inc}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    className="w-full mt-2 py-2 rounded-lg text-xs font-semibold"
                    style={{
                      background: corPorCongestionamento[rota.congestionamento],
                      color: "white",
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(rota.destino)}`,
                        "_blank",
                        "noopener,noreferrer"
                      );
                    }}
                  >
                    Navegar com GPS
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* Rodapé com info de atualização */}
      <div className="px-4 py-3 border-t border-border text-center">
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Atualizado às {atualizacaoAgora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
        </p>
        <p className="text-[10px] mt-1" style={{ color: "var(--muted-foreground)" }}>
          💡 Dica: Saia cedo ou prefira horários com menos público para evitar trânsito.
        </p>
      </div>
    </div>
  );
}
