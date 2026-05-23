/*
 * CAJU GUIDE — Segurança & Acessibilidade
 * - Painel de preferências visuais (contraste, fonte, etc.)
 * - Deep link por categoria: /acessibilidade?cat=mobilidade
 * - Áudio (Web Speech API) — último recurso
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility, AlertCircle, MapPin, Phone,
  ChevronDown, ChevronUp, Heart, Brain, Eye,
  ZoomIn, Contrast, MousePointer, Minus, Plus,
  Volume2, VolumeX, RotateCcw, Type, Underline,
  Wind,
} from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useLocation } from "wouter";

// ─── Dados ──────────────────────────────────────────────────────────────────

const neurodivergenciaDicas = [
  {
    emoji: "🎧",
    titulo: "Proteção Auditiva",
    desc: "Leve fones de ouvido ou tampões. Muitos shows ultrapassam 90dB. Circ. Farolândia (início da noite) e Rua São João têm volume mais baixo.",
  },
  {
    emoji: "🌿",
    titulo: "Área de Descompressão",
    desc: "Há uma área tranquila 50m à esquerda do Palco Principal e no fundo do evento, com assentos e menos movimento.",
  },
  {
    emoji: "🔆",
    titulo: "Luz Estroboscópica",
    desc: "Presentes nos shows de destaque. Evite as primeiras filas se sensível a flashes.",
  },
  {
    emoji: "🗺️",
    titulo: "Rotina Prévia",
    desc: "Planeje horários e rotas antes. Use o filtro 🧠 Tranquilo na aba Programação para shows de baixa estimulação.",
  },
  {
    emoji: "🧍",
    titulo: "Pulseira de Alerta",
    desc: "Na entrada, informe à equipe sobre necessidades especiais. Receba uma pulseira de alerta para atendimento prioritário.",
  },
  {
    emoji: "📱",
    titulo: "Comunicação Alternativa",
    desc: "Equipe treinada em comunicação por texto/imagens na central para pessoas não-verbais.",
  },
];

export const categorias = [
  {
    id: "neuro",
    emoji: "🧠",
    titulo: "Autismo & Neurodivergência",
    cor: "#7B5CB8",
    destaque: true,
    itens: [
      "Área de descompressão sensorial próxima ao Palco Principal",
      "Atendimento especializado na Central (equipe treinada)",
      "Pulseira de alerta para necessidades especiais na entrada",
      "Shows de baixa estimulação: Circuito Farolândia (início da noite) e Rua São João",
      "Comunicação alternativa (texto/imagem) disponível",
      "Protetor auricular disponível na Central de Atendimento",
    ],
    info: "Use o filtro 🧠 Tranquilo na aba Programação para ver shows de baixo impacto sensorial.",
  },
  {
    id: "mobilidade",
    emoji: "♿",
    titulo: "Mobilidade Reduzida",
    cor: "#3A9E68",
    itens: [
      "Camarote da Acessibilidade no Palco Principal (120 vagas/noite)",
      "Rampa de acesso em todos os palcos principais",
      "Estacionamento adaptado a 50m do Palco Principal",
      "Banheiros adaptados em todos os pontos",
      "Equipe de apoio para mobilidade",
      "Piso firme e nivelado nas áreas de circulação principal",
      "Cadeiras de rodas disponíveis para empréstimo na Central",
    ],
    info: "Apresente documento que comprove a deficiência na entrada para acessar o camarote.",
  },
  {
    id: "auditiva",
    emoji: "🤟",
    titulo: "Deficiência Auditiva & Libras",
    cor: "#D4A017",
    itens: [
      "Intérprete de Libras no Palco Principal (shows selecionados)",
      "Área vibrotátil próxima ao palco — sente a música pelo chão",
      "Fones de redução de ruído disponíveis na Central",
      "Avisos visuais em telões para mudanças de programação",
      "Shows com Libras: Alceu Valença, Elba Ramalho, Simone Mendes, Solange Almeida",
    ],
    info: "Intérpretes disponíveis nos shows de destaque. Consulte os badges 🤟 na Programação.",
  },
  {
    id: "visual",
    emoji: "👁️",
    titulo: "Deficiência Visual & Baixa Visão",
    cor: "#E8521A",
    itens: [
      "Piso tátil nas rotas de acesso principais",
      "Equipe de apoio treinada na entrada — peça acompanhamento",
      "Descrição verbal do ambiente e palco disponível",
      "App compatível com leitores de tela (VoiceOver / TalkBack)",
      "Ajuste de contraste e fonte disponível neste painel (acima)",
      "Narração em áudio das telas — botão 🔊 no painel de acessibilidade",
    ],
    info: "Use o painel acima para aumentar o contraste e fonte para baixa visão.",
  },
  {
    id: "fisica",
    emoji: "🦽",
    titulo: "Pessoa com Deficiência Física",
    cor: "#2563EB",
    itens: [
      "Acesso prioritário em todos os circuitos",
      "Banheiros adaptados com barras de apoio",
      "Área reservada próxima ao palco com boa visibilidade",
      "Transporte adaptado disponível (contate a Central com antecedência)",
      "Equipe de apoio disponível 24h durante o evento",
      "Entrada antecipada para facilitar o deslocamento",
      "Rotas alternativas sem escadas ou degraus",
    ],
    info: "Entre em contato com a Central antes do evento para organizar suporte personalizado.",
  },
  {
    id: "criancas",
    emoji: "👧",
    titulo: "Monitoramento de Crianças",
    cor: "#8B2020",
    itens: [
      "Pulseira de identificação com QR Code (retirar na entrada)",
      "Pontos de encontro sinalizados em cada bairro",
      "Guarda Municipal presente em todos os pontos",
      "App de localização de crianças (aba Localização)",
      "Foto da criança registrada no sistema de segurança",
    ],
    info: "Crianças menores de 12 anos devem estar acompanhadas. Registre na entrada.",
  },
];

const pontosSuporte = [
  { nome: "Central de Atendimento", local: "Praça Fausto Cardoso", telefone: "(79) 3179-1000", icon: "📍" },
  { nome: "Posto Médico", local: "Próximo ao Palco Principal", telefone: "(79) 3179-1001", icon: "⚕️" },
  { nome: "Guarda Municipal", local: "Todos os pontos do evento", telefone: "153", icon: "👮" },
  { nome: "Polícia Militar", local: "Perímetro do evento", telefone: "190", icon: "🚔" },
];

// ─── Componentes ────────────────────────────────────────────────────────────

function Toggle({
  ativo,
  onClick,
  children,
  cor = "var(--primary)",
}: {
  ativo: boolean;
  onClick: () => void;
  children: React.ReactNode;
  cor?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={ativo}
      className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
      style={{
        background: ativo ? `${cor}22` : "var(--secondary)",
        border: `1.5px solid ${ativo ? cor : "var(--border)"}`,
        color: ativo ? cor : "var(--foreground)",
      }}
    >
      {children}
      <div
        className="w-10 h-5 rounded-full flex items-center transition-all flex-shrink-0 ml-2"
        style={{
          background: ativo ? cor : "var(--muted)",
          justifyContent: ativo ? "flex-end" : "flex-start",
          padding: "2px",
        }}
      >
        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
      </div>
    </button>
  );
}

function PainelAcessibilidade() {
  const {
    prefs,
    setContraste,
    setTamanhoFonte,
    toggleEspacamento,
    toggleAnimacoes,
    toggleCursor,
    toggleSublinhar,
    toggleAudio,
    resetPrefs,
    falarTexto,
    pararAudio,
  } = useAccessibility();

  const fonteLabels = { normal: "Normal", grande: "Grande", "muito-grande": "Muito Grande" };
  const contrastLabels = { normal: "Normal", alto: "Alto Contraste", invertido: "Invertido" };

  function handleAudio() {
    if (prefs.audioAtivo) {
      pararAudio();
      toggleAudio();
    } else {
      toggleAudio();
      falarTexto(
        "Modo de narração ativado. Este é o Caju Guide, guia de acessibilidade do Forró Caju 2026 em Aracaju, Sergipe. " +
        "Use o menu inferior para navegar entre Programação, Mapa, Localização, Acessibilidade e Passaporte."
      );
    }
  }

  return (
    <div
      className="mx-4 mt-4 rounded-2xl overflow-hidden"
      style={{ border: "1.5px solid var(--primary)", background: "var(--card)" }}
      role="region"
      aria-label="Painel de acessibilidade visual"
    >
      {/* Header do painel */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid var(--border)", background: "rgba(232,82,26,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <Accessibility size={18} style={{ color: "var(--primary)" }} />
          <span className="font-semibold text-sm" style={{ fontFamily: "var(--font-serif)" }}>
            Preferências de Acessibilidade
          </span>
        </div>
        <button
          onClick={resetPrefs}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg"
          style={{ color: "var(--muted-foreground)", background: "var(--secondary)" }}
          aria-label="Redefinir todas as preferências"
          title="Redefinir tudo"
        >
          <RotateCcw size={11} />
          Redefinir
        </button>
      </div>

      <div className="p-4 space-y-4">

        {/* Contraste */}
        <div>
          <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
            <Contrast size={13} /> Contraste
          </p>
          <div className="flex gap-2">
            {(["normal", "alto", "invertido"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setContraste(c)}
                aria-pressed={prefs.contraste === c}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: prefs.contraste === c ? "var(--primary)" : "var(--secondary)",
                  color: prefs.contraste === c ? "white" : "var(--foreground)",
                  border: `1.5px solid ${prefs.contraste === c ? "var(--primary)" : "var(--border)"}`,
                }}
              >
                {contrastLabels[c]}
              </button>
            ))}
          </div>
        </div>

        {/* Tamanho da fonte */}
        <div>
          <p className="text-xs font-semibold mb-2 flex items-center gap-1.5" style={{ color: "var(--muted-foreground)" }}>
            <Type size={13} /> Tamanho do Texto
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (prefs.tamanhoFonte === "muito-grande") setTamanhoFonte("grande");
                else if (prefs.tamanhoFonte === "grande") setTamanhoFonte("normal");
              }}
              disabled={prefs.tamanhoFonte === "normal"}
              aria-label="Diminuir fonte"
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: "var(--secondary)",
                border: "1.5px solid var(--border)",
                opacity: prefs.tamanhoFonte === "normal" ? 0.4 : 1,
              }}
            >
              <Minus size={14} />
            </button>
            <div className="flex-1 text-center">
              <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                {fonteLabels[prefs.tamanhoFonte]}
              </span>
              <div className="flex justify-center gap-1 mt-1">
                {(["normal", "grande", "muito-grande"] as const).map((f) => (
                  <div
                    key={f}
                    className="w-1.5 h-1.5 rounded-full transition-all"
                    style={{ background: prefs.tamanhoFonte === f ? "var(--primary)" : "var(--border)" }}
                  />
                ))}
              </div>
            </div>
            <button
              onClick={() => {
                if (prefs.tamanhoFonte === "normal") setTamanhoFonte("grande");
                else if (prefs.tamanhoFonte === "grande") setTamanhoFonte("muito-grande");
              }}
              disabled={prefs.tamanhoFonte === "muito-grande"}
              aria-label="Aumentar fonte"
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
              style={{
                background: "var(--secondary)",
                border: "1.5px solid var(--border)",
                opacity: prefs.tamanhoFonte === "muito-grande" ? 0.4 : 1,
              }}
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-2">
          <Toggle ativo={prefs.espacamentoLetras} onClick={toggleEspacamento} cor="#3A9E68">
            <span className="flex items-center gap-2">
              <Type size={14} />
              Espaçamento entre letras
            </span>
          </Toggle>

          <Toggle ativo={prefs.reduzirAnimacoes} onClick={toggleAnimacoes} cor="#D4A017">
            <span className="flex items-center gap-2">
              <Wind size={14} />
              Reduzir animações
            </span>
          </Toggle>

          <Toggle ativo={prefs.cursorGrande} onClick={toggleCursor} cor="#7B5CB8">
            <span className="flex items-center gap-2">
              <MousePointer size={14} />
              Cursor grande
            </span>
          </Toggle>

          <Toggle ativo={prefs.sublinharLinks} onClick={toggleSublinhar} cor="#2563EB">
            <span className="flex items-center gap-2">
              <Underline size={14} />
              Sublinhar links
            </span>
          </Toggle>
        </div>

        {/* Áudio / Narração */}
        <div
          className="rounded-xl p-3"
          style={{ background: prefs.audioAtivo ? "rgba(59,130,246,0.1)" : "var(--secondary)", border: `1.5px solid ${prefs.audioAtivo ? "#3B82F6" : "var(--border)"}` }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {prefs.audioAtivo ? (
                <Volume2 size={16} style={{ color: "#3B82F6" }} />
              ) : (
                <VolumeX size={16} style={{ color: "var(--muted-foreground)" }} />
              )}
              <div>
                <p className="text-xs font-semibold" style={{ color: prefs.audioAtivo ? "#3B82F6" : "var(--foreground)" }}>
                  Narração em Áudio
                </p>
                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                  Lê o conteúdo em voz alta (pt-BR)
                </p>
              </div>
            </div>
            <button
              onClick={handleAudio}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: prefs.audioAtivo ? "#3B82F6" : "var(--primary)",
                color: "white",
              }}
              aria-label={prefs.audioAtivo ? "Desativar narração" : "Ativar narração"}
            >
              {prefs.audioAtivo ? "Parar" : "Ativar"}
            </button>
          </div>
          {prefs.audioAtivo && (
            <p className="text-[11px] mt-2 pt-2" style={{ borderTop: "1px solid var(--border)", color: "var(--muted-foreground)" }}>
              💡 Toque em qualquer texto para ouvir. Compatible com VoiceOver e TalkBack.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

function CategoriaCard({
  cat,
  abertoPorPadrao = false,
}: {
  cat: typeof categorias[0];
  abertoPorPadrao?: boolean;
}) {
  const [aberto, setAberto] = useState(abertoPorPadrao);
  const ref = useRef<HTMLDivElement>(null);
  const { prefs, falarTexto } = useAccessibility();

  // Scroll para o card quando aberto por deep link
  useEffect(() => {
    if (abertoPorPadrao && ref.current) {
      setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  }, [abertoPorPadrao]);

  function handleClick() {
    if (prefs.audioAtivo) {
      falarTexto(`${cat.titulo}. ${cat.itens.join(". ")}`);
    }
    setAberto(!aberto);
  }

  return (
    <motion.div
      ref={ref}
      layout
      className="rounded-xl overflow-hidden border transition-all"
      style={{
        background: "var(--card)",
        borderColor: abertoPorPadrao ? cat.cor : "var(--border)",
        borderLeft: `4px solid ${cat.cor}`,
        boxShadow: abertoPorPadrao ? `0 0 0 2px ${cat.cor}30` : undefined,
      }}
    >
      <button
        onClick={handleClick}
        aria-expanded={aberto}
        aria-controls={`categoria-${cat.id}`}
        className="w-full flex items-center justify-between p-3"
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-lg" role="img" aria-label={cat.titulo}>{cat.emoji}</span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                className="font-semibold text-sm"
                style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }}
              >
                {cat.titulo}
              </h3>
              {cat.destaque && (
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: `${cat.cor}20`, color: cat.cor }}
                >
                  FOCO
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {cat.itens.length} recursos disponíveis
            </p>
          </div>
        </div>
        {aberto ? (
          <ChevronUp size={16} style={{ color: "var(--muted-foreground)" }} />
        ) : (
          <ChevronDown size={16} style={{ color: "var(--muted-foreground)" }} />
        )}
      </button>

      <AnimatePresence>
        {aberto && (
          <motion.div
            id={`categoria-${cat.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 space-y-2">
              <div style={{ height: "1px", background: "var(--border)" }} />
              {cat.itens.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1"
                    style={{ background: cat.cor }}
                  />
                  <span className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                    {item}
                  </span>
                </div>
              ))}
              <div
                className="rounded-lg p-2.5 text-xs mt-2"
                style={{
                  background: `${cat.cor}12`,
                  color: "var(--muted-foreground)",
                  borderLeft: `2px solid ${cat.cor}`,
                }}
              >
                ℹ️ {cat.info}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function AcessibilidadePage() {
  // Lê ?cat=mobilidade da URL para abrir categoria via deep link
  const [location] = useLocation();
  const catParam = new URLSearchParams(window.location.search).get("cat") ?? "";
  const { prefs, falarTexto } = useAccessibility();

  useEffect(() => {
    if (prefs.audioAtivo) {
      falarTexto("Página de Segurança e Acessibilidade do Forró Caju 2026. Aqui você encontra recursos de acessibilidade para todos os públicos.");
    }
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{ paddingBottom: "80px", background: "var(--background)" }}
    >
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex-shrink-0 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <Heart size={20} style={{ color: "var(--destructive)" }} aria-hidden="true" />
          <h1 className="page-title text-xl">Segurança & Acessibilidade</h1>
        </div>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          O Forró Caju é para todos. Configure o app e veja recursos por necessidade.
        </p>
      </div>

      {/* ── Painel de preferências visuais ── */}
      <PainelAcessibilidade />

      {/* ── Destaque: Neurodivergência ── */}
      <div
        className="mx-4 mt-4 rounded-2xl overflow-hidden"
        style={{
          border: "1.5px solid oklch(0.55 0.20 290 / 0.4)",
          background: "oklch(0.55 0.20 290 / 0.07)",
        }}
      >
        <div
          className="px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ borderBottom: "1px solid oklch(0.55 0.20 290 / 0.2)" }}
        >
          <Brain size={22} style={{ color: "#7B5CB8" }} aria-hidden="true" />
          <div>
            <h2 className="section-title text-sm" style={{ color: "#7B5CB8" }}>
              Guia para Neurodivergentes & Autismo
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              Foco central da nossa trilha de acessibilidade
            </p>
          </div>
        </div>
        <div className="p-3 grid grid-cols-1 gap-2">
          {neurodivergenciaDicas.map((dica, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-start gap-3 p-2.5 rounded-xl"
              style={{ background: "var(--card)", border: "1px solid var(--border)" }}
            >
              <span className="text-xl flex-shrink-0" role="img" aria-label={dica.titulo}>
                {dica.emoji}
              </span>
              <div>
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                  {dica.titulo}
                </p>
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                  {dica.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Alerta crianças ── */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-4 mt-3 p-3 rounded-lg border-l-4 flex gap-3"
        style={{ background: "oklch(0.52 0.16 18 / 0.1)", borderColor: "#8B2020" }}
        role="alert"
      >
        <AlertCircle size={16} style={{ color: "#8B2020", flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
        <div>
          <p className="text-xs font-semibold" style={{ color: "#8B2020" }}>
            Crianças Perdidas
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
            Registre sua criança na entrada. Equipe de segurança está preparada.
          </p>
        </div>
      </motion.div>

      {/* ── Categorias de acessibilidade ── */}
      <div className="flex-1 px-4 py-4 space-y-3">
        <h2 className="section-title text-sm">Recursos por Necessidade</h2>
        {categorias.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.07 }}
          >
            <CategoriaCard
              cat={cat}
              abertoPorPadrao={catParam === cat.id || (catParam === "" && cat.id === "neuro")}
            />
          </motion.div>
        ))}
      </div>

      {/* ── Pontos de suporte ── */}
      <div className="px-4 py-4 border-t border-border">
        <h2 className="section-title text-sm mb-3">📞 Pontos de Suporte</h2>
        <div className="space-y-2">
          {pontosSuporte.map((ponto, idx) => (
            <motion.a
              key={idx}
              href={`tel:${ponto.telefone.replace(/\D/g, "")}`}
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              aria-label={`Ligar para ${ponto.nome}: ${ponto.telefone}`}
              className="flex items-start justify-between p-2.5 rounded-lg border border-border hover:border-primary transition-colors"
              style={{ background: "var(--card)" }}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                  {ponto.nome}
                </p>
                <div className="flex items-center gap-1 mt-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
                  <MapPin size={10} aria-hidden="true" />
                  {ponto.local}
                </div>
              </div>
              <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                <Phone size={12} style={{ color: "var(--primary)" }} aria-hidden="true" />
                <span className="text-xs font-mono font-semibold" style={{ color: "var(--primary)" }}>
                  {ponto.telefone}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 border-t border-border">
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          💡 <strong>Dica:</strong> Tire uma foto do seu filho(a) antes do evento. Se se perder, mostre a foto à Guarda Municipal.
        </p>
      </div>
    </div>
  );
}
