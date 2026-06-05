"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const fasesDaVida = [
  "Infância",
  "Adolescência",
  "Juventude",
  "Vida adulta",
  "Família",
  "Relacionamentos",
  "Trabalho",
  "Fé e espiritualidade",
  "Perdas",
  "Conquistas",
  "Recomeços",
  "Outra fase",
];

const temasPrincipais = [
  "Medo",
  "Vergonha",
  "Rejeição",
  "Perda",
  "Culpa",
  "Escolha",
  "Família",
  "Amor",
  "Fé",
  "Trabalho",
  "Mudança",
  "Superação",
  "Identidade",
  "Outro tema",
];

type Episode = {
  id: string;
  user_id: string;
  title: string;
  life_phase: string | null;
  approximate_age: number | null;
  approximate_year: number | null;
  main_theme: string | null;
  impact_level: number | null;
  original_event: string | null;
  original_feeling: string | null;
  old_belief: string | null;
  marked_phrase: string | null;
};

export default function EditarEpisodioPage() {
  const params = useParams();
  const router = useRouter();
  const episodeId = String(params.id);

  const [userId, setUserId] = useState("");
  const [episode, setEpisode] = useState<Episode | null>(null);

  const [title, setTitle] = useState("");
  const [lifePhase, setLifePhase] = useState("");
  const [approximateAge, setApproximateAge] = useState("");
  const [approximateYear, setApproximateYear] = useState("");
  const [mainTheme, setMainTheme] = useState("");
  const [impactLevel, setImpactLevel] = useState(3);
  const [originalEvent, setOriginalEvent] = useState("");
  const [originalFeeling, setOriginalFeeling] = useState("");
  const [oldBelief, setOldBelief] = useState("");
  const [markedPhrase, setMarkedPhrase] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [confirmarExclusao, setConfirmarExclusao] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    async function carregarEpisodio() {
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

      setUserId(user.id);

      const { data, error } = await supabase
        .from("life_episodes")
        .select("*")
        .eq("id", episodeId)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        setErro("Não foi possível carregar este episódio.");
        setCarregando(false);
        return;
      }

      setEpisode(data);
      setTitle(data.title || "");
      setLifePhase(data.life_phase || "");
      setApproximateAge(
        data.approximate_age !== null && data.approximate_age !== undefined
          ? String(data.approximate_age)
          : ""
      );
      setApproximateYear(
        data.approximate_year !== null && data.approximate_year !== undefined
          ? String(data.approximate_year)
          : ""
      );
      setMainTheme(data.main_theme || "");
      setImpactLevel(data.impact_level || 3);
      setOriginalEvent(data.original_event || "");
      setOriginalFeeling(data.original_feeling || "");
      setOldBelief(data.old_belief || "");
      setMarkedPhrase(data.marked_phrase || "");

      setCarregando(false);
    }

    carregarEpisodio();
  }, [episodeId, router]);

  async function handleSalvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!episode || !userId) return;

    setErro("");
    setSucesso("");

    const tituloLimpo = title.trim();

    if (!tituloLimpo) {
      setErro("Dê um título para este episódio.");
      return;
    }

    if (!originalEvent.trim()) {
      setErro("Conte, mesmo que brevemente, o que aconteceu.");
      return;
    }

    setSalvando(true);

    try {
      const idadeNumber = approximateAge
        ? Number.parseInt(approximateAge, 10)
        : null;

      const anoNumber = approximateYear
        ? Number.parseInt(approximateYear, 10)
        : null;

      const { error } = await supabase
        .from("life_episodes")
        .update({
          title: tituloLimpo,
          life_phase: lifePhase || null,
          approximate_age: Number.isNaN(idadeNumber) ? null : idadeNumber,
          approximate_year: Number.isNaN(anoNumber) ? null : anoNumber,
          main_theme: mainTheme || null,
          impact_level: impactLevel,
          original_event: originalEvent.trim(),
          original_feeling: originalFeeling.trim() || null,
          old_belief: oldBelief.trim() || null,
          marked_phrase: markedPhrase.trim() || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", episode.id)
        .eq("user_id", userId);

      if (error) {
        setErro("Não foi possível salvar as alterações.");
        return;
      }

      setSucesso("Episódio atualizado com sucesso.");

      setTimeout(() => {
        router.push(`/dashboard/episodios/${episode.id}`);
      }, 700);
    } catch {
      setErro("Ocorreu um erro inesperado ao salvar.");
    } finally {
      setSalvando(false);
    }
  }
  async function handleExcluir() {
    if (!episode || !userId) return;
  
    setErro("");
    setSucesso("");
  
    if (confirmarExclusao.trim().toUpperCase() !== "EXCLUIR") {
      setErro("Digite EXCLUIR para confirmar a exclusão deste episódio.");
      return;
    }
  
    setExcluindo(true);
  
    try {
      const { error } = await supabase
        .from("life_episodes")
        .delete()
        .eq("id", episode.id)
        .eq("user_id", userId);
  
      if (error) {
        setErro("Não foi possível excluir este episódio.");
        return;
      }
  
      router.push("/dashboard/linha-da-vida");
    } catch {
      setErro("Ocorreu um erro inesperado ao excluir.");
    } finally {
      setExcluindo(false);
    }
  }


  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F1E8] px-6 text-[#241F1A]">
        <div className="rounded-[2rem] border border-[#E3D6C3] bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-[#6F6256]">
            Carregando edição...
          </p>
        </div>
      </main>
    );
  }

  if (!episode) {
    return (
      <main className="min-h-screen bg-[#F6F1E8] px-6 py-8 text-[#241F1A]">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-[#E3D6C3] bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold">Episódio não encontrado</h1>
          <p className="mt-2 text-sm leading-6 text-[#6F6256]">
            Não encontramos este episódio na sua linha da vida.
          </p>

          <Link
            href="/dashboard"
            className="mt-5 inline-flex rounded-full bg-[#2A1D16] px-5 py-3 text-sm font-semibold text-white"
          >
            Voltar ao painel
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F6F1E8] px-6 py-8 text-[#241F1A]">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-[#E3D6C3] bg-white/70 p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#6F6256]">
              Editar episódio
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Ajuste esta parte da sua história.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F6256]">
              Corrigir um episódio não muda o fato vivido. Apenas melhora o
              registro para que a reconstrução fique mais fiel ao que você quer
              organizar.
            </p>
          </div>

          <Link
            href={`/dashboard/episodios/${episode.id}`}
            className="rounded-full border border-[#CBB89E] bg-white px-5 py-3 text-center text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF]"
          >
            Voltar ao episódio
          </Link>
        </header>

        <form
          onSubmit={handleSalvar}
          className="rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm md:p-7"
        >
          <section className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-[#5B3A29]">
                Título do episódio
              </label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                type="text"
                required
                disabled={salvando}
                className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Ex: O dia em que eu senti que precisava recomeçar"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#5B3A29]">
                Fase da vida
              </label>
              <select
                value={lifePhase}
                onChange={(event) => setLifePhase(event.target.value)}
                disabled={salvando}
                className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
              >
                <option value="">Selecione uma fase</option>
                {fasesDaVida.map((fase) => (
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
                value={mainTheme}
                onChange={(event) => setMainTheme(event.target.value)}
                disabled={salvando}
                className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
              >
                <option value="">Selecione um tema</option>
                {temasPrincipais.map((tema) => (
                  <option key={tema} value={tema}>
                    {tema}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#5B3A29]">
                Idade aproximada
              </label>
              <input
                value={approximateAge}
                onChange={(event) => setApproximateAge(event.target.value)}
                type="number"
                min="0"
                max="120"
                disabled={salvando}
                className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Ex: 14"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#5B3A29]">
                Ano aproximado
              </label>
              <input
                value={approximateYear}
                onChange={(event) => setApproximateYear(event.target.value)}
                type="number"
                min="1900"
                max="2100"
                disabled={salvando}
                className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Ex: 2012"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-semibold text-[#5B3A29]">
                  Nível de impacto
                </label>
                <span className="rounded-full bg-[#66785F]/15 px-3 py-1 text-xs font-semibold text-[#66785F]">
                  {impactLevel}/5
                </span>
              </div>

              <input
                value={impactLevel}
                onChange={(event) =>
                  setImpactLevel(Number.parseInt(event.target.value, 10))
                }
                type="range"
                min="1"
                max="5"
                disabled={salvando}
                className="mt-3 w-full accent-[#66785F]"
              />
            </div>
          </section>

          <section className="mt-7 space-y-5 rounded-[1.5rem] bg-[#FBF7EF] p-5">
            <div>
              <label className="text-sm font-semibold text-[#5B3A29]">
                O que aconteceu?
              </label>
              <textarea
                value={originalEvent}
                onChange={(event) => setOriginalEvent(event.target.value)}
                required
                disabled={salvando}
                rows={6}
                className="mt-2 w-full resize-none rounded-2xl border border-[#D9C9B5] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Conte o episódio como você lembra."
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#5B3A29]">
                O que eu senti naquela época?
              </label>
              <textarea
                value={originalFeeling}
                onChange={(event) => setOriginalFeeling(event.target.value)}
                disabled={salvando}
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-[#D9C9B5] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Ex: medo, vergonha, raiva, abandono..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#5B3A29]">
                O que eu passei a acreditar sobre mim?
              </label>
              <textarea
                value={oldBelief}
                onChange={(event) => setOldBelief(event.target.value)}
                disabled={salvando}
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-[#D9C9B5] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Ex: eu não sou suficiente..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#5B3A29]">
                Que frase ficou marcada?
              </label>
              <input
                value={markedPhrase}
                onChange={(event) => setMarkedPhrase(event.target.value)}
                type="text"
                disabled={salvando}
                className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Ex: daquele dia em diante..."
              />
            </div>
          </section>

          {erro && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">
              {sucesso}
            </div>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Link
              href={`/dashboard/episodios/${episode.id}`}
              className="rounded-full border border-[#CBB89E] bg-white px-6 py-3 text-center text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF]"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={salvando}
              className="rounded-full bg-[#2A1D16] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5B3A29] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
        <section className="mt-6 rounded-[2rem] border border-red-200 bg-red-50 p-5 shadow-sm md:p-6">
  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
    <div>
      <h2 className="text-xl font-semibold text-red-800">
        Excluir episódio
      </h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-red-700">
        Esta ação remove o episódio e a reconstrução ligada a ele. Use apenas
        se você realmente não quiser manter este registro na sua linha da vida.
      </p>
    </div>
  </div>

  <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
    <input
      value={confirmarExclusao}
      onChange={(event) => setConfirmarExclusao(event.target.value)}
      type="text"
      disabled={excluindo || salvando}
      className="w-full rounded-2xl border border-red-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-500 disabled:opacity-60"
      placeholder="Digite EXCLUIR para confirmar"
    />

    <button
      type="button"
      onClick={handleExcluir}
      disabled={excluindo || salvando}
      className="rounded-full border border-red-300 bg-white px-6 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {excluindo ? "Excluindo..." : "Excluir episódio"}
    </button>
  </div>
</section>
      </div>
    </main>
  );
}