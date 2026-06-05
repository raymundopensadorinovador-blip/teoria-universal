"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

type StartingPoint = {
  id: string;
  current_pain: string;
  life_area: string | null;
  current_repetition: string | null;
  possible_origin: string | null;
  intensity: number | null;
};

export default function NovoEpisodioPage() {
  const router = useRouter();

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

  const [startingPointId, setStartingPointId] = useState("");
  const [startingPoint, setStartingPoint] = useState<StartingPoint | null>(null);
  const [carregandoPonto, setCarregandoPonto] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarPontoDePartida() {
      const params = new URLSearchParams(window.location.search);
      const pontoId = params.get("ponto");
  
      if (!pontoId) return;
  
      setStartingPointId(pontoId);
      setCarregandoPonto(true);
  
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
  
      if (userError || !user) {
        router.push("/login");
        return;
      }
  
      const { data, error } = await supabase
        .from("starting_points")
        .select(
          "id, current_pain, life_area, current_repetition, possible_origin, intensity"
        )
        .eq("id", pontoId)
        .eq("user_id", user.id)
        .single();
  
      if (!error && data) {
        setStartingPoint(data);
      }
  
      setCarregandoPonto(false);
    }
  
    carregarPontoDePartida();
  }, [router]);

  async function handleSalvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");

    const tituloLimpo = title.trim();

    if (!tituloLimpo) {
      setErro("Dê um título para este episódio.");
      return;
    }

    if (!originalEvent.trim()) {
      setErro("Conte, mesmo que brevemente, o que aconteceu.");
      return;
    }

    setCarregando(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      const idadeNumber = approximateAge
        ? Number.parseInt(approximateAge, 10)
        : null;

      const anoNumber = approximateYear
        ? Number.parseInt(approximateYear, 10)
        : null;

        const { data, error } = await supabase
        .from("life_episodes")
        .insert({
          user_id: user.id,
          starting_point_id: startingPointId || null,
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
          status: "registered",
        })
        .select("id")
        .single();

        if (error) {
          setErro("Não foi possível salvar este episódio agora.");
          return;
        }
        
        if (startingPointId) {
          await supabase
            .from("starting_points")
            .update({
              created_episode_id: data.id,
              updated_at: new Date().toISOString(),
            })
            .eq("id", startingPointId)
            .eq("user_id", user.id);
        }
        
        router.push(`/dashboard/episodios/${data.id}`); 
    } catch {
      setErro("Ocorreu um erro inesperado ao salvar o episódio.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F1E8] px-6 py-8 text-[#241F1A]">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-[#E3D6C3] bg-white/70 p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#6F6256]">
              Novo episódio
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Registre uma parte da sua história.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F6256]">
              Comece pelo fato. A reconstrução vem depois. Não precisa escrever
              perfeito, bonito ou completo. Precisa ser verdadeiro o suficiente
              para você continuar.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-full border border-[#CBB89E] bg-white px-5 py-3 text-center text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF]"
          >
            Voltar ao painel
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
                disabled={carregando}
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
                disabled={carregando}
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
                disabled={carregando}
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
                disabled={carregando}
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
                disabled={carregando}
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
                disabled={carregando}
                className="mt-3 w-full accent-[#66785F]"
              />

              <p className="mt-2 text-sm leading-6 text-[#6F6256]">
                Use isso apenas como referência pessoal. Impacto alto não quer
                dizer que você precisa resolver tudo hoje. Use esse nível apenas como uma referência pessoal, sem obrigação de resolver tudo agora.
              </p>
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
                disabled={carregando}
                rows={6}
                className="mt-2 w-full resize-none rounded-2xl border border-[#D9C9B5] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Conte o episódio como você lembra. Pode ser simples, direto, incompleto. A primeira versão não precisa explicar tudo."
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#5B3A29]">
                O que eu senti naquela época?
              </label>
              <textarea
                value={originalFeeling}
                onChange={(event) => setOriginalFeeling(event.target.value)}
                disabled={carregando}
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-[#D9C9B5] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Ex: medo, vergonha, raiva, abandono, confusão, silêncio..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#5B3A29]">
                O que eu passei a acreditar sobre mim?
              </label>
              <textarea
                value={oldBelief}
                onChange={(event) => setOldBelief(event.target.value)}
                disabled={carregando}
                rows={4}
                className="mt-2 w-full resize-none rounded-2xl border border-[#D9C9B5] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Ex: eu não sou suficiente, ninguém fica, eu preciso provar valor..."
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
                disabled={carregando}
                className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Ex: daquele dia em diante, eu achei que precisava me esconder"
              />
            </div>
          </section>

          {erro && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
              {erro}
            </div>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <Link
              href="/dashboard"
              className="rounded-full border border-[#CBB89E] bg-white px-6 py-3 text-center text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF]"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              disabled={carregando}
              className="rounded-full bg-[#2A1D16] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5B3A29] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {carregando ? "Salvando..." : "Salvar episódio"}
            </button>
          </div>
          {carregandoPonto && (
  <section className="mb-6 rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm">
    <p className="text-sm font-medium text-[#6F6256]">
      Carregando ponto de partida...
    </p>
  </section>
)}

{startingPoint && (
  <section className="mb-6 rounded-[2rem] border border-[#D8C7B1] bg-[#FBF7EF] p-5 shadow-sm md:p-6">
    <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#6F6256]">
      Ponto de partida deste episódio
    </p>

    <h2 className="mt-2 text-2xl font-semibold text-[#241F1A]">
      A dor presente que trouxe você até este registro.
    </h2>

    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl bg-white p-4">
        <p className="text-sm font-semibold text-[#5B3A29]">
          O que está pedindo atenção hoje
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6F6256]">
          {startingPoint.current_pain}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4">
        <p className="text-sm font-semibold text-[#5B3A29]">
          Área onde aparece
        </p>
        <p className="mt-2 text-sm leading-6 text-[#6F6256]">
          {startingPoint.life_area || "Não informada"}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4">
        <p className="text-sm font-semibold text-[#5B3A29]">
          Repetição percebida
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6F6256]">
          {startingPoint.current_repetition || "Não informada"}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-4">
        <p className="text-sm font-semibold text-[#5B3A29]">
          Possível ligação com a história
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6F6256]">
          {startingPoint.possible_origin || "Ainda não informada"}
        </p>
      </div>
    </div>

    <p className="mt-4 text-sm leading-6 text-[#6F6256]">
      Intensidade no presente:{" "}
      <strong className="text-[#5B3A29]">
        {startingPoint.intensity || 3}/5
      </strong>
    </p>
  </section>
)}
        </form>
      </div>
    </main>
  );
}