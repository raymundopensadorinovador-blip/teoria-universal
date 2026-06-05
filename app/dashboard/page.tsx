"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type Profile = {
  id: string;
  full_name: string | null;
};

type Episode = {
  id: string;
  title: string;
  life_phase: string | null;
  approximate_age: number | null;
  approximate_year: number | null;
  main_theme: string | null;
  status: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
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

      const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name")
      .eq("id", user.id)
      .maybeSingle();
    
    if (profileError) {
      setErro("Não foi possível carregar seu perfil.");
    } else if (profileData) {
      setProfile(profileData);
    } else {
      const nomeFallback =
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Usuário";
    
      const { data: novoPerfil, error: createProfileError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          full_name: nomeFallback,
        })
        .select("id, full_name")
        .single();
    
      if (createProfileError) {
        setErro("Não foi possível criar seu perfil.");
      } else {
        setProfile(novoPerfil);
      }
    } 

      const { data: episodesData, error: episodesError } = await supabase
        .from("life_episodes")
        .select(
          "id, title, life_phase, approximate_age, approximate_year, main_theme, status, created_at"
        )
        .eq("user_id", user.id)
        .order("approximate_year", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (episodesError) {
        setErro("Não foi possível carregar seus episódios.");
      } else {
        setEpisodes(episodesData || []);
      }

      setCarregando(false);
    }

    carregarDados();
  }, [router]);

  const totalEpisodios = episodes.length;

  const episodiosReconstruidos = useMemo(() => {
    return episodes.filter((episode) =>
      ["resignified", "integrated"].includes(episode.status || "")
    ).length;
  }, [episodes]);

  const progresso =
    totalEpisodios > 0
      ? Math.round((episodiosReconstruidos / totalEpisodios) * 100)
      : 0;

      const primeiroRegistrado = episodes.find(
        (episode) => episode.status === "registered" || !episode.status
      );
      
      const primeiroEmReconstrucao = episodes.find(
        (episode) => episode.status === "reconstructing"
      );
      
      const primeiroRessignificado = episodes.find(
        (episode) => episode.status === "resignified"
      );
      
      const episodiosEmAndamento = episodes.filter((episode) =>
        ["registered", "reconstructing", "resignified"].includes(
          episode.status || "registered"
        )
      );
      
      const episodiosIntegrados = episodes.filter(
        (episode) => episode.status === "integrated"
      );

      const proximoPasso = (() => {
        if (totalEpisodios === 0) {
          return {
            titulo: "Registre seu primeiro episódio",
            descricao:
              "Comece por uma lembrança simples. Não precisa ser a parte mais pesada da sua história. O primeiro passo é apenas colocar um ponto na linha da vida.",
            href: "/dashboard/episodios/novo",
            botao: "Registrar primeiro episódio",
          };
        }
      
        if (primeiroRegistrado) {
          return {
            titulo: "Comece a reconstrução de um episódio",
            descricao:
              "Você já registrou um episódio, mas ele ainda está apenas como lembrança inicial. Abra esse registro e comece pelo campo “Eu daquele tempo”.",
            href: `/dashboard/episodios/${primeiroRegistrado.id}`,
            botao: "Abrir episódio registrado",
          };
        }
      
        if (primeiroEmReconstrucao) {
          return {
            titulo: "Continue uma reconstrução em andamento",
            descricao:
              "Existe um episódio que já começou a ser trabalhado. Continue escrevendo sua nova leitura até chegar na frase de integração.",
            href: `/dashboard/episodios/${primeiroEmReconstrucao.id}`,
            botao: "Continuar reconstrução",
          };
        }
      
        if (primeiroRessignificado) {
          return {
            titulo: "Integre um episódio já ressignificado",
            descricao:
              "Você já avançou bastante em um episódio. Agora falta o gesto final: escrever ou revisar a frase de integração e marcar como integrado.",
            href: `/dashboard/episodios/${primeiroRessignificado.id}`,
            botao: "Finalizar integração",
          };
        }
      
        return {
          titulo: "Registre um novo ponto da sua história",
          descricao:
            "Os episódios registrados até agora estão integrados. Você pode continuar sua linha da vida escolhendo outra fase, lembrança ou decisão importante.",
          href: "/dashboard/episodios/novo",
          botao: "Registrar novo episódio",
        };
      })();

  async function handleSair() {
    setSaindo(true);
    await supabase.auth.signOut();
    router.push("/login");
  }

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
        <header className="flex flex-col gap-5 rounded-[2rem] border border-[#E3D6C3] bg-white/70 p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#6F6256]">
              Teoria Universal
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Olá, {profile?.full_name || "visitante"}.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F6256]">
              Este é o início da sua linha da vida. Registre episódios, revise
              interpretações antigas e reconstrua o sentido que cada lembrança
              ocupa dentro da sua história.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row md:items-center">
          <Link
  href="/dashboard/ponto-de-partida"
  className="rounded-full bg-[#2A1D16] px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#5B3A29]"
>
  Começar pelo que sinto hoje
</Link>

