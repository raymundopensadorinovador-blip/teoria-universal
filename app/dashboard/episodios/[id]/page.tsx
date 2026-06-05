"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  status: string | null;
  created_at: string;
};

type Reflection = {
  id: string;
  episode_id: string;
  user_id: string;
  old_self_text: string | null;
  today_self_text: string | null;
  reconstructed_self_text: string | null;
  second_chance_text: string | null;
  before_i_believed: string | null;
  today_i_understand: string | null;
  before_it_trapped_me: string | null;
  today_i_choose: string | null;
  integration_phrase: string | null;
};

export default function EpisodioDetalhePage() {
  const params = useParams();
  const router = useRouter();
  const episodeId = String(params.id);

  const [userId, setUserId] = useState("");
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [reflection, setReflection] = useState<Reflection | null>(null);

  const [oldSelfText, setOldSelfText] = useState("");
  const [todaySelfText, setTodaySelfText] = useState("");
  const [reconstructedSelfText, setReconstructedSelfText] = useState("");
  const [secondChanceText, setSecondChanceText] = useState("");
  const [beforeIBelieved, setBeforeIBelieved] = useState("");
  const [todayIUnderstand, setTodayIUnderstand] = useState("");
  const [beforeItTrappedMe, setBeforeItTrappedMe] = useState("");
  const [todayIChoose, setTodayIChoose] = useState("");
  const [integrationPhrase, setIntegrationPhrase] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [integrando, setIntegrando] = useState(false);
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

      const { data: episodeData, error: episodeError } = await supabase
        .from("life_episodes")
        .select("*")
        .eq("id", episodeId)
        .eq("user_id", user.id)
        .single();

      if (episodeError || !episodeData) {
        setErro("Não foi possível carregar este episódio.");
        setCarregando(false);
        return;
      }

      setEpisode(episodeData);

      const { data: reflectionData, error: reflectionError } = await supabase
        .from("episode_reflections")
        .select("*")
        .eq("episode_id", episodeId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (reflectionError) {
        setErro("Não foi possível carregar a reconstrução deste episódio.");
        setCarregando(false);
        return;
      }

      if (reflectionData) {
        setReflection(reflectionData);
        setOldSelfText(reflectionData.old_self_text || "");
        setTodaySelfText(reflectionData.today_self_text || "");
        setReconstructedSelfText(
          reflectionData.reconstructed_self_text || ""
        );
        setSecondChanceText(reflectionData.second_chance_text || "");
        setBeforeIBelieved(reflectionData.before_i_believed || "");
        setTodayIUnderstand(reflectionData.today_i_understand || "");
        setBeforeItTrappedMe(reflectionData.before_it_trapped_me || "");
        setTodayIChoose(reflectionData.today_i_choose || "");
        setIntegrationPhrase(reflectionData.integration_phrase || "");
      }

      setCarregando(false);
    }

    carregarEpisodio();
  }, [episodeId, router]);

  const progresso = useMemo(() => {
    const etapas = [
      Boolean(episode?.original_event),
      Boolean(oldSelfText.trim()),
      Boolean(todaySelfText.trim()),
      Boolean(reconstructedSelfText.trim()),
      Boolean(secondChanceText.trim()),
      Boolean(todayIChoose.trim()),
      Boolean(integrationPhrase.trim()),
    ];

    const feitas = etapas.filter(Boolean).length;

    return Math.round((feitas / etapas.length) * 100);
  }, [
    episode?.original_event,
    oldSelfText,
    todaySelfText,
    reconstructedSelfText,
    secondChanceText,
    todayIChoose,
    integrationPhrase,
  ]);

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

  function calcularNovoStatus() {
    if (progresso >= 100) return "integrated";
    if (progresso >= 70) return "resignified";
    if (progresso >= 25) return "reconstructing";
    return "registered";
  }

  async function handleMarcarComoIntegrado() {
    if (!episode || !userId) return;
  
    setErro("");
    setSucesso("");
  
    if (!integrationPhrase.trim()) {
      setErro("Escreva uma frase de integração antes de marcar este episódio como integrado.");
      return;
    }
  
    setIntegrando(true);
  
    try {
      const { error } = await supabase
        .from("life_episodes")
        .update({
          status: "integrated",
          updated_at: new Date().toISOString(),
        })
        .eq("id", episode.id)
        .eq("user_id", userId);
  
      if (error) {
        setErro("Não foi possível marcar este episódio como integrado.");
        return;
      }
  
      setEpisode({
        ...episode,
        status: "integrated",
      });
  
      setSucesso("Este episódio foi marcado como integrado na sua linha da vida.");
    } catch {
      setErro("Ocorreu um erro inesperado ao integrar este episódio.");
    } finally {
      setIntegrando(false);
    }
  }

  async function handleSalvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!episode || !userId) return;

    setErro("");
    setSucesso("");
    setSalvando(true);

    try {
      const payload = {
        episode_id: episode.id,
        user_id: userId,
        old_self_text: oldSelfText.trim() || null,
        today_self_text: todaySelfText.trim() || null,
        reconstructed_self_text: reconstructedSelfText.trim() || null,
        second_chance_text: secondChanceText.trim() || null,
        before_i_believed: beforeIBelieved.trim() || null,
        today_i_understand: todayIUnderstand.trim() || null,
        before_it_trapped_me: beforeItTrappedMe.trim() || null,
        today_i_choose: todayIChoose.trim() || null,
        integration_phrase: integrationPhrase.trim() || null,
        updated_at: new Date().toISOString(),
      };

      let reflectionError = null;

      if (reflection) {
        const { error } = await supabase
          .from("episode_reflections")
          .update(payload)
          .eq("id", reflection.id)
          .eq("user_id", userId);

        reflectionError = error;
      } else {
        const { data, error } = await supabase
          .from("episode_reflections")
          .insert(payload)
          .select("*")
          .single();

        reflectionError = error;

        if (data) {
          setReflection(data);
        }
      }

      if (reflectionError) {
        setErro("Não foi possível salvar a reconstrução.");
        return;
      }

      const novoStatus =
        episode.status === "integrated" ? "integrated" : calcularNovoStatus();

      const { error: statusError } = await supabase
        .from("life_episodes")
        .update({
          status: novoStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", episode.id)
        .eq("user_id", userId);

      if (statusError) {
        setErro("A reconstrução foi salva, mas o status não foi atualizado.");
        return;
      }

      setEpisode({
        ...episode,
        status: novoStatus,
      });

      setSucesso("Reconstrução salva com sucesso.");
    } catch {
      setErro("Ocorreu um erro inesperado ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F1E8] px-6 text-[#241F1A]">
        <div className="rounded-[2rem] border border-[#E3D6C3] bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-medium text-[#6F6256]">
            Carregando episódio...
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
      <div className="mx-auto w-full max-w-6xl">
        <header className="rounded-[2rem] border border-[#E3D6C3] bg-white/70 p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#6F6256]">
                Episódio da linha da vida
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                {episode.title}
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#6F6256]">
                {episode.life_phase || "Fase não informada"}
                {episode.approximate_age
                  ? ` • ${episode.approximate_age} anos`
                  : ""}
                {episode.approximate_year
                  ? ` • ${episode.approximate_year}`
                  : ""}
                {episode.main_theme ? ` • ${episode.main_theme}` : ""}
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
    href={`/dashboard/episodios/${episode.id}/editar`}
    className="rounded-full border border-[#CBB89E] bg-white px-5 py-3 text-center text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF]"
  >
    Editar episódio
  </Link>

  <Link
    href="/dashboard/episodios/novo"
    className="rounded-full bg-[#2A1D16] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#5B3A29]"
  >
    Novo episódio
  </Link>
</div>  
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[0.7fr_1.3fr]">
            <div className="rounded-2xl bg-[#FBF7EF] p-4">
              <p className="text-sm font-semibold text-[#5B3A29]">Status</p>
              <p className="mt-2 text-2xl font-semibold">
                {traduzirStatus(episode.status)}
              </p>
            </div>

            <div className="rounded-2xl bg-[#FBF7EF] p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold text-[#5B3A29]">
                  Progresso do episódio
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

              <p className="mt-2 text-sm leading-6 text-[#6F6256]">
                Esse progresso mostra o quanto este episódio foi trabalhado
                dentro da sua própria reconstrução.
              </p>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <aside className="space-y-4">
            <div className="rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">O que aconteceu</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#6F6256]">
                {episode.original_event || "Não informado."}
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">Eu senti</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#6F6256]">
                {episode.original_feeling || "Não informado."}
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">Eu passei a acreditar</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#6F6256]">
                {episode.old_belief || "Não informado."}
              </p>
            </div>

            <div className="rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold">Frase marcada</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[#6F6256]">
                {episode.marked_phrase || "Não informado."}
              </p>
            </div>
          </aside>

          <form
            onSubmit={handleSalvar}
            className="rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm md:p-6"
          >
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#6F6256]">
                Reconstrução
              </p>
              <h2 className="mt-2 text-2xl font-semibold">
                Escreva uma nova leitura para este episódio.
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#6F6256]">
                Ressignificar não é fingir que nada aconteceu. É impedir que o
                episódio continue ocupando um lugar maior do que deveria dentro
                da sua identidade.
              </p>
            </div>

            <div className="mt-6 space-y-5">
              <CampoTexto
                titulo="Eu daquele tempo"
                descricao="Escreva como aquela versão de você viveu esse episódio. Sem corrigir, sem embelezar."
                valor={oldSelfText}
                setValor={setOldSelfText}
                placeholder="Naquele tempo, eu me sentia..."
                disabled={salvando}
              />

              <CampoTexto
                titulo="Eu de hoje"
                descricao="Agora olhe para o mesmo episódio com a maturidade, conhecimento e distância que você tem hoje."
                valor={todaySelfText}
                setValor={setTodaySelfText}
                placeholder="Hoje eu consigo perceber que..."
                disabled={salvando}
              />

              <CampoTexto
                titulo="Eu reconstruído"
                descricao="Escreva a nova leitura que você quer guardar sobre esse episódio."
                valor={reconstructedSelfText}
                setValor={setReconstructedSelfText}
                placeholder="Este episódio fez parte da minha história, mas..."
                disabled={salvando}
              />

              <CampoTexto
                titulo="Minha segunda chance"
                descricao="Se você pudesse responder a esse episódio a partir de hoje, o que responderia?"
                valor={secondChanceText}
                setValor={setSecondChanceText}
                placeholder="Hoje eu escolheria..."
                disabled={salvando}
              />
            </div>

            <div className="mt-7 rounded-[1.5rem] bg-[#FBF7EF] p-5">
              <h3 className="text-lg font-semibold">Comparativo</h3>
              <p className="mt-2 text-sm leading-6 text-[#6F6256]">
                Aqui o app separa a interpretação antiga da nova leitura. Este comparativo ajuda a separar o fato vivido da interpretação que nasceu dele, abrindo espaço para uma leitura mais consciente.
              </p>

              <div className="mt-5 grid gap-5 md:grid-cols-2">
                <CampoTextoMenor
                  titulo="Antes eu acreditava..."
                  valor={beforeIBelieved}
                  setValor={setBeforeIBelieved}
                  placeholder="Ex: eu não tinha valor..."
                  disabled={salvando}
                />

                <CampoTextoMenor
                  titulo="Hoje eu compreendo..."
                  valor={todayIUnderstand}
                  setValor={setTodayIUnderstand}
                  placeholder="Ex: eu estava ferido, mas não definido..."
                  disabled={salvando}
                />

                <CampoTextoMenor
                  titulo="Antes isso me prendia em..."
                  valor={beforeItTrappedMe}
                  setValor={setBeforeItTrappedMe}
                  placeholder="Ex: medo de tentar novamente..."
                  disabled={salvando}
                />

                <CampoTextoMenor
                  titulo="Hoje eu escolho..."
                  valor={todayIChoose}
                  setValor={setTodayIChoose}
                  placeholder="Ex: continuar sem carregar essa sentença..."
                  disabled={salvando}
                />
              </div>
            </div>

            <div className="mt-6">
              <CampoTexto
                titulo="Frase de integração"
                descricao="Escreva a frase final que coloca este episódio no lugar certo dentro da sua história."
                valor={integrationPhrase}
                setValor={setIntegrationPhrase}
                placeholder="Ex: isso fez parte da minha história, mas não define sozinho quem eu sou."
                disabled={salvando}
              />
            </div>

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
                href="/dashboard"
                className="rounded-full border border-[#CBB89E] bg-white px-6 py-3 text-center text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF]"
              >
                Voltar
              </Link>

              <button
                type="submit"
                disabled={salvando}
                className="rounded-full bg-[#2A1D16] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5B3A29] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {salvando ? "Salvando..." : "Salvar reconstrução"}
              </button>
            </div>
            <div className="mt-8 rounded-[2rem] border border-[#D8C7B1] bg-[#F6F1E8] p-5 md:p-6">
  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#6F6256]">
        Versão reconstruída
      </p>

      <h3 className="mt-2 text-2xl font-semibold text-[#241F1A]">
        Como este episódio começa a ser lido agora.
      </h3>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F6256]">
        Este bloco organiza a nova leitura do episódio. Ele não muda o fato
        vivido, mas ajuda a colocar a lembrança em um lugar mais consciente
        dentro da sua história.
      </p>
    </div>

    <span className="w-fit rounded-full bg-[#66785F]/15 px-3 py-1 text-xs font-semibold text-[#66785F]">
      {progresso}% trabalhado
    </span>
  </div>

  <div className="mt-6 grid gap-4">
    <TextoLeitura
      titulo="O episódio vivido"
      texto={episode.original_event || ""}
    />

    <TextoLeitura
      titulo="Eu daquele tempo"
      texto={oldSelfText}
    />

    <TextoLeitura
      titulo="Eu de hoje"
      texto={todaySelfText}
    />

    <TextoLeitura
      titulo="Eu reconstruído"
      texto={reconstructedSelfText}
    />

    <TextoLeitura
      titulo="Minha segunda chance"
      texto={secondChanceText}
    />
  </div>

  <div className="mt-5 rounded-[1.5rem] border border-[#CBB89E] bg-white p-5">
    <h4 className="text-lg font-semibold text-[#241F1A]">
      Comparativo de leitura
    </h4>

    <p className="mt-2 text-sm leading-6 text-[#6F6256]">
      Aqui aparece a diferença entre a interpretação antiga e a leitura que
      começa a nascer agora. Às vezes uma lembrança antiga passa a funcionar como uma sentença sobre quem somos. Este espaço ajuda a revisar essa leitura com mais consciência.
    </p>

    <div className="mt-5 grid gap-4 md:grid-cols-2">
      <TextoLeitura
        titulo="Antes eu acreditava"
        texto={beforeIBelieved}
      />

      <TextoLeitura
        titulo="Hoje eu compreendo"
        texto={todayIUnderstand}
      />

      <TextoLeitura
        titulo="Antes isso me prendia em"
        texto={beforeItTrappedMe}
      />

      <TextoLeitura
        titulo="Hoje eu escolho"
        texto={todayIChoose}
      />
    </div>
  </div>

  <div className="mt-5 rounded-[1.5rem] bg-[#2A1D16] p-5 text-white">
    <p className="text-sm font-semibold text-[#EADCC8]">
      Frase de integração
    </p>

    <p className="mt-2 whitespace-pre-wrap text-lg leading-8">
      {integrationPhrase.trim() ||
        "Quando você escrever uma frase de integração, ela aparecerá aqui como fechamento deste episódio."}
    </p>
  </div>
  <div className="mt-5 rounded-[1.5rem] border border-[#CBB89E] bg-white p-5">
  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
    <div>
      <h4 className="text-lg font-semibold text-[#241F1A]">
        Integração do episódio
      </h4>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F6256]">
        Marcar como integrado não significa que tudo foi resolvido. Significa
        que você reconhece este episódio como parte da sua história, sem deixar
        que ele ocupe sozinho o centro da sua identidade.
      </p>
    </div>

    <button
      type="button"
      onClick={handleMarcarComoIntegrado}
      disabled={
        integrando ||
        salvando ||
        !integrationPhrase.trim() ||
        episode.status === "integrated"
      }
      className="rounded-full bg-[#66785F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#56684F] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {episode.status === "integrated"
        ? "Episódio integrado"
        : integrando
          ? "Integrando..."
          : "Marcar como integrado"}
    </button>
  </div>

  {!integrationPhrase.trim() && (
    <p className="mt-3 text-sm leading-6 text-[#6F6256]">
      Para liberar este botão, escreva primeiro uma frase de integração.
      Esse passo ajuda a dar um fechamento mínimo antes de integrar o episódio.
    </p>
  )}
</div>
</div>
          </form>
        </section>
      </div>
    </main>
  );
}

