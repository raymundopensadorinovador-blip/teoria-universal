import Link from "next/link";

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-[#F6F1E8] px-6 py-8 text-[#241F1A]">
      <div className="mx-auto w-full max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-flex rounded-full border border-[#CBB89E] bg-white px-5 py-3 text-sm font-semibold text-[#5B3A29] transition hover:bg-[#FBF7EF]"
        >
          ← Voltar ao início
        </Link>

        <article className="rounded-[2rem] border border-[#E3D6C3] bg-white p-6 shadow-sm md:p-8">
          <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#6F6256]">
            Teoria Universal
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            Termos de Uso
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6F6256]">
            Última atualização: 05 de junho de 2026.
          </p>

          <div className="mt-8 space-y-7 text-sm leading-7 text-[#5F564C]">
            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                1. Sobre o aplicativo
              </h2>
              <p className="mt-2">
                A Teoria Universal é uma ferramenta digital de autoconhecimento
                e organização narrativa da história pessoal. O aplicativo
                permite que o usuário registre episódios de vida, reflita sobre
                o que viveu, escreva novas leituras e organize esses registros
                em uma linha da vida.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                2. O que este aplicativo não é
              </h2>
              <p className="mt-2">
                A Teoria Universal não é atendimento psicológico, psicanalítico,
                médico, psiquiátrico, terapêutico ou religioso. O conteúdo do
                aplicativo não substitui acompanhamento profissional, diagnóstico,
                tratamento, aconselhamento clínico ou cuidado de emergência.
              </p>
              <p className="mt-2">
                Em situações de sofrimento intenso, risco de autolesão, ideação
                suicida, violência, abuso, crise emocional grave ou qualquer
                situação de emergência, procure imediatamente ajuda profissional,
                serviços de emergência ou pessoas de confiança.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                3. Uso adequado
              </h2>
              <p className="mt-2">
                O usuário se compromete a usar o aplicativo de forma responsável,
                registrando conteúdos próprios ou conteúdos sobre os quais tenha
                legitimidade para escrever. O usuário não deve usar a plataforma
                para ameaçar, perseguir, expor indevidamente terceiros, publicar
                conteúdo ilegal ou violar direitos de outras pessoas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                4. Responsabilidade pelo conteúdo
              </h2>
              <p className="mt-2">
                Os episódios, reflexões, frases e reconstruções registrados no
                aplicativo são de responsabilidade do próprio usuário. A Teoria
                Universal oferece o espaço e a estrutura de organização, mas não
                valida, confirma ou interpreta automaticamente os fatos narrados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                5. Privacidade e cuidado com informações pessoais
              </h2>
              <p className="mt-2">
                O usuário deve ter atenção ao registrar informações pessoais,
                sensíveis ou relacionadas a terceiros. Recomenda-se evitar dados
                desnecessários que possam expor outras pessoas, como endereços,
                documentos, telefones, detalhes íntimos ou informações que possam
                causar prejuízo a terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                6. Conta de acesso
              </h2>
              <p className="mt-2">
                O usuário é responsável por manter a segurança do seu e-mail,
                senha e acesso ao aplicativo. Caso perceba uso indevido da conta,
                deve interromper o uso e solicitar suporte pelos canais
                disponíveis.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                7. Disponibilidade do serviço
              </h2>
              <p className="mt-2">
                A Teoria Universal está em fase inicial de desenvolvimento e pode
                passar por ajustes, instabilidades, mudanças de funcionalidades,
                correções e interrupções temporárias. O objetivo é melhorar a
                ferramenta progressivamente, preservando a segurança e a
                privacidade dos usuários.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                8. Alterações nos termos
              </h2>
              <p className="mt-2">
                Estes termos podem ser atualizados para refletir melhorias no
                aplicativo, mudanças legais ou ajustes de segurança. A versão
                mais recente ficará disponível nesta página.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                9. Contato
              </h2>
              <p className="mt-2">
                Para dúvidas, solicitações ou questões relacionadas ao uso do
                aplicativo, entre em contato pelo e-mail:
              </p>
              <p className="mt-2 font-semibold text-[#5B3A29]">
                raymundopensadorinovador@gmail.com
              </p>
            </section>
          </div>
        </article>
      </div>
    </main>
  );
}