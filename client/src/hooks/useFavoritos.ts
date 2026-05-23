import { useState, useEffect, useCallback } from "react";

export interface Favorito {
  artistaId: number;
  artistaNome: string;
  dataCadastro: string;
  notificadoAntes: boolean;
}

export function useFavoritos() {
  const [favoritos, setFavoritos] = useState<Favorito[]>(() => {
    const saved = localStorage.getItem("caju-favoritos");
    return saved ? JSON.parse(saved) : [];
  });

  // Persistir favoritos
  useEffect(() => {
    localStorage.setItem("caju-favoritos", JSON.stringify(favoritos));
  }, [favoritos]);

  const isFavorito = useCallback(
    (artistaId: number) => favoritos.some((f) => f.artistaId === artistaId),
    [favoritos]
  );

  const toggleFavorito = useCallback(
    (artistaId: number, artistaNome: string) => {
      setFavoritos((prev) => {
        const existe = prev.find((f) => f.artistaId === artistaId);
        if (existe) {
          return prev.filter((f) => f.artistaId !== artistaId);
        } else {
          return [
            ...prev,
            {
              artistaId,
              artistaNome,
              dataCadastro: new Date().toISOString(),
              notificadoAntes: false,
            },
          ];
        }
      });
    },
    []
  );

  const marcarComoNotificado = useCallback((artistaId: number) => {
    setFavoritos((prev) =>
      prev.map((f) =>
        f.artistaId === artistaId ? { ...f, notificadoAntes: true } : f
      )
    );
  }, []);

  return {
    favoritos,
    isFavorito,
    toggleFavorito,
    marcarComoNotificado,
  };
}
