import { Home } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
      style={{ background: "var(--background)" }}
    >
      <p className="text-6xl mb-4">🎸</p>
      <h1
        className="page-title text-5xl mb-2"
        style={{ color: "var(--primary)" }}
      >
        404
      </h1>
      <h2
        className="section-title text-xl mb-3"
      >
        Página não encontrada
      </h2>
      <p
        className="label-muted text-sm mb-8 leading-relaxed max-w-xs"
      >
        Parece que você se perdeu no forró. Essa página não existe ou foi movida.
      </p>
      <button
        onClick={() => setLocation("/")}
        className="btn-primary flex items-center gap-2 text-sm"
      >
        <Home size={16} />
        Voltar ao início
      </button>
    </div>
  );
}
