import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F6F1E8] text-[#241F1A]">
      <section className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 md:px-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#6F6256]">
              Teoria Universal
            </p>
            <h1 className="mt-2 text-xl font-semibold tracking-tight">
              Linha da Vida Ressignificada
            </h1>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <Link
              href="/login"
              className="rounded-full border border-[#CBB89E] px-5 py-2 text-sm font-medium text-[#5B3A29] transition hover:bg-white"
            >
              Entrar
            </Link>

            <Link
              href="/cadastro"
              className="rounded-full bg-[#2A1D16] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#5B3A29]"
            >
              Começar
            </Link>
          </div>
        </header>

        <div className="grid flex-1 items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex rounded-full border border-[#CBB89E] bg-[#FBF7EF] px-4 py-2 text-sm text-[#6F6256]">
              Reconstrua sua história, episódio por episódio.
            </div>

            <h2 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
              Sua vida não precisa ser explicada por uma teoria pronta.
              Ela pode ser reconstruída por você.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6F6256]">
              A Teoria Universal é um espaço para registrar episódios da sua
              história, olhar para o eu daquele tempo e escrever uma nova
              leitura a partir do eu de hoje. Não é apagar o que aconteceu.
              É mudar o lugar que cada lembrança ocupa dentro de você.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cadastro"
                className="rounded-full bg-[#2A1D16] px-7 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#5B3A29]"
              >
                Começar minha linha da vida
              </Link>

              <Link
                href="/login"
                className="rounded-full border border-[#CBB89E] bg-white/40 px-7 py-3 text-center text-sm font-semibold text-[#5B3A29] transition hover:bg-white"
              >
                Já tenho acesso
              </Link>
            </div>

            <p className="mt-5 max-w-xl text-sm leading-6 text-[#6F6256]">
              Este app é uma ferramenta de autoconhecimento e organização
              narrativa. Ele não substitui acompanhamento profissional em
              situações de sofrimento intenso, trauma ou risco emocional.
            </p>
          </div>

          <div className="rounded-[2rem] border border-[#E3D6C3] bg-white/70 p-5 shadow-sm">
            <div className="rounded-[1.5rem] bg-[#FBF7EF] p-5">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#6F6256]">
                    Episódio
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold">
                    O dia em que eu achei que não conseguiria
                  </h3>
                </div>

                <span className="rounded-full bg-[#66785F]/15 px-3 py-1 text-xs font-semibold text-[#66785F]">
                  Em reconstrução
                </span>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-4">
                  <p className="text-sm font-semibold text-[#5B3A29]">
                    Eu daquele tempo
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#6F6256]">
                    Eu pensei que aquela fase definia quem eu era. Senti medo,
                    vergonha e uma vontade enorme de desaparecer.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-4">
                  <p className="text-sm font-semibold text-[#5B3A29]">
                    Eu de hoje
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#6F6256]">
                    Hoje eu entendo que eu estava tentando sobreviver com os
                    recursos que tinha. Aquilo me marcou, mas não precisa
                    continuar governando minhas escolhas.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#CBB89E] bg-[#F6F1E8] p-4">
                  <p className="text-sm font-semibold text-[#5B3A29]">
                    Nova leitura
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#6F6256]">
                    Este episódio faz parte da minha história, mas não define
                    sozinho quem eu sou.
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-[#5B3A29]">
                    Progresso do episódio
                  </span>
                  <span className="text-[#6F6256]">62%</span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-[#E3D6C3]">
                  <div className="h-full w-[62%] rounded-full bg-[#66785F]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="border-t border-[#E3D6C3] py-5 text-sm text-[#6F6256]">
          Teoria Universal — um método para reconstruir a própria história sem
          negar a verdade vivida.
        </footer>
      </section>
    </main>
  );
}