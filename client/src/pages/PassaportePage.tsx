/*
 * CAJU GUIDE — Passaporte Cultural
 * Design: "Festa na Praça" — sistema de check-in gamificado com selos/carimbos
 * Lógica: usuário "carimba" cada palco visitado, acumula pontos e desbloqueia recompensas
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Lock, CheckCircle2, Award, Zap } from "lucide-react";
import { toast } from "sonner";

const PASSPORT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663687241893/XXZWs3abMYA25fSovCgD4y/caju-passport-3iGJUjrxHkJ42dbDWLNEjZ.webp";

const palcosPassaporte = [
  { id: 1, nome: "Arraiá do Povo", bairro: "Orla da Atalaia", emoji: "🎪", pontos: 50, cor: "#C4521A" },
  { id: 2, nome: "Circ. Farolândia", bairro: "Praça Acrísio Garcez", emoji: "🪗", pontos: 40, cor: "#E8B84B" },
  { id: 3, nome: "Circ. Santos Dumont", bairro: "Praça Ulisses Guimarães", emoji: "🥁", pontos: 35, cor: "#3D6B4F" },
  { id: 4, nome: "Circ. Praça dos Mercados", bairro: "Palco Gerson Filho", emoji: "🎸", pontos: 40, cor: "#C4521A" },
  { id: 5, nome: "Rua São João", bairro: "Bairro Industrial", emoji: "🎵", pontos: 35, cor: "#E8B84B" },
];

const recompensas = [
  {
    id: 1,
    titulo: "Forrozeiro Iniciante",
    descricao: "Visite 1 palco",
    pontos: 35,
    icone: "🌵",
    nivel: 1,
  },
  {
    id: 2,
    titulo: "Arrastapé Animado",
    descricao: "Visite 2 palcos",
    pontos: 75,
    icone: "👢",
    nivel: 2,
  },
  {
    id: 3,
    titulo: "Sanfoneiro do Sertão",
    descricao: "Visite 3 palcos",
    pontos: 125,
    icone: "🪗",
    nivel: 3,
  },
  {
    id: 4,
    titulo: "Rei/Rainha do Forró",
    descricao: "Visite todos os palcos",
    pontos: 200,
    icone: "👑",
    nivel: 5,
  },
];

export default function PassaportePage() {
  const [visitados, setVisitados] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("caju-passaporte-visitados");
    return saved ? new Set<number>(JSON.parse(saved)) : new Set<number>();
  });
  const [animandoSelo, setAnimandoSelo] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem("caju-passaporte-visitados", JSON.stringify(Array.from(visitados)));
  }, [visitados]);

  const visitadosArray = Array.from(visitados);
  const pontosTotais = visitadosArray.reduce((acc, id) => {
    const palco = palcosPassaporte.find((p) => p.id === id);
    return acc + (palco?.pontos ?? 0);
  }, 0);

  const handleCheckin = (palcoId: number) => {
    if (visitados.has(palcoId)) {
      toast.info("Você já visitou este palco!", { duration: 2000 });
      return;
    }
    setAnimandoSelo(palcoId);
    setTimeout(() => {
      setVisitados((prev) => { const next = new Set<number>(); prev.forEach((v) => next.add(v)); next.add(palcoId); return next; });
      setAnimandoSelo(null);
      const palco = palcosPassaporte.find((p) => p.id === palcoId);
      toast.success(`+${palco?.pontos} pontos! Palco ${palco?.nome} carimbado! 🎉`, {
        duration: 3000,
      });
    }, 600);
  };

  const nivelAtual = recompensas.filter((r) => pontosTotais >= r.pontos).length;

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--background)" }}>
      {/* Header com imagem do passaporte */}
      <div className="relative">
        <div
          className="px-4 pt-5 pb-4"
          style={{ background: "var(--primary)" }}
        >
          <div className="flex items-start gap-4">
            <img
              src={PASSPORT_IMG}
              alt="Passaporte Cultural"
              className="w-20 h-20 rounded-xl object-cover shadow-lg flex-shrink-0"
            />
            <div className="flex-1">
              <p
                className="text-xs font-semibold uppercase tracking-widest mb-1"
                style={{ color: "oklch(0.75 0.14 72)" }}
              >
                Passaporte Cultural
              </p>
              <h1
                className="text-2xl font-bold text-white leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Forró Caju 2026
              </h1>
              <p className="text-white/60 text-xs mt-1">Aracaju, Sergipe · Maio/Junho</p>
            </div>
          </div>

          {/* Pontuação */}
          <div className="mt-4 flex items-center gap-4">
            <div
              className="flex-1 rounded-xl p-3"
              style={{ background: "oklch(1 0 0 / 0.08)" }}
            >
              <div className="flex items-center gap-2">
                <Zap size={16} style={{ color: "oklch(0.75 0.14 72)" }} />
                <span className="text-xs text-white/60">Pontos</span>
              </div>
              <p
                className="text-2xl font-bold mt-1"
                style={{ fontFamily: "var(--font-serif)", color: "oklch(0.75 0.14 72)" }}
              >
                {pontosTotais}
              </p>
            </div>
            <div
              className="flex-1 rounded-xl p-3"
              style={{ background: "oklch(1 0 0 / 0.08)" }}
            >
              <div className="flex items-center gap-2">
                <Star size={16} style={{ color: "oklch(0.75 0.14 72)" }} />
                <span className="text-xs text-white/60">Palcos</span>
              </div>
              <p
                className="text-2xl font-bold mt-1"
                style={{ fontFamily: "var(--font-serif)", color: "oklch(0.75 0.14 72)" }}
              >
                {visitados.size}/{palcosPassaporte.length}
              </p>
            </div>
            <div
              className="flex-1 rounded-xl p-3"
              style={{ background: "oklch(1 0 0 / 0.08)" }}
            >
              <div className="flex items-center gap-2">
                <Award size={16} style={{ color: "oklch(0.75 0.14 72)" }} />
                <span className="text-xs text-white/60">Nível</span>
              </div>
              <p
                className="text-2xl font-bold mt-1"
                style={{ fontFamily: "var(--font-serif)", color: "oklch(0.75 0.14 72)" }}
              >
                {nivelAtual}/{recompensas.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bandeirola-line" />

      <div className="px-4 pt-4">
        {/* Selos dos palcos */}
        <h2 className="section-title text-base mb-3">
          Carimbe os Palcos
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {palcosPassaporte.map((palco) => {
            const visitado = visitados.has(palco.id);
            const animando = animandoSelo === palco.id;

            return (
              <motion.button
                key={palco.id}
                onClick={() => handleCheckin(palco.id)}
                whileTap={{ scale: 0.96 }}
                className="relative rounded-2xl p-4 text-left overflow-hidden shadow-sm"
                style={{
                  background: visitado ? palco.cor : "var(--card)",
                  border: visitado ? "none" : `2px dashed ${palco.cor}40`,
                }}
              >
                {/* Emoji grande */}
                <div className="text-3xl mb-2">{palco.emoji}</div>
                <p
                  className="text-sm font-semibold leading-tight"
                  style={{
                    fontFamily: "var(--font-serif)",
                    color: visitado ? "white" : "var(--foreground)",
                  }}
                >
                  {palco.nome}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: visitado ? "rgba(255,255,255,0.7)" : "var(--muted-foreground)" }}
                >
                  {palco.bairro}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Zap size={10} style={{ color: visitado ? "rgba(255,255,255,0.8)" : palco.cor }} />
                  <span
                    className="text-xs font-semibold"
                    style={{ color: visitado ? "rgba(255,255,255,0.8)" : palco.cor }}
                  >
                    +{palco.pontos} pts
                  </span>
                </div>

                {/* Selo de visitado */}
                <AnimatePresence>
                  {(visitado || animando) && (
                    <motion.div
                      initial={{ scale: 1.4, rotate: -8, opacity: 0 }}
                      animate={{ scale: 1, rotate: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="absolute top-2 right-2"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: "rgba(255,255,255,0.25)" }}
                      >
                        <CheckCircle2 size={18} color="white" fill="rgba(255,255,255,0.3)" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Instrução para não visitados */}
                {!visitado && !animando && (
                  <div
                    className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${palco.cor}15`, color: palco.cor }}
                  >
                    Check-in
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Recompensas */}
        <h2 className="section-title text-base mb-3">
          Conquistas
        </h2>
        <div className="space-y-2 mb-6">
          {recompensas.map((r, i) => {
            const desbloqueada = pontosTotais >= r.pontos;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex items-center gap-3 p-3 rounded-xl"
                style={{
                  background: desbloqueada ? "var(--primary)" : "var(--card)",
                  opacity: desbloqueada ? 1 : 0.7,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{
                    background: desbloqueada ? "rgba(255,255,255,0.2)" : "var(--secondary)",
                    filter: desbloqueada ? "none" : "grayscale(1)",
                  }}
                >
                  {r.icone}
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{
                      fontFamily: "var(--font-serif)",
                      color: desbloqueada ? "white" : "var(--foreground)",
                    }}
                  >
                    {r.titulo}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: desbloqueada ? "rgba(255,255,255,0.7)" : "var(--muted-foreground)" }}
                  >
                    {r.descricao} · {r.pontos} pts
                  </p>
                </div>
                {desbloqueada ? (
                  <CheckCircle2 size={20} color="rgba(255,255,255,0.8)" />
                ) : (
                  <Lock size={16} style={{ color: "var(--muted-foreground)" }} />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Nota sobre QR Code */}
        <div
          className="rounded-2xl p-4 mb-4 text-center"
          style={{ background: "oklch(0.75 0.14 72 / 0.15)" }}
        >
          <p className="label-muted text-xs">
            📱 <strong>No evento real:</strong> escaneie o QR Code em cada palco para fazer o check-in automaticamente e ganhar pontos.
          </p>
        </div>
      </div>
    </div>
  );
}
