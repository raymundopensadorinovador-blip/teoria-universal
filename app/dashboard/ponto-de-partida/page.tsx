"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

const areasDaVida = [
  "Relacionamentos",
  "Família",
  "Trabalho",
  "Fé e espiritualidade",
  "Autoimagem",
  "Decisões",
  "Medo do futuro",
  "Dinheiro",
  "Culpa",
  "Rejeição",
  "Ansiedade",
  "Outra área",
];

const repeticoesComuns = [
  "Eu evito começar",
  "Eu tento agradar todo mundo",
  "Eu fujo de conversas difíceis",
  "Eu desconfio de quem se aproxima",
  "Eu me cobro demais",
  "Eu desisto antes de tentar",
  "Eu aceito menos do que gostaria",
  "Eu me calo quando preciso falar",
  "Eu repito escolhas que me machucam",
  "Eu não sei nomear ainda",
];

export default function PontoDePartidaPage() {
  const router = useRouter();

  const [currentPain, setCurrentPain] = useState("");
  const [lifeArea, setLifeArea] = useState("");
  const [currentRepetition, setCurrentRepetition] = useState("");
  const [possibleOrigin, setPossibleOrigin] = useState("");
  const [intensity, setIntensity] = useState(3);

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleSalvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");

    if (!currentPain.trim()) {
      setErro("Escreva o que está doendo, incomodando ou pedindo atenção hoje.");
      return;
    }

    setSalvando(true);

    try {
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
        .insert({
          user_id: user.id,
          current_pain: currentPain.trim(),
          life_area: lifeArea || null,
          current_repetition: currentRepetition.trim() || null,
          possible_origin: possibleOrigin.trim() || null,
          intensity,
        })
        .select("id")
        .single();

      if (error || !data) {
        setErro("Não foi possível salvar este ponto de partida.");
        return;
      }

      router.push(`/dashboard/episodios/novo?ponto=${data.id}`);
    } catch {
      setErro("Ocorreu um erro inesperado ao salvar.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F1E8] px-6 py-8 text-[#241F1A]">
      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-[#E3D6C3] bg-white/70 p-5 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#6F6256]">
              Ponto de partida
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Comece pelo que está pedindo atenção hoje.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6F6256]">
              Antes de registrar um episódio, observe a dor, emoção ou repetição
              que aparece no presente. Depois você poderá ligar isso a uma
              lembrança, fase ou acontecimento da sua história.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-full border border-[#CBB89E] bg-white px-5 py-3 text-center text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF]"
          >
            Voltar ao painel
          </Link>
        </header>

        <section className="mb-6 rounded-[2rem] border border-[#D8C7B1] bg-[#FBF7EF] p-5 shadow-sm md:p-6">
          <h2 className="text-xl font-semibold">
            Como usar este espaço
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#6F6256]">
            Não procure uma causa perfeita. Procure uma ligação possível. A
            pergunta aqui não é “de onde vem exatamente isso?”, mas sim: “que
            parte da minha história parece conversar com o que estou vivendo
            agora?”
          </p>

          <p className="mt-2 text-sm leading-6 text-[#6F6256]">
            Se a lembrança for intensa demais, escolha algo mais leve ou procure
            apoio profissional. Este app organiza reflexão pessoal, mas não
            substitui acompanhamento clínico.
          </p>
        </section>

        <form
          onSubmit={handleSalvar}
          className="rounded-[2rem] border border-[#E3D6C3] bg-white p-5 shadow-sm md:p-7"
        >
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-[#5B3A29]">
                O que está doendo, incomodando ou pedindo atenção hoje?
              </label>

              <textarea
                value={currentPain}
                onChange={(event) => setCurrentPain(event.target.value)}
                required
                disabled={salvando}
                rows={5}
                className="mt-2 w-full resize-none rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Ex: Tenho sentido medo de ser rejeitado, mesmo quando ninguém me rejeitou de fato."
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#5B3A29]">
                Em qual área da vida isso aparece mais?
              </label>

              <select
                value={lifeArea}
                onChange={(event) => setLifeArea(event.target.value)}
                disabled={salvando}
                className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
              >
                <option value="">Selecione uma área</option>
                {areasDaVida.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-[#5B3A29]">
                O que isso faz você repetir hoje?
              </label>

              <select
                value={currentRepetition}
                onChange={(event) => setCurrentRepetition(event.target.value)}
                disabled={salvando}
                className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
              >
                <option value="">Selecione uma repetição ou escolha livre</option>
                {repeticoesComuns.map((repeticao) => (
                  <option key={repeticao} value={repeticao}>
                    {repeticao}
                  </option>
                ))}
              </select>

              <textarea
                value={currentRepetition}
                onChange={(event) => setCurrentRepetition(event.target.value)}
                disabled={salvando}
                rows={3}
                className="mt-3 w-full resize-none rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Ou escreva com suas palavras: quando sinto isso, costumo..."
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[#5B3A29]">
                Que lembrança, fase ou episódio parece ter ligação com isso?
              </label>

              <textarea
                value={possibleOrigin}
                onChange={(event) => setPossibleOrigin(event.target.value)}
                disabled={salvando}
                rows={5}
                className="mt-2 w-full resize-none rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                placeholder="Ex: Isso me lembra uma fase da infância, uma rejeição, uma frase que ouvi, uma perda, uma cobrança, uma vergonha..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-semibold text-[#5B3A29]">
                  Intensidade no presente
                </label>

                <span className="rounded-full bg-[#66785F]/15 px-3 py-1 text-xs font-semibold text-[#66785F]">
                  {intensity}/5
                </span>
              </div>

              <input
                value={intensity}
                onChange={(event) =>
                  setIntensity(Number.parseInt(event.target.value, 10))
                }
                type="range"
                min="1"
                max="5"
                disabled={salvando}
                className="mt-3 w-full accent-[#66785F]"
              />

              <p className="mt-2 text-sm leading-6 text-[#6F6256]">
                Use como referência pessoal. Intensidade alta não significa que
                você precisa resolver tudo agora.
              </p>
            </div>
          </div>

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
              disabled={salvando}
              className="rounded-full bg-[#2A1D16] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5B3A29] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando
                ? "Salvando..."
                : "Continuar para registrar episódio"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}