/*
 * CAJU GUIDE — AccessibilityContext
 * Preferências de acessibilidade visual persistidas no localStorage
 * Aplicadas globalmente via classes no <html>
 */

import React, { createContext, useContext, useEffect, useState } from "react";

export type FontSize = "normal" | "grande" | "muito-grande";
export type Contraste = "normal" | "alto" | "invertido";

interface AccessibilityPrefs {
  contraste: Contraste;
  tamanhoFonte: FontSize;
  espacamentoLetras: boolean;
  reduzirAnimacoes: boolean;
  cursorGrande: boolean;
  sublinharLinks: boolean;
  // Áudio (Web Speech API)
  audioAtivo: boolean;
}

interface AccessibilityContextType {
  prefs: AccessibilityPrefs;
  setContraste: (v: Contraste) => void;
  setTamanhoFonte: (v: FontSize) => void;
  toggleEspacamento: () => void;
  toggleAnimacoes: () => void;
  toggleCursor: () => void;
  toggleSublinhar: () => void;
  toggleAudio: () => void;
  resetPrefs: () => void;
  // Utilitário para screen reader
  falarTexto: (texto: string) => void;
  pararAudio: () => void;
}

const defaults: AccessibilityPrefs = {
  contraste: "normal",
  tamanhoFonte: "normal",
  espacamentoLetras: false,
  reduzirAnimacoes: false,
  cursorGrande: false,
  sublinharLinks: false,
  audioAtivo: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

function loadPrefs(): AccessibilityPrefs {
  try {
    const stored = localStorage.getItem("caju-a11y");
    if (stored) return { ...defaults, ...JSON.parse(stored) };
  } catch {}
  return defaults;
}

function applyClasses(prefs: AccessibilityPrefs) {
  const html = document.documentElement;

  // Contraste
  html.classList.remove("a11y-alto-contraste", "a11y-invertido");
  if (prefs.contraste === "alto") html.classList.add("a11y-alto-contraste");
  if (prefs.contraste === "invertido") html.classList.add("a11y-invertido");

  // Fonte
  html.classList.remove("a11y-fonte-grande", "a11y-fonte-muito-grande");
  if (prefs.tamanhoFonte === "grande") html.classList.add("a11y-fonte-grande");
  if (prefs.tamanhoFonte === "muito-grande") html.classList.add("a11y-fonte-muito-grande");

  // Outros
  html.classList.toggle("a11y-espacamento", prefs.espacamentoLetras);
  html.classList.toggle("a11y-reduzir-animacoes", prefs.reduzirAnimacoes);
  html.classList.toggle("a11y-cursor-grande", prefs.cursorGrande);
  html.classList.toggle("a11y-sublinhar-links", prefs.sublinharLinks);
}

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useState<AccessibilityPrefs>(loadPrefs);

  useEffect(() => {
    applyClasses(prefs);
    try {
      localStorage.setItem("caju-a11y", JSON.stringify(prefs));
    } catch {}
  }, [prefs]);

  function update(patch: Partial<AccessibilityPrefs>) {
    setPrefs((prev) => ({ ...prev, ...patch }));
  }

  function falarTexto(texto: string) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(texto);
    utterance.lang = "pt-BR";
    utterance.rate = 0.95;
    // Prioriza voz em português se disponível
    const vozes = window.speechSynthesis.getVoices();
    const vozPT = vozes.find((v) => v.lang.startsWith("pt"));
    if (vozPT) utterance.voice = vozPT;
    window.speechSynthesis.speak(utterance);
  }

  function pararAudio() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }

  return (
    <AccessibilityContext.Provider
      value={{
        prefs,
        setContraste: (v) => update({ contraste: v }),
        setTamanhoFonte: (v) => update({ tamanhoFonte: v }),
        toggleEspacamento: () => update({ espacamentoLetras: !prefs.espacamentoLetras }),
        toggleAnimacoes: () => update({ reduzirAnimacoes: !prefs.reduzirAnimacoes }),
        toggleCursor: () => update({ cursorGrande: !prefs.cursorGrande }),
        toggleSublinhar: () => update({ sublinharLinks: !prefs.sublinharLinks }),
        toggleAudio: () => {
          if (prefs.audioAtivo) pararAudio();
          update({ audioAtivo: !prefs.audioAtivo });
        },
        resetPrefs: () => setPrefs(defaults),
        falarTexto,
        pararAudio,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility deve ser usado dentro de AccessibilityProvider");
  return ctx;
}