<Link
  href="/dashboard/episodios/novo"
  className="rounded-full border border-[#CBB89E] bg-white px-5 py-3 text-center text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF]"
>
  Registrar direto
</Link>  

            <button
              onClick={handleSair}
              disabled={saindo}
              className="rounded-full border border-[#CBB89E] bg-white px-5 py-3 text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF] disabled:opacity-60"
            >
              {saindo ? "Saindo..." : "Sair"}
            </button>
          </div>
        </header>

        {erro && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {erro}
          </div>
        )}

<section className="mt-6 rounded-[2rem] border border-[#D8C7B1] bg-[#FBF7EF] p-5 shadow-sm md:p-6">
  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
    <div>
      <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#6F6256]">
        Próximo passo sugerido
      </p>

      <h2 className="mt-2 text-2xl font-semibold text-[#241F1A]">
        {proximoPasso.titulo}
      </h2>

      <p className="mt-2 max-w-3xl text-sm leading-6 text-[#6F6256]">
        {proximoPasso.descricao}
      </p>
    </div>

    <Link
      href={proximoPasso.href}
      className="rounded-full bg-[#2A1D16] px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#5B3A29]"
    >
      {proximoPasso.botao}
    </Link>
  </div>
</section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.5rem] border border-[#E3D6C3] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#6F6256]">
              Episódios registrados
            </p>
            <p className="mt-3 text-4xl font-semibold">{totalEpisodios}</p>
            <p className="mt-2 text-sm leading-6 text-[#6F6256]">
              Partes da sua história já colocadas na linha da vida.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#E3D6C3] bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-[#6F6256]">
              Episódios reconstruídos
            </p>
            <p className="mt-3 text-4xl font-semibold">
              {episodiosReconstruidos}
            </p>
            <p className="mt-2 text-sm leading-6 text-[#6F6256]">
              Episódios que já receberam uma nova leitura.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-[#E3D6C3] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-[#6F6256]">
                Progresso da jornada registrada
              </p>
              <span className="text-sm font-semibold text-[#66785F]">
                {progresso}%
              </span>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#E3D6C3]">
              <div
                className="h-full rounded-full bg-[#66785F] transition-all"
                style={{ width: `${progresso}%` }}
              />
            </div>

            <p className="mt-3 text-sm leading-6 text-[#6F6256]">
              Essa porcentagem mede apenas os episódios registrados por você,
              não uma promessa de vida totalmente resolvida.
            </p>
          </div>
        </section>
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
  <div className="rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm md:p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold">Episódios em andamento</h2>
        <p className="mt-2 text-sm leading-6 text-[#6F6256]">
          Partes da sua história que ainda estão registradas, em reconstrução
          ou aguardando integração.
        </p>
      </div>

      <span className="rounded-full bg-[#FBF7EF] px-3 py-1 text-sm font-semibold text-[#5B3A29]">
        {episodiosEmAndamento.length}
      </span>
    </div>

    {episodiosEmAndamento.length === 0 ? (
      <div className="mt-5 rounded-2xl border border-dashed border-[#CBB89E] bg-[#FBF7EF] p-5">
        <p className="font-semibold text-[#5B3A29]">
          Nenhum episódio em andamento.
        </p>
        <p className="mt-2 text-sm leading-6 text-[#6F6256]">
          Os episódios registrados até aqui estão integrados. Isso não significa
          vida resolvida, mas significa que você fechou bem essa parte
          registrada. Esse é um avanço importante dentro da sua jornada registrada.
        </p>
      </div>
    ) : (
      <div className="mt-5 space-y-3">
        {episodiosEmAndamento.slice(0, 4).map((episode) => (
          <Link
            key={episode.id}
            href={`/dashboard/episodios/${episode.id}`}
            className="block rounded-2xl border border-[#E3D6C3] bg-[#FBF7EF] p-4 transition hover:bg-[#F6F1E8]"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="break-words font-semibold text-[#241F1A]">
                  {episode.title}
                </h3>
                <p className="mt-1 text-sm text-[#6F6256]">
                  {episode.life_phase || "Fase não informada"}
                  {episode.main_theme ? ` • ${episode.main_theme}` : ""}
                </p>
              </div>

              <span className="w-fit shrink-0 rounded-full bg-[#66785F]/15 px-3 py-1 text-xs font-semibold text-[#66785F]">
                {traduzirStatus(episode.status)}
              </span>
            </div>
          </Link>
        ))}

        {episodiosEmAndamento.length > 4 && (
          <Link
            href="/dashboard/linha-da-vida"
            className="inline-flex rounded-full border border-[#CBB89E] bg-white px-5 py-3 text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF]"
          >
            Ver todos na linha da vida
          </Link>
        )}
      </div>
    )}
  </div>

  <div className="rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm md:p-6">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold">Episódios integrados</h2>
        <p className="mt-2 text-sm leading-6 text-[#6F6256]">
          Registros que já receberam uma frase de integração e foram marcados
          como parte consciente da sua história.
        </p>
      </div>

      <span className="rounded-full bg-[#66785F]/15 px-3 py-1 text-sm font-semibold text-[#66785F]">
        {episodiosIntegrados.length}
      </span>
    </div>

    {episodiosIntegrados.length === 0 ? (
      <div className="mt-5 rounded-2xl border border-dashed border-[#CBB89E] bg-[#FBF7EF] p-5">
        <p className="font-semibold text-[#5B3A29]">
          Nenhum episódio integrado ainda.
        </p>
        <p className="mt-2 text-sm leading-6 text-[#6F6256]">
          Quando você finalizar uma reconstrução e marcar como integrada, ela
          aparecerá aqui.
        </p>
      </div>
    ) : (
      <div className="mt-5 space-y-3">
        {episodiosIntegrados.slice(0, 4).map((episode) => (
          <Link
            key={episode.id}
            href={`/dashboard/episodios/${episode.id}`}
            className="block rounded-2xl border border-[#E3D6C3] bg-[#FBF7EF] p-4 transition hover:bg-[#F6F1E8]"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h3 className="break-words font-semibold text-[#241F1A]">
                  {episode.title}
                </h3>
                <p className="mt-1 text-sm text-[#6F6256]">
                  {episode.life_phase || "Fase não informada"}
                  {episode.main_theme ? ` • ${episode.main_theme}` : ""}
                </p>
              </div>

              <span className="w-fit shrink-0 rounded-full bg-[#66785F]/15 px-3 py-1 text-xs font-semibold text-[#66785F]">
                Integrado
              </span>
            </div>
          </Link>
        ))}

        {episodiosIntegrados.length > 4 && (
          <Link
            href="/dashboard/linha-da-vida"
            className="inline-flex rounded-full border border-[#CBB89E] bg-white px-5 py-3 text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF]"
          >
            Ver todos na linha da vida
          </Link>
        )}
      </div>
    )}
  </div>
</section>
        <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-xl font-semibold">Sua linha da vida</h2>

            <p className="mt-2 text-sm leading-6 text-[#6F6256]">
              Organize os acontecimentos por fase, idade ou ano aproximado.
              A ordem perfeita não importa agora. O primeiro passo é registrar.
            </p>

            <div className="mt-5 space-y-3">
              <Link
                href="/dashboard/linha-da-vida"
                className="block rounded-2xl border border-[#E3D6C3] bg-[#FBF7EF] p-4 transition hover:bg-[#F6F1E8]"
              >
                <p className="font-semibold text-[#5B3A29]">
                  Abrir linha da vida completa
                </p>
                <p className="mt-1 text-sm leading-6 text-[#6F6256]">
                  Veja todos os episódios em sequência cronológica.
                </p>
              </Link>

              <Link
                href="/dashboard/episodios/novo"
                className="block rounded-2xl border border-[#E3D6C3] bg-[#FBF7EF] p-4 transition hover:bg-[#F6F1E8]"
              >
                <p className="font-semibold text-[#5B3A29]">
                Registrar episódio diretamente
                </p>
                <p className="mt-1 text-sm leading-6 text-[#6F6256]">
                  Comece por uma lembrança, uma fase, uma dor, uma decisão ou
                  um recomeço.
                </p>
              </Link>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Últimos episódios</h2>
                <p className="mt-2 text-sm leading-6 text-[#6F6256]">
                  Os episódios mais recentes que você registrou.
                </p>
              </div>
            </div>

            {episodes.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-[#CBB89E] bg-[#FBF7EF] p-5">
                <p className="font-semibold text-[#5B3A29]">
                  Nenhum episódio registrado ainda.
                </p>
                <p className="mt-2 text-sm leading-6 text-[#6F6256]">
                  Comece por algo simples. Não precisa ser o maior trauma da
                  sua vida logo na primeira tela. Você pode começar por uma lembrança pequena, uma fase importante ou um episódio que esteja pronto para olhar agora.
                </p>

                <Link
                  href="/dashboard/episodios/novo"
                  className="mt-4 inline-flex rounded-full bg-[#2A1D16] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5B3A29]"
                >
                  Registrar primeiro episódio
                </Link>
              </div>
            ) : (
              <div className="mt-5 space-y-3">
                {episodes.slice(0, 5).map((episode) => (
                  <Link
                    key={episode.id}
                    href={`/dashboard/episodios/${episode.id}`}
                    className="block rounded-2xl border border-[#E3D6C3] bg-[#FBF7EF] p-4 transition hover:bg-[#F6F1E8]"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="font-semibold text-[#241F1A]">
                          {episode.title}
                        </h3>

                        <p className="mt-1 text-sm text-[#6F6256]">
                          {episode.life_phase || "Fase não informada"}
                          {episode.approximate_age
                            ? ` • ${episode.approximate_age} anos`
                            : ""}
                          {episode.approximate_year
                            ? ` • ${episode.approximate_year}`
                            : ""}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-[#66785F]/15 px-3 py-1 text-xs font-semibold text-[#66785F]">
                        {traduzirStatus(episode.status)}
                      </span>
                    </div>

                    {episode.main_theme && (
                      <p className="mt-3 text-sm leading-6 text-[#6F6256]">
                        Tema: {episode.main_theme}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}