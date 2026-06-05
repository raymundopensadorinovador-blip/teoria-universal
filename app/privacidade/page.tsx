import Link from "next/link";

export default function PrivacidadePage() {
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
            Política de Privacidade
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6F6256]">
            Última atualização: 05 de junho de 2026.
          </p>

          <div className="mt-8 space-y-7 text-sm leading-7 text-[#5F564C]">
            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                1. Nosso compromisso
              </h2>
              <p className="mt-2">
                A Teoria Universal foi criada para ajudar o usuário a organizar
                sua própria história de vida de forma privada e consciente. Por
                isso, tratamos privacidade como parte essencial do aplicativo,
                não como detalhe secundário.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                2. Dados que podemos coletar
              </h2>
              <p className="mt-2">
                Podemos coletar dados informados diretamente pelo usuário, como
                nome, e-mail, senha de acesso protegida pelo serviço de
                autenticação, episódios de vida, fases da vida, temas, emoções,
                crenças, frases, reconstruções e demais textos inseridos pelo
                próprio usuário.
              </p>
              <p className="mt-2">
                Como o aplicativo permite registros pessoais profundos, o usuário
                pode inserir informações sensíveis. Recomendamos cuidado ao
                escrever dados sobre saúde, religião, vida íntima, terceiros,
                conflitos familiares, traumas ou situações de risco.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                3. Finalidade do tratamento dos dados
              </h2>
              <p className="mt-2">
                Os dados são usados para permitir cadastro, login, armazenamento
                dos episódios, organização da linha da vida, reconstrução
                narrativa, exibição de progresso e funcionamento das áreas
                internas do aplicativo.
              </p>
              <p className="mt-2">
                Não usamos os textos pessoais do usuário para publicidade
                comportamental, venda de dados ou exposição pública.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                4. Base de uso e consentimento
              </h2>
              <p className="mt-2">
                Ao criar uma conta e usar o aplicativo, o usuário declara estar
                ciente de que está inserindo voluntariamente informações pessoais
                para fins de autoconhecimento e organização da própria história.
                O usuário pode deixar de usar o aplicativo e solicitar exclusão
                dos dados conforme previsto nesta política.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                5. Armazenamento e segurança
              </h2>
              <p className="mt-2">
                Os dados são armazenados em serviços de infraestrutura e banco de
                dados utilizados pelo aplicativo. Adotamos controle de acesso por
                autenticação e regras de segurança para que cada usuário acesse
                seus próprios registros.
              </p>
              <p className="mt-2">
                Nenhum sistema digital é totalmente imune a riscos. Por isso,
                trabalhamos para reduzir exposição indevida e recomendamos que o
                usuário evite inserir informações desnecessárias ou excessivamente
                identificáveis sobre terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                6. Compartilhamento de dados
              </h2>
              <p className="mt-2">
                Não vendemos dados pessoais. Não compartilhamos episódios,
                reconstruções ou textos pessoais com outros usuários. O acesso ao
                conteúdo registrado é privado para a conta do próprio usuário,
                salvo se futuramente forem criadas funcionalidades de
                compartilhamento expressamente controladas pelo usuário.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                7. Direitos do usuário
              </h2>
              <p className="mt-2">
                O usuário pode solicitar acesso, correção, atualização ou exclusão
                de seus dados pessoais, observados os limites técnicos e legais.
                Também pode excluir episódios diretamente pelo próprio aplicativo,
                quando essa função estiver disponível para o conteúdo específico.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                8. Dados de terceiros
              </h2>
              <p className="mt-2">
                Ao registrar episódios envolvendo outras pessoas, o usuário deve
                evitar exposição indevida, acusações identificáveis, documentos,
                endereços, telefones ou detalhes que possam violar a privacidade
                de terceiros. O foco do aplicativo é a reconstrução da própria
                história, não a exposição pública de outras pessoas.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                9. Retenção e exclusão
              </h2>
              <p className="mt-2">
                Os dados permanecem armazenados enquanto a conta estiver ativa ou
                enquanto forem necessários para funcionamento do aplicativo. O
                usuário pode solicitar exclusão dos dados pelo canal de contato.
                Funcionalidades automáticas de exclusão de conta poderão ser
                adicionadas em versões futuras.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                10. Crianças e adolescentes
              </h2>
              <p className="mt-2">
                O aplicativo não é direcionado a crianças. O uso por adolescentes
                deve ocorrer com orientação e responsabilidade de pais ou
                responsáveis, especialmente por envolver registros pessoais e
                emocionais.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                11. Atualizações desta política
              </h2>
              <p className="mt-2">
                Esta política pode ser atualizada conforme o aplicativo evoluir,
                novas funcionalidades forem criadas ou exigências legais forem
                ajustadas. A versão mais recente ficará disponível nesta página.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#241F1A]">
                12. Contato
              </h2>
              <p className="mt-2">
                Para dúvidas, solicitações de privacidade ou pedidos relacionados
                aos seus dados, entre em contato pelo e-mail:
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