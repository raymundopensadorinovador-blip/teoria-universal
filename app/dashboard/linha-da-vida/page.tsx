"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Episode = {
  id: string;
  title: string;
  life_phase: string | null;
  approximate_age: number | null;
  approximate_year: number | null;
  main_theme: string | null;
  impact_level: number | null;
  status: string | null;
  original_event: string | null;
  created_at: string;
};

export default function LinhaDaVidaPage() {
  const router = useRouter();

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroFase, setFiltroFase] = useState("todas");
  const [filtroTema, setFiltroTema] = useState("todos");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarEpisodios() {
      setCarregando(true);
      setErro("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("life_episodes")
        .select(
          "id, title, life_phase, approximate_age, approximate_year, main_theme, impact_level, status, original_event, created_at"
        )
        .eq("user_id", user.id)
        .order("approximate_year", { ascending: true, nullsFirst: false })
        .order("approximate_age", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });

      if (error) {
        setErro("Não foi possível carregar sua linha da vida.");
      } else {
        setEpisodes(data || []);
      }

      setCarregando(false);
    }

    carregarEpisodios();
  }, [router]);

  const fasesDisponiveis = useMemo(() => {
    return Array.from(
      new Set(
        episodes
          .map((episode) => episode.life_phase)
          .filter((fase): fase is string => Boolean(fase))
      )
    ).sort();
  }, [episodes]);
  
  const temasDisponiveis = useMemo(() => {
    return Array.from(
      new Set(
        episodes
          .map((episode) => episode.main_theme)
          .filter((tema): tema is string => Boolean(tema))
      )
    ).sort();
  }, [episodes]);
  
  const episodesFiltrados = useMemo(() => {
    return episodes.filter((episode) => {
      const statusAtual = episode.status || "registered";
  
      const passaStatus =
        filtroStatus === "todos" || statusAtual === filtroStatus;
  
      const passaFase =
        filtroFase === "todas" || episode.life_phase === filtroFase;
  
      const passaTema =
        filtroTema === "todos" || episode.main_theme === filtroTema;
  
      return passaStatus && passaFase && passaTema;
    });
  }, [episodes, filtroStatus, filtroFase, filtroTema]);
  
  const total = episodes.length;
  const totalFiltrado = episodesFiltrados.length;
  
  const reconstruidos = useMemo(() => {
    return episodes.filter((episode) =>
      ["resignified", "integrated"].includes(episode.status || "")
    ).length;
  }, [episodes]);
  
  const progresso =
    total > 0 ? Math.round((reconstruidos / total) * 100) : 0;

  function traduzirStatus(status: string | null) {
    switch (status) {
      case "registered":
        return "Registrado";
      case "reconstructing":
        return "Em reconstrução";
      case "resignified":
        return "Ressignificado";
      case "integrated":
        return "Integrado";
      default:
        return "Registrado";
    }
  }

  function limparFiltros() {
    setFiltroStatus("todos");
    setFiltroFase("todas");
    setFiltroTema("todos");
  }

  function descricaoImpacto(nivel: number | null) {
    switch (nivel) {
      case 1:
        return "Leve";
      case 2:
        return "Moderado";
      case 3:
        return "Marcante";
      case 4:
        return "Profundo";
      case 5:
        return "Muito profundo";
      default:
        return "Não informado";
    }
  }

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F1E8] px-6 text-[#241F1A]">
        <div className="rounded-[2rem] border border-[#E3D6C3] bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-[#6F6256]">
            Carregando sua linha da vida...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F1E8] px-6 py-8 text-[#241F1A]">
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-[2rem] border border-[#E3D6C3] bg-white/70 p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#6F6256]">
                Linha da Vida
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Sua história em episódios.
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6F6256]">
                Veja os episódios registrados por você em ordem cronológica.
                Não é uma linha perfeita da vida inteira. É o mapa daquilo que
                você escolheu olhar, reconstruir e integrar.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/dashboard"
                className="rounded-full border border-[#CBB89E] bg-white px-5 py-3 text-center text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF]"
              >
                Voltar ao painel
              </Link>

              <Link
                href="/dashboard/episodios/novo"
                className="rounded-full bg-[#2A1D16] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#5B3A29]"
              >
                Novo episódio
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-[#FBF7EF] p-4">
              <p className="text-sm font-medium text-[#6F6256]">
                Episódios registrados
              </p>
              <p className="mt-2 text-3xl font-semibold">{total}</p>
            </div>

            <div className="rounded-2xl bg-[#FBF7EF] p-4">
              <p className="text-sm font-medium text-[#6F6256]">
                Reconstruídos
              </p>
              <p className="mt-2 text-3xl font-semibold">{reconstruidos}</p>
            </div>

            <div className="rounded-2xl bg-[#FBF7EF] p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-[#6F6256]">
                  Progresso registrado
                </p>
                <span className="text-sm font-semibold text-[#66785F]">
                  {progresso}%
                </span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#E3D6C3]">
                <div
                  className="h-full rounded-full bg-[#66785F] transition-all"
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {erro && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
            {erro}
          </div>
        )}

{episodes.length > 0 && (
  <section className="mt-6 rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm md:p-6">
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#6F6256]">
          Filtros
        </p>

        <h2 className="mt-2 text-2xl font-semibold">
          Encontre partes específicas da sua história.
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#6F6256]">
          Filtre por status, fase da vida ou tema principal. Quando a linha da vida crescer, os filtros ajudam você a encontrar episódios específicos com mais clareza.
        </p>
      </div>

      <button
        type="button"
        onClick={limparFiltros}
        className="rounded-full border border-[#CBB89E] bg-white px-5 py-3 text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF]"
      >
        Limpar filtros
      </button>
    </div>

    <div className="mt-5 grid gap-4 md:grid-cols-3">
      <div>
        <label className="text-sm font-semibold text-[#5B3A29]">
          Status
        </label>

        <select
          value={filtroStatus}
          onChange={(event) => setFiltroStatus(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29]"
        >
          <option value="todos">Todos os status</option>
          <option value="registered">Registrado</option>
          <option value="reconstructing">Em reconstrução</option>
          <option value="resignified">Ressignificado</option>
          <option value="integrated">Integrado</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-[#5B3A29]">
          Fase da vida
        </label>

        <select
          value={filtroFase}
          onChange={(event) => setFiltroFase(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29]"
        >
          <option value="todas">Todas as fases</option>
          {fasesDisponiveis.map((fase) => (
            <option key={fase} value={fase}>
              {fase}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-[#5B3A29]">
          Tema principal
        </label>

        <select
          value={filtroTema}
          onChange={(event) => setFiltroTema(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29]"
        >
          <option value="todos">Todos os temas</option>
          {temasDisponiveis.map((tema) => (
            <option key={tema} value={tema}>
              {tema}
            </option>
          ))}
        </select>
      </div>
    </div>

    <p className="mt-4 text-sm leading-6 text-[#6F6256]">
      Mostrando <strong>{totalFiltrado}</strong> de{" "}
      <strong>{total}</strong> episódios registrados.
    </p>
  </section>
)}

        {episodes.length === 0 ? (
          <section className="mt-6 rounded-[2rem] border border-dashed border-[#CBB89E] bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-semibold">
              Sua linha da vida ainda está vazia.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6F6256]">
              Comece por um episódio simples. Uma lembrança, uma fase, uma
              escolha, uma dor, uma conquista ou um recomeço. Comece por algo possível de olhar agora. A reconstrução da história pode acontecer em partes, com respeito ao seu próprio ritmo.
            </p>

            <Link
              href="/dashboard/episodios/novo"
              className="mt-5 inline-flex rounded-full bg-[#2A1D16] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5B3A29]"
            >
              Registrar primeiro episódio
            </Link>
          </section>
        ) : (
          <section className="mt-6 rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm md:p-6">
            <div className="mb-6">
            <h2 className="text-2xl font-semibold">
  Episódios encontrados
</h2>
<p className="mt-2 text-sm leading-6 text-[#6F6256]">
  Cada ponto abaixo representa uma parte da sua história. Algumas já foram
  reconstruídas. Outras ainda estão apenas registradas. Ambas importam.
</p>
            </div>

            {episodesFiltrados.length === 0 ? (
  <div className="rounded-[1.5rem] border border-dashed border-[#CBB89E] bg-[#FBF7EF] p-5">
    <p className="font-semibold text-[#5B3A29]">
      Nenhum episódio encontrado com estes filtros.
    </p>

    <p className="mt-2 text-sm leading-6 text-[#6F6256]">
      Tente limpar os filtros ou escolher outra fase, tema ou status. Tente limpar os filtros ou escolher outra fase, tema ou status para ampliar a busca.
    </p>

    <button
      type="button"
      onClick={limparFiltros}
      className="mt-4 rounded-full bg-[#2A1D16] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5B3A29]"
    >
      Limpar filtros
    </button>
  </div>
) : (
  <div className="relative space-y-5 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-[#CBB89E] md:before:left-6">
    {episodesFiltrados.map((episode, index) => (
                <Link
                  key={episode.id}
                  href={`/dashboard/episodios/${episode.id}`}
                  className="group relative block pl-12 md:pl-16"
                >
                  <span className="absolute left-0 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-[#CBB89E] bg-[#F6F1E8] text-sm font-semibold text-[#5B3A29] md:h-12 md:w-12">
                    {index + 1}
                  </span>

                  <article className="rounded-[1.5rem] border border-[#E3D6C3] bg-[#FBF7EF] p-5 transition group-hover:bg-[#F6F1E8]">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words text-xl font-semibold text-[#241F1A]">
                          {episode.title}
                        </h3>

                        <p className="mt-2 break-words text-sm leading-6 text-[#6F6256]">
                          {episode.life_phase || "Fase não informada"}
                          {episode.approximate_age
                            ? ` • ${episode.approximate_age} anos`
                            : ""}
                          {episode.approximate_year
                            ? ` • ${episode.approximate_year}`
                            : ""}
                          {episode.main_theme
                            ? ` • ${episode.main_theme}`
                            : ""}
                        </p>
                      </div>

                      <span className="w-fit shrink-0 rounded-full bg-[#66785F]/15 px-3 py-1 text-xs font-semibold text-[#66785F]">
                        {traduzirStatus(episode.status)}
                      </span>
                    </div>

                    {episode.original_event && (
                      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#6F6256]">
                        {episode.original_event}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full border border-[#D9C9B5] bg-white px-3 py-1 text-xs font-medium text-[#6F6256]">
                        Impacto: {descricaoImpacto(episode.impact_level)}
                      </span>

                      <span className="rounded-full border border-[#D9C9B5] bg-white px-3 py-1 text-xs font-medium text-[#6F6256]">
                        Abrir episódio
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
             )}
          </section>
        )}
      </div>
    </main>
  );
}