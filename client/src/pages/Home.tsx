/*
 * CAJU GUIDE — Home (Programação)
 * Cards expansíveis + filtro pós-festa + foco neurodivergência
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, ChevronDown, ChevronUp, Star, Music, Heart,
  UtensilsCrossed, Users, Brain, Accessibility,
} from "lucide-react";
import { useAppContext } from "@/contexts/AppContext";

const HERO_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663687241893/XXZWs3abMYA25fSovCgD4y/caju-hero-GX2ajT8mYkDvixZcSsYr7M.webp";

const eventos = [
  { id: "Todos", label: "Todos", emoji: "🎶" },
  { id: "Forró Caju", label: "Forró Caju", emoji: "🎸" },
  { id: "Arraiá do Povo", label: "Arraiá do Povo", emoji: "🎪" },
  { id: "Segundona do Turista", label: "Segundona", emoji: "🎵" },
];

const locais = ["Todos", "Atalaia", "Farolândia", "Santos Dumont", "Centro", "Bairro Industrial"];

// Sugestões de pós-festa por bairro (dados locais representativos)
const posFesta: Record<string, { nome: string; tipo: string; distancia: string; nota: string; emoji: string }[]> = {
  Atalaia: [
    { nome: "Quiosque Orla Atalaia", tipo: "Frutos do Mar", distancia: "100m", nota: "4.8", emoji: "🦐" },
    { nome: "Bar do Forró Beach", tipo: "Bar", distancia: "50m", nota: "4.5", emoji: "🍺" },
    { nome: "Creperia da Orla", tipo: "Lanches", distancia: "200m", nota: "4.6", emoji: "🥞" },
  ],
  Farolândia: [
    { nome: "Tapioca da Dona Maria", tipo: "Comida Típica", distancia: "100m", nota: "4.9", emoji: "🥞" },
    { nome: "Bar do Sertão", tipo: "Petiscos", distancia: "250m", nota: "4.3", emoji: "🍻" },
    { nome: "Lanche do Conjunto", tipo: "Lanches", distancia: "150m", nota: "4.4", emoji: "🥪" },
  ],
  "Santos Dumont": [
    { nome: "Bodega Nordestina", tipo: "Nordestino", distancia: "200m", nota: "4.6", emoji: "🍗" },
    { nome: "Café do Forró", tipo: "Café", distancia: "80m", nota: "4.4", emoji: "☕" },
  ],
  Centro: [
    { nome: "Mercado Central de Aracaju", tipo: "Comida Típica", distancia: "200m", nota: "4.7", emoji: "🛒" },
    { nome: "Bar do Centro", tipo: "Petiscos", distancia: "150m", nota: "4.5", emoji: "🍻" },
    { nome: "Sorvetes Aracaju", tipo: "Sobremesa", distancia: "100m", nota: "4.6", emoji: "🍦" },
  ],
  "Bairro Industrial": [
    { nome: "Quitanda da Rua São João", tipo: "Comida Típica", distancia: "50m", nota: "4.8", emoji: "🌽" },
    { nome: "Barraca da Dona Zinha", tipo: "Nordestino", distancia: "30m", nota: "4.9", emoji: "🥘" },
  ],
};

// Mapeamento de show → evento
const showEvento: Record<number, string> = {
  1: "Arraiá do Povo",
  2: "Arraiá do Povo",
  3: "Arraiá do Povo",
  4: "Forró Caju",
  5: "Forró Caju",
  6: "Forró Caju",
  7: "Forró Caju",
  8: "Forró Caju",
  9: "Forró Caju",
  10: "Forró Caju",
  11: "Forró Caju",
  12: "Forró Caju",
  13: "Forró Caju",
  14: "Segundona do Turista",
};

// Programação real do ciclo junino 2026 — fontes: FUNCAP / FUNCAJU
const programacao = [
  // — ARRAIÁ DO POVO — Orla da Atalaia (29/Mai–28/Jun)
  {
    id: 1,
    artista: "Joelma",
    horario: "22:30",
    data: "30/05 (Sáb)",
    palco: "Palco Rogério — Orla da Atalaia",
    bairro: "Atalaia",
    genero: "Forró / Axé",
    lotacao: "alta",
    lotacaoLabel: "Lotação alta",
    destaque: true,
    acessivel: true,
    cor: "orange",
    descricao: "Rainha do Forró na abertura do Arraiá do Povo. Show imperdível na Orla da Atalaia com vista para o mar.",
    dicas: {
      neuro: [
        "Volume muito alto — protetor auricular obrigatório",
        "Efeitos visuais intensos: luzes coloridas e estroboscópicas",
        "Lotação máxima — chegue com 1h de antecedência",
        "Área de descompressão disponível na lateral esquerda do palco",
      ],
      capacidade: "~8.000 pessoas",
    },
  },
  {
    id: 2,
    artista: "Calcinha Preta",
    horario: "22:00",
    data: "29/05 (Sex)",
    palco: "Palco Rogério — Orla da Atalaia",
    bairro: "Atalaia",
    genero: "Forró Eletrônico",
    lotacao: "alta",
    lotacaoLabel: "Lotação alta",
    destaque: false,
    acessivel: true,
    cor: "orange",
    descricao: "Abertura do Arraiá do Povo com a banda mais querida do forró sergipano. Noite histórica na Orla.",
    dicas: {
      neuro: [
        "Volume alto (80–90dB) — protetor auricular recomendado",
        "Show animado com muita interação com o público",
        "Chegue cedo para garantir boa posição perto das saídas",
      ],
      capacidade: "~6.000 pessoas",
    },
  },
  {
    id: 3,
    artista: "Flávio José",
    horario: "22:30",
    data: "28/06 (Dom)",
    palco: "Palco Rogério — Orla da Atalaia",
    bairro: "Atalaia",
    genero: "Forró Tradicional",
    lotacao: "alta",
    lotacaoLabel: "Lotação alta",
    destaque: true,
    acessivel: true,
    cor: "amber",
    descricao: "Encerramento do Arraiá do Povo com o lendário Flávio José — um dos maiores nomes do forró tradicional nordestino.",
    dicas: {
      neuro: [
        "Volume alto — protetor auricular recomendado",
        "Repertório de clássicos — público mais adulto e relativamente calmo",
        "Luzes mais suaves, sem estroboscópicas intensas",
        "Área de descompressão disponível 50m à esquerda do palco",
      ],
      capacidade: "~7.000 pessoas",
    },
  },
  // — FORRÓ CAJU — Circuito Farolândia (04–06/Jun)
  {
    id: 4,
    artista: "Alceu Valença",
    horario: "23:30",
    data: "04/06 (Qui)",
    palco: "Circ. Farolândia — Praça Acrísio Garcez",
    bairro: "Farolândia",
    genero: "MPB Nordestina",
    lotacao: "alta",
    lotacaoLabel: "Lotação alta",
    destaque: true,
    acessivel: true,
    libras: true,
    cor: "orange",
    descricao: "Abertura do Forró Caju 2026 com Alceu Valença — lenda da MPB nordestina no Circuito Farolândia.",
    dicas: {
      neuro: [
        "Volume moderado — mais equilibrado para hipersensibilidade auditiva",
        "Repertório sofisticado, público mais calmo que shows de forró eletrônico",
        "Praça aberta com boa circulação de ar",
        "Sem grandes efeitos estroboscópicos",
      ],
      capacidade: "~3.000 pessoas",
    },
  },
  {
    id: 5,
    artista: "Trio Nordestino",
    horario: "20:30",
    data: "04/06 (Qui)",
    palco: "Circ. Farolândia — Praça Acrísio Garcez",
    bairro: "Farolândia",
    genero: "Forró Pé de Serra",
    lotacao: "baixa",
    lotacaoLabel: "Espaço disponível",
    destaque: false,
    acessivel: true,
    cor: "green",
    descricao: "Forró pé-de-serra raiz com sanfona, zabumba e triângulo — experiência tranquila para começar a noite.",
    dicas: {
      neuro: [
        "Volume baixo e controlado (55–70dB) — ótimo para hipersensibilidade",
        "Pouco público no início da noite — fácil entrada e saída",
        "Sem luzes estroboscópicas ou efeitos visuais intensos",
        "Ideal para quem prefere menos estimulação sensorial",
      ],
      capacidade: "~1.500 pessoas",
    },
  },
  {
    id: 6,
    artista: "Flávio José",
    horario: "22:00",
    data: "05/06 (Sex)",
    palco: "Circ. Farolândia — Praça Acrísio Garcez",
    bairro: "Farolândia",
    genero: "Forró Tradicional",
    lotacao: "alta",
    lotacaoLabel: "Lotação alta",
    destaque: true,
    acessivel: true,
    cor: "orange",
    descricao: "Homenagem ao 'Cancioneiro de Resistência' — Flávio José no Circuito Farolândia do Forró Caju 2026.",
    dicas: {
      neuro: [
        "Volume alto (80–95dB) — protetor auricular recomendado",
        "Chegue com 40 min de antecedência para boa posição",
        "Luzes estroboscópicas nos momentos de abertura",
        "Área tranquila disponível a 50m à esquerda do palco",
      ],
      capacidade: "~3.000 pessoas",
    },
  },
  {
    id: 7,
    artista: "Elba Ramalho",
    horario: "22:00",
    data: "06/06 (Sáb)",
    palco: "Circ. Farolândia — Praça Acrísio Garcez",
    bairro: "Farolândia",
    genero: "MPB Nordestina",
    lotacao: "alta",
    lotacaoLabel: "Lotação alta",
    destaque: true,
    acessivel: true,
    libras: true,
    cor: "amber",
    descricao: "Encerramento do Circuito Farolândia com Elba Ramalho — ícone da cultura nordestina com forró, baião e MPB.",
    dicas: {
      neuro: [
        "Show eclético e vibrante — repertório variado",
        "Volume moderado a alto — protetor auricular recomendado",
        "Público muito animado durante os clássicos",
      ],
      capacidade: "~3.000 pessoas",
    },
  },
  // — FORRÓ CAJU — Circuito Santos Dumont (12–13/Jun)
  {
    id: 8,
    artista: "Waldonys",
    horario: "22:00",
    data: "12/06 (Sex)",
    palco: "Circ. Santos Dumont — Praça Ulisses Guimarães",
    bairro: "Santos Dumont",
    genero: "Forró Universitário",
    lotacao: "media",
    lotacaoLabel: "Lotação moderada",
    destaque: false,
    acessivel: true,
    cor: "amber",
    descricao: "Forró universitário no Circuito Santos Dumont, levando a festa ao bairro.",
    dicas: {
      neuro: [
        "Volume moderado (70–80dB) — ambiente mais confortável",
        "Praça semi-aberta com boa circulação",
        "Público moderado — boa visibilidade chegando no horário",
      ],
      capacidade: "~2.000 pessoas",
    },
  },
  {
    id: 9,
    artista: "Jorge de Altinho",
    horario: "23:30",
    data: "13/06 (Sáb)",
    palco: "Circ. Santos Dumont — Praça Ulisses Guimarães",
    bairro: "Santos Dumont",
    genero: "Forró Pé de Serra",
    lotacao: "media",
    lotacaoLabel: "Lotação moderada",
    destaque: false,
    acessivel: false,
    cor: "green",
    descricao: "Forró tradicional com a voz inconfundível de Jorge de Altinho, encerrando o Circuito Santos Dumont.",
    dicas: {
      neuro: [
        "Volume controlado (60–75dB) — adequado para hipersensibilidade",
        "Show acústico mais tradicional com menos efeitos visuais",
        "Atenção: transmissão de jogo do Brasil pode atrasar o início",
      ],
      capacidade: "~2.000 pessoas",
    },
  },
  // — FORRÓ CAJU — Circuito Praça dos Mercados (20–28/Jun)
  {
    id: 10,
    artista: "Simone Mendes",
    horario: "00:00",
    data: "23/06 (Ter)",
    palco: "Circ. Praça dos Mercados — Centro",
    bairro: "Centro",
    genero: "Sertanejo / Forró Pop",
    lotacao: "alta",
    lotacaoLabel: "Lotação alta",
    destaque: true,
    acessivel: true,
    libras: true,
    cor: "orange",
    descricao: "Um dos maiores shows do Forró Caju 2026 — Simone Mendes arrasta o público no coração de Aracaju.",
    dicas: {
      neuro: [
        "Volume muito alto — protetor auricular obrigatório",
        "Efeitos visuais intensos: luzes coloridas e fogos",
        "Lotação máxima — chegar com 1h de antecedência",
        "Posições laterais oferecem mais espaço e saída fácil",
      ],
      capacidade: "~5.000 pessoas",
    },
  },
  {
    id: 11,
    artista: "Wesley Safadão",
    horario: "22:20",
    data: "27/06 (Sáb)",
    palco: "Circ. Praça dos Mercados — Centro",
    bairro: "Centro",
    genero: "Forró Eletrônico / Axé",
    lotacao: "alta",
    lotacaoLabel: "Lotação alta",
    destaque: true,
    acessivel: true,
    cor: "orange",
    descricao: "O Rei do Forró no Forró Caju — Wesley Safadão com todo seu repertório de hits no Centro de Aracaju.",
    dicas: {
      neuro: [
        "Volume extremamente alto (95dB+) — protetor auricular obrigatório",
        "Efeitos visuais intensos: luzes, fumaça e estroboscópicas",
        "Lotação máxima — chegue com 1h de antecedência",
        "Área de descompressão disponível na saída lateral",
      ],
      capacidade: "~6.000 pessoas",
    },
  },
  {
    id: 12,
    artista: "Mastruz com Leite",
    horario: "00:00",
    data: "27/06 (Sáb)",
    palco: "Circ. Praça dos Mercados — Centro",
    bairro: "Centro",
    genero: "Forró Eletrônico",
    lotacao: "alta",
    lotacaoLabel: "Lotação alta",
    destaque: false,
    acessivel: true,
    cor: "orange",
    descricao: "A banda mais completa do forró eletrônico, com efeitos especiais, na maior noite do Circuito Praça dos Mercados.",
    dicas: {
      neuro: [
        "Volume muito alto (95dB+) — protetor auricular obrigatório",
        "Efeitos visuais: luzes coloridas e estroboscópicas intensas",
        "Lotação máxima — muito movimento e contato físico",
        "Ir para o fundo do espaço reduz a estimulação",
      ],
      capacidade: "~6.000 pessoas",
    },
  },
  {
    id: 13,
    artista: "Solange Almeida",
    horario: "22:20",
    data: "28/06 (Dom)",
    palco: "Circ. Praça dos Mercados — Centro",
    bairro: "Centro",
    genero: "Forró Eletrônico",
    lotacao: "alta",
    lotacaoLabel: "Lotação alta",
    destaque: true,
    acessivel: true,
    libras: true,
    cor: "amber",
    descricao: "Encerramento do 33º Forró Caju — Solange Almeida fecha com chave de ouro o maior evento municipal de Aracaju.",
    dicas: {
      neuro: [
        "Volume alto — protetor auricular recomendado",
        "Atenção: fogos de artifício ao final — estímulo visual e auditivo intenso",
        "Área de descompressão disponível nas laterais",
      ],
      capacidade: "~6.000 pessoas",
    },
  },
  // — SEGUNDONA DO TURISTA — Rua São João (toda segunda-feira)
  {
    id: 14,
    artista: "Forró Pé de Serra",
    horario: "18:00",
    data: "Toda 2ª feira",
    palco: "Rua São João — Bairro Industrial",
    bairro: "Bairro Industrial",
    genero: "Forró Pé de Serra",
    lotacao: "baixa",
    lotacaoLabel: "Espaço disponível",
    destaque: false,
    acessivel: true,
    cor: "green",
    descricao: "Toda segunda-feira na histórica Rua São João — forró pé de serra, quadrilhas e comidas típicas. Tradição de 114 anos.",
    dicas: {
      neuro: [
        "Volume baixo e controlado — melhor ambiente para hipersensibilidade",
        "Rua fechada ao tráfego — ambiente familiar e acolhedor",
        "Grupos folclóricos e quadrilhas — estímulo visual moderado",
        "Ideal para famílias e primeira visita ao ciclo junino",
      ],
      capacidade: "~500 pessoas",
    },
  },
];

const lotacaoColors: Record<string, string> = {
  baixa: "#2E7D52",
  media: "#D4A017",
  alta: "#E8521A",
};

const cardBorderColors: Record<string, string> = {
  orange: "#E8521A",
  amber: "#D4A017",
  green: "#2E7D52",
};

function ShowCard({ show, isFav, onToggleFav }: {
  show: typeof programacao[0] & { libras?: boolean };
  isFav: boolean;
  onToggleFav: () => void;
}) {
  const [expandido, setExpandido] = useState(false);
  const [verPosShow, setVerPosShow] = useState(false);
  const posShowBairro = posFesta[show.bairro] || [];

  return (
    <motion.div
      layout
      className="rounded-2xl overflow-hidden shadow-sm"
      style={{
        background: "var(--card)",
        borderLeft: `4px solid ${cardBorderColors[show.cor]}`,
      }}
    >
      {/* Cabeçalho sempre visível */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {show.destaque && (
                <span className="badge badge--destaque">
                  <Star size={9} fill="currentColor" /> DESTAQUE
                </span>
              )}
              {show.acessivel && (
                <span className="badge badge--acessivel">♿ Acessível</span>
              )}
              {"libras" in show && show.libras && (
                <span className="badge" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}>
                  🤟 Libras
                </span>
              )}
            </div>
            <h3 className="text-base font-bold leading-tight"
                style={{ fontFamily: "var(--font-serif)", color: "var(--foreground)" }}>
              {show.artista}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--muted-foreground)" }}>
              {show.genero}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <div className="time-highlight">{show.horario}</div>
            <button
              onClick={onToggleFav}
              aria-label={isFav ? `Remover ${show.artista} dos favoritos` : `Favoritar ${show.artista}`}
              aria-pressed={isFav}
              className="p-1.5 rounded-lg transition-all"
              style={{ background: isFav ? "rgba(107,79,160,0.2)" : "transparent" }}
            >
              <Heart size={16} style={{
                color: isFav ? "#A78BCA" : "var(--muted-foreground)",
                fill: isFav ? "#A78BCA" : "none",
              }} />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-3 pt-3 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-xs" style={{ color: "var(--muted-foreground)" }}>
              <MapPin size={12} className="flex-shrink-0" />
              <span className="truncate">{show.palco}</span>
            </div>
            <p className="text-[11px] mt-0.5 ml-4" style={{ color: "var(--muted-foreground)" }}>
              📅 {show.data}
            </p>
          </div>
          <span className={`badge badge--lotacao-${show.lotacao}`}>
            {show.lotacaoLabel}
          </span>
          <button
            onClick={() => setExpandido(!expandido)}
            aria-expanded={expandido}
            aria-controls={`show-details-${show.id}`}
            className="ml-auto flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-all"
            style={{ background: "var(--secondary)", color: "var(--foreground)" }}
          >
            {expandido ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expandido ? "Menos" : "Mais"}
          </button>
        </div>
      </div>

      {/* Conteúdo expandido */}
      <AnimatePresence>
        {expandido && (
          <motion.div
            id={`show-details-${show.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3">
              {/* Descrição */}
              <p className="text-xs leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
                {show.descricao}
              </p>

              {/* Dicas neurodivergência */}
              <div className="rounded-xl p-3 space-y-2"
                   style={{ background: "rgba(107,79,160,0.08)", border: "1px solid rgba(107,79,160,0.2)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={14} style={{ color: "#A78BCA" }} />
                  <span className="text-xs font-semibold" style={{ color: "#A78BCA" }}>
                    Dicas para Neurodivergentes & Autismo
                  </span>
                </div>
                {show.dicas.neuro.map((dica, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                         style={{ background: "#7B5CB8" }} />
                    <span className="text-xs leading-relaxed" style={{ color: "var(--foreground)" }}>
                      {dica}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 mt-2 pt-2"
                     style={{ borderTop: "1px solid rgba(107,79,160,0.15)" }}>
                  <Users size={11} className="label-muted" />
                  <span className="text-[11px] label-muted">Capacidade: {show.dicas.capacidade}</span>
                </div>
              </div>

              {/* Filtro pós-festa */}
              {posShowBairro.length > 0 && (
                <div>
                  <button
                    onClick={() => setVerPosShow(!verPosShow)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all"
                    style={{
                      background: verPosShow ? "rgba(232,82,26,0.15)" : "var(--secondary)",
                      color: verPosShow ? "#E8521A" : "var(--foreground)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed size={13} />
                      <span>Pós-festa no {show.bairro}</span>
                    </div>
                    {verPosShow ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>

                  <AnimatePresence>
                    {verPosShow && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-2 space-y-2">
                          {posShowBairro.map((local, i) => (
                            <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl"
                                 style={{ background: "var(--secondary)", border: "1px solid var(--border)" }}>
                              <span className="text-base">{local.emoji}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
                                  {local.nome}
                                </p>
                                <p className="text-[11px]" style={{ color: "var(--muted-foreground)" }}>
                                  {local.tipo} · {local.distancia}
                                </p>
                              </div>
                              <span className="text-[11px] font-bold flex-shrink-0"
                                    style={{ color: "#E8521A" }}>
                                ⭐ {local.nota}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Home() {
  const [eventoAtivo, setEventoAtivo] = useState("Todos");
  const [bairroAtivo, setBairroAtivo] = useState("Todos");
  const [apenasAcessivel, setApenasAcessivel] = useState(false);
  const [apenasBaixaEstimulacao, setApenasBaixaEstimulacao] = useState(false);
  const { isFavorito, toggleFavorito, addNotification, marcarComoNotificado, favoritos } = useAppContext();

  useEffect(() => {
    const naoNotificados = favoritos.filter((fav) => !fav.notificadoAntes);
    if (naoNotificados.length === 0) return;
    naoNotificados.forEach((fav) => {
      const show = programacao.find((p) => p.id === fav.artistaId);
      if (show) {
        addNotification({
          title: `🎵 ${show.artista} em breve!`,
          message: `Seu artista favorito se apresenta hoje às ${show.horario} no ${show.palco}`,
          type: "favorito",
          data: { artistaId: fav.artistaId, showId: show.id },
        });
        marcarComoNotificado(fav.artistaId);
      }
    });
  }, [favoritos, addNotification, marcarComoNotificado]);

  const programacaoFiltrada = programacao.filter((item) => {
    const eventoOk = eventoAtivo === "Todos" || showEvento[item.id] === eventoAtivo;
    const bairroOk = bairroAtivo === "Todos" || item.bairro === bairroAtivo;
    const acessivelOk = !apenasAcessivel || item.acessivel;
    const baixaEstimulacaoOk = !apenasBaixaEstimulacao || item.lotacao === "baixa";
    return eventoOk && bairroOk && acessivelOk && baixaEstimulacaoOk;
  });

  return (
    <div className="min-h-screen pb-24" style={{ background: "var(--background)" }}>
      {/* Hero Section */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={HERO_IMG}
          alt="Forró Caju — Aracaju, Sergipe"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, oklch(0.15 0.03 42 / 0.85) 0%, transparent 60%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#E8B84B" }} />
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
              Ciclo Junino 2026 · 60 dias · Gratuito
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white leading-tight"
              style={{ fontFamily: "var(--font-serif)", fontWeight: 700 }}>
            Forró Caju 2026
          </h1>
          <p className="text-white/75 text-sm mt-0.5">
            109 atrações · 3 circuitos · Aracaju, SE
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-4 pt-4 pb-2">
        <h2 className="section-title text-lg mb-3">Programação — Ciclo Junino 2026</h2>

        {/* Filtro por tipo de evento */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-2">
          {eventos.map((ev) => (
            <button
              key={ev.id}
              onClick={() => setEventoAtivo(ev.id)}
              aria-pressed={eventoAtivo === ev.id}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                background: eventoAtivo === ev.id ? "#E8521A" : "var(--card)",
                color: eventoAtivo === ev.id ? "white" : "var(--foreground)",
                border: `1.5px solid ${eventoAtivo === ev.id ? "#E8521A" : "var(--border)"}`,
              }}
            >
              <span>{ev.emoji}</span>
              <span>{ev.label}</span>
            </button>
          ))}
        </div>

        {/* Filtros de acessibilidade */}
        <div className="flex items-center gap-2 mb-3">
          <button
            onClick={() => setApenasBaixaEstimulacao(!apenasBaixaEstimulacao)}
            aria-pressed={apenasBaixaEstimulacao}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: apenasBaixaEstimulacao ? "#7B5CB8" : "rgba(107,79,160,0.12)",
              color: apenasBaixaEstimulacao ? "white" : "#A78BCA",
            }}
            title="Filtra shows com baixa estimulação sensorial — ideal para autismo e hipersensibilidade"
          >
            <Brain size={12} />
            <span>Tranquilo</span>
          </button>
          <button
            onClick={() => setApenasAcessivel(!apenasAcessivel)}
            aria-pressed={apenasAcessivel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            style={{
              background: apenasAcessivel ? "#3A9E68" : "rgba(46,125,82,0.12)",
              color: apenasAcessivel ? "white" : "#2E7D52",
            }}
          >
            <Accessibility size={12} />
            <span>Acessível</span>
          </button>
        </div>

        {/* Aviso neurodivergência */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 p-3 rounded-xl flex items-start gap-2"
          style={{ background: "rgba(107,79,160,0.08)", border: "1px solid rgba(107,79,160,0.2)" }}
        >
          <Brain size={14} style={{ color: "#A78BCA", flexShrink: 0, marginTop: 2 }} />
          <p className="text-xs leading-relaxed label-muted">
            <strong style={{ color: "#A78BCA" }}>Neurodivergência & Autismo:</strong>{" "}
            Expanda cada card para ver dicas de volume, lotação e estimulação sensorial. Use o filtro{" "}
            <span className="font-semibold">🧠 Tranquilo</span> para shows de baixa estimulação.
          </p>
        </motion.div>

        {/* Filtro por bairro */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {locais.map((b) => (
            <button
              key={b}
              onClick={() => setBairroAtivo(b)}
              aria-pressed={bairroAtivo === b}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                background: bairroAtivo === b ? "var(--primary)" : "var(--card)",
                color: bairroAtivo === b ? "white" : "var(--foreground)",
                border: `1.5px solid ${bairroAtivo === b ? "var(--primary)" : "var(--border)"}`,
              }}
            >
              {b}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de shows */}
      <div className="px-4 space-y-3 mt-2">
        <AnimatePresence mode="popLayout">
          {programacaoFiltrada.map((show, i) => (
            <motion.div
              key={show.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ delay: i * 0.05, duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            >
              <ShowCard
                show={show}
                isFav={isFavorito(show.id)}
                onToggleFav={() => toggleFavorito(show.id, show.artista)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {programacaoFiltrada.length === 0 && (
          <div className="text-center py-12">
            <Music size={40} className="mx-auto mb-3" style={{ color: "var(--muted-foreground)" }} />
            <p className="font-medium" style={{ color: "var(--muted-foreground)" }}>
              Nenhum show encontrado com esses filtros
            </p>
          </div>
        )}
      </div>
    </div>
  );
}