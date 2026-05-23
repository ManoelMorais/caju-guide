/*
 * CAJU GUIDE — Segurança & Acessibilidade
 * Foco especial: Neurodivergência e Autismo
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Accessibility, AlertCircle, MapPin, Phone,
  ChevronDown, ChevronUp, Heart, Brain, Volume2, Sparkles,
} from "lucide-react";

// Seção especial neurodivergência no topo
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
    desc: "Presentes nos shows de destaque (Flávio José e Mastruz com Leite). Evite as primeiras filas se sensível a flashes.",
  },
  {
    emoji: "🗺️",
    titulo: "Rotina Prévia",
    desc: "Planeje horários e rotas antes. Use o filtro 🧠 Tranquilo na aba Programação para identificar shows de baixa estimulação.",
  },
  {
    emoji: "🧍",
    titulo: "Pulseira de Alerta",
    desc: "Na entrada, informe à equipe sobre necessidades especiais. Receba uma pulseira de alerta de cor específica para atendimento prioritário.",
  },
  {
    emoji: "📱",
    titulo: "Comunicação Alternativa",
    desc: "Equipe treinada em comunicação por texto/imagens na central de atendimento para pessoas não-verbais.",
  },
];

const categorias = [
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
    ],
    info: "Apresente documento que comprove a deficiência na entrada para acessar o camarote.",
  },
  {
    id: "auditiva",
    emoji: "👂",
    titulo: "Deficiência Auditiva",
    cor: "#D4A017",
    itens: [
      "Intérprete de Libras no Palco Principal (shows selecionados)",
      "Área vibrotátil próxima ao palco (sente a música)",
      "Fones de redução de ruído disponíveis",
      "Avisos visuais para mudanças de programação",
    ],
    info: "Intérpretes disponíveis nos shows de destaque. Consulte a programação.",
  },
  {
    id: "visual",
    emoji: "👁️",
    titulo: "Deficiência Visual",
    cor: "#E8521A",
    itens: [
      "Guia de áudio disponível neste app",
      "Piso tátil nas rotas de acesso principais",
      "Equipe de apoio treinada na entrada",
      "Descrição verbal do ambiente e palco",
      "Ative o leitor de tela do seu dispositivo",
    ],
    info: "Nosso app é totalmente compatível com leitores de tela.",
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
      "Foto da criança no sistema de segurança",
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

function CategoriaCard({ cat }: { cat: typeof categorias[0] }) {
  const [aberto, setAberto] = useState(cat.id === "neuro");

  return (
    <motion.div
      layout
      className="rounded-xl overflow-hidden border transition-all"
      style={{
        background: "var(--card)",
        borderColor: cat.destaque ? `${cat.cor}` : "var(--border)",
        borderLeft: `4px solid ${cat.cor}`,
        boxShadow: cat.destaque ? `0 0 0 1px ${cat.cor}30` : undefined,
      }}
    >
      <button
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
        aria-controls={`categoria-${cat.id}`}
        className="w-full flex items-center justify-between p-3"
      >
        <div className="flex items-center gap-3 text-left">
          <span className="text-lg">{cat.emoji}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm" style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }}>
                {cat.titulo}
              </h3>
              {cat.destaque && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: `${cat.cor}20`, color: cat.cor }}>
                  FOCO
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {cat.itens.length} recursos
            </p>
          </div>
        </div>
        {aberto ? (
          <ChevronUp size={16} style={{ color: "var(--muted-foreground)" }} />
        ) : (
          <ChevronDown size={16} style={{ color: "var(--muted-foreground)" }} />
        )}
      </button>

      {aberto && (
        <motion.div
          id={`categoria-${cat.id}`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="px-3 pb-3 space-y-2">
            <div style={{ height: "1px", background: "var(--border)" }} />
            {cat.itens.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: cat.cor }} />
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
    </motion.div>
  );
}

export default function AcessibilidadePage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ paddingBottom: "80px", background: "var(--background)" }}>
      {/* Header */}
      <div className="px-4 pt-5 pb-3 flex-shrink-0 border-b border-border">
        <div className="flex items-center gap-2 mb-1">
          <Heart size={20} style={{ color: "var(--destructive)" }} />
          <h1 className="page-title text-xl">
            Segurança & Acessibilidade
          </h1>
        </div>
        <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
          O Forró Caju é para todos. Informações práticas e reais.
        </p>
      </div>

      {/* DESTAQUE: Neurodivergência */}
      <div className="mx-4 mt-4 rounded-2xl overflow-hidden"
        style={{ border: "1.5px solid oklch(0.55 0.20 290 / 0.4)", background: "oklch(0.55 0.20 290 / 0.07)" }}>
        <div className="px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ borderBottom: "1px solid oklch(0.55 0.20 290 / 0.2)" }}>
          <Brain size={22} style={{ color: "#7B5CB8" }} />
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
              <span className="text-xl flex-shrink-0">{dica.emoji}</span>
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

      {/* Alerta crianças */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mx-4 mt-3 p-3 rounded-lg border-l-4 flex gap-3"
        style={{ background: "oklch(0.52 0.16 18 / 0.1)", borderColor: "#8B2020" }}
      >
        <AlertCircle size={16} style={{ color: "#8B2020", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <p className="text-xs font-semibold" style={{ color: "#8B2020" }}>
            Crianças Perdidas
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--muted-foreground)" }}>
            Registre sua criança na entrada. Equipe de segurança está preparada.
          </p>
        </div>
      </motion.div>

      {/* Categorias */}
      <div className="flex-1 px-4 py-4 space-y-3">
        <h2 className="section-title text-sm">
          Recursos por Necessidade
        </h2>
        {categorias.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.08 }}
          >
            <CategoriaCard cat={cat} />
          </motion.div>
        ))}
      </div>

      {/* Pontos de suporte */}
      <div className="px-4 py-4 border-t border-border">
        <h2 className="section-title text-sm mb-3">
          📞 Pontos de Suporte
        </h2>
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
                  <MapPin size={10} />
                  {ponto.local}
                </div>
              </div>
              <div className="flex items-center gap-1.5 ml-2 flex-shrink-0">
                <Phone size={12} style={{ color: "var(--primary)" }} />
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