function TextoLeitura({
  titulo,
  texto,
  vazio = "Ainda não preenchido.",
}: {
  titulo: string;
  texto: string;
  vazio?: string;
}) {
  return (
    <div className="rounded-2xl border border-[#E3D6C3] bg-white p-4">
      <p className="text-sm font-semibold text-[#5B3A29]">{titulo}</p>
      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#6F6256]">
        {texto.trim() || vazio}
      </p>
    </div>
  );
}

function CampoTexto({
  titulo,
  descricao,
  valor,
  setValor,
  placeholder,
  disabled,
}: {
  titulo: string;
  descricao: string;
  valor: string;
  setValor: (valor: string) => void;
  placeholder: string;
  disabled: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#5B3A29]">{titulo}</label>
      <p className="mt-1 text-sm leading-6 text-[#6F6256]">{descricao}</p>
      <textarea
        value={valor}
        onChange={(event) => setValor(event.target.value)}
        rows={5}
        disabled={disabled}
        className="mt-2 w-full resize-none rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
        placeholder={placeholder}
      />
    </div>
  );
}

function CampoTextoMenor({
  titulo,
  valor,
  setValor,
  placeholder,
  disabled,
}: {
  titulo: string;
  valor: string;
  setValor: (valor: string) => void;
  placeholder: string;
  disabled: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-[#5B3A29]">{titulo}</label>
      <textarea
        value={valor}
        onChange={(event) => setValor(event.target.value)}
        rows={4}
        disabled={disabled}
        className="mt-2 w-full resize-none rounded-2xl border border-[#D9C9B5] bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
        placeholder={placeholder}
      />
    </div>
  );
}