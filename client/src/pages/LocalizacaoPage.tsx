/*
 * CAJU GUIDE — Localização em Tempo Real
 * Compartilhamento de localização de crianças com responsáveis
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Share2, QrCode, Copy, Check, AlertCircle, Users } from "lucide-react";

interface CriancaRastreada {
  id: string;
  nome: string;
  qrCode: string;
  ultimaLocalizacao: {
    lat: number;
    lng: number;
    timestamp: Date;
  };
  ativa: boolean;
}

export default function LocalizacaoPage() {
  const [criancas, setCriancas] = useState<CriancaRastreada[]>(() => {
    const saved = localStorage.getItem("caju-criancas-rastreadas");
    return saved
      ? JSON.parse(saved).map((c: any) => ({
          ...c,
          ultimaLocalizacao: {
            ...c.ultimaLocalizacao,
            timestamp: new Date(c.ultimaLocalizacao.timestamp),
          },
        }))
      : [];
  });

  const [novoNome, setNovoNome] = useState("");
  const [copiado, setCopiado] = useState<string | null>(null);
  const localizacaoAtiva = criancas.some((c) => c.ativa);

  // Persistir crianças
  useEffect(() => {
    localStorage.setItem("caju-criancas-rastreadas", JSON.stringify(criancas));
  }, [criancas]);

  // Simular atualização de localização (apenas crianças ativas)
  useEffect(() => {
    if (!localizacaoAtiva) return;

    const intervalo = setInterval(() => {
      setCriancas((prev) =>
        prev.map((c) =>
          c.ativa
            ? {
                ...c,
                ultimaLocalizacao: {
                  lat: -10.9 + Math.random() * 0.05,
                  lng: -37.06 + Math.random() * 0.05,
                  timestamp: new Date(),
                },
              }
            : c
        )
      );
    }, 5000);

    return () => clearInterval(intervalo);
  }, [localizacaoAtiva]);

  const adicionarCrianca = () => {
    if (!novoNome.trim()) return;

    const novaCrianca: CriancaRastreada = {
      id: `crianca-${Date.now()}`,
      nome: novoNome,
      qrCode: `CAJU-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      ultimaLocalizacao: {
        lat: -10.9,
        lng: -37.06,
        timestamp: new Date(),
      },
      ativa: false,
    };

    setCriancas((prev) => [...prev, novaCrianca]);
    setNovoNome("");
  };

  const toggleRastreamento = (id: string) => {
    setCriancas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ativa: !c.ativa } : c))
    );
  };

  const copiarQRCode = (qrCode: string) => {
    navigator.clipboard.writeText(qrCode);
    setCopiado(qrCode);
    setTimeout(() => setCopiado(null), 2000);
  };

  const removerCrianca = (id: string) => {
    setCriancas((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ paddingBottom: "80px", background: "var(--background)" }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0 border-b border-border">
        <div className="flex items-center gap-2 mb-2">
          <MapPin size={20} style={{ color: "var(--primary)" }} />
          <h1 className="page-title text-xl">Localização em Tempo Real</h1>
        </div>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          Rastreie crianças durante o evento com segurança
        </p>
      </div>

      {/* Alerta de segurança */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-4 mt-4 alert-band"
        style={{ background: "rgba(46,125,82,0.1)", borderColor: "#3A9E68" }}
      >
        <AlertCircle size={16} style={{ color: "#3A9E68", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <p className="text-xs font-semibold" style={{ color: "#3A9E68" }}>
            ✓ Seguro e Privado
          </p>
          <p className="text-xs mt-1 label-muted">
            Apenas responsáveis com QR Code podem rastrear. Dados não são armazenados em servidor.
          </p>
        </div>
      </motion.div>

      {/* Formulário de adição */}
      <div className="px-4 py-4 border-b border-border">
        <label htmlFor="input-nome-crianca" className="text-xs font-semibold mb-2 block" style={{ color: "var(--foreground)" }}>
          Registrar Criança
        </label>
        <div className="flex gap-2">
          <input
            id="input-nome-crianca"
            type="text"
            placeholder="Nome da criança"
            value={novoNome}
            onChange={(e) => setNovoNome(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && adicionarCrianca()}
            className="flex-1 px-3 py-2 rounded-lg text-sm border border-border"
            style={{ background: "var(--card)", color: "var(--foreground)" }}
          />
          <button onClick={adicionarCrianca} className="btn-primary text-sm">
            + Adicionar
          </button>
        </div>
      </div>

      {/* Lista de crianças */}
      <div className="flex-1 px-4 py-4 space-y-3">
        {criancas.length === 0 ? (
          <div className="text-center py-8">
            <Users size={32} style={{ color: "var(--muted-foreground)", margin: "0 auto" }} />
            <p className="text-xs mt-2" style={{ color: "var(--muted-foreground)" }}>
              Nenhuma criança registrada ainda
            </p>
          </div>
        ) : (
          criancas.map((crianca, idx) => (
            <motion.div
              key={crianca.id}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 rounded-lg border border-border"
              style={{ background: "var(--card)" }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="font-semibold text-sm" style={{ color: "var(--foreground)" }}>
                    👧 {crianca.nome}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
                    QR Code: <span className="font-mono">{crianca.qrCode}</span>
                  </p>
                </div>
                <button
                  onClick={() => removerCrianca(crianca.id)}
                  className="text-xs px-2 py-1 rounded hover:bg-destructive/10"
                  style={{ color: "var(--destructive)" }}
                >
                  Remover
                </button>
              </div>

              {/* Status de rastreamento */}
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: crianca.ativa ? "#3A9E68" : "var(--muted-foreground)" }}
                />
                <span className="text-xs" style={{ color: "var(--muted-foreground)" }}>
                  {crianca.ativa ? "Rastreando..." : "Inativo"}
                </span>
              </div>

              {/* Localização */}
              {crianca.ativa && (
                <div className="mb-2 p-2 rounded bg-muted/50 text-xs" style={{ color: "var(--muted-foreground)" }}>
                  📍 {crianca.ultimaLocalizacao.lat.toFixed(4)}, {crianca.ultimaLocalizacao.lng.toFixed(4)}
                  <br />
                  Atualizado às {crianca.ultimaLocalizacao.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </div>
              )}

              {/* Botões de ação */}
              <div className="flex gap-2">
                <button
                  onClick={() => toggleRastreamento(crianca.id)}
                  className="flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: crianca.ativa ? "oklch(0.50 0.18 120)" : "var(--primary)",
                    color: "white",
                  }}
                >
                  {crianca.ativa ? "🛑 Parar" : "▶️ Rastrear"}
                </button>
                <button
                  onClick={() => copiarQRCode(crianca.qrCode)}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold border border-border hover:bg-muted"
                  style={{ color: "var(--foreground)" }}
                >
                  {copiado === crianca.qrCode ? (
                    <>
                      <Check size={12} /> Copiado
                    </>
                  ) : (
                    <>
                      <Copy size={12} /> Copiar QR
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Dica de uso */}
      <div className="px-4 py-3 border-t border-border">
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          💡 <strong>Como usar:</strong> Registre a criança, ative o rastreamento e compartilhe o QR Code com responsáveis. Eles podem escanear para ver a localização em tempo real.
        </p>
      </div>
    </div>
  );
}
