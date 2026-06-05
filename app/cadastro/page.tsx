"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CadastroPage() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function emailValido(valor: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor);
  }

  async function handleCadastro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setSucesso("");

    const nomeLimpo = nome.trim();
    const emailLimpo = email.trim().toLowerCase();

    if (!nomeLimpo) {
      setErro("Informe seu nome.");
      return;
    }

    if (!emailValido(emailLimpo)) {
      setErro("Informe um e-mail válido.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: emailLimpo,
        password: senha,
        options: {
          data: {
            full_name: nomeLimpo,
          },
        },
      });

      if (error) {
        setErro(error.message || "Não foi possível criar sua conta.");
        return;
      }

      const userId = data.user?.id;

      if (userId) {
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: userId,
          full_name: nomeLimpo,
          updated_at: new Date().toISOString(),
        });

        if (profileError) {
          setErro(
            "Sua conta foi criada, mas não conseguimos salvar seu perfil agora."
          );
          return;
        }
      }

      setSucesso("Conta criada com sucesso. Você já pode acessar sua linha da vida.");

      setTimeout(() => {
        router.push("/dashboard");
      }, 900);
    } catch {
      setErro("Ocorreu um erro inesperado ao criar sua conta.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F6F1E8] px-6 py-8 text-[#241F1A]">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="flex flex-col justify-center">
            <Link
              href="/"
              className="mb-8 inline-flex w-fit rounded-full border border-[#CBB89E] bg-white/50 px-4 py-2 text-sm font-medium text-[#5B3A29] transition hover:bg-white"
            >
              ← Voltar para o início
            </Link>

            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[#6F6256]">
              Teoria Universal
            </p>

            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              Comece sua linha da vida.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-[#6F6256]">
              Registre episódios importantes, compreenda o eu daquele tempo e
              escreva uma nova leitura a partir do eu de hoje.
            </p>

            <div className="mt-8 rounded-[1.5rem] border border-[#E3D6C3] bg-white/60 p-5">
              <p className="text-sm font-semibold text-[#5B3A29]">
                Lembrete importante
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6F6256]">
                Este espaço é para autoconhecimento e organização da própria
                história. Ele não substitui acompanhamento profissional em
                casos de sofrimento intenso, trauma ou risco emocional.
              </p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[#E3D6C3] bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-semibold">Criar conta</h2>
            <p className="mt-2 text-sm leading-6 text-[#6F6256]">
              Use um e-mail válido para acessar seus episódios depois.
            </p>

            <form onSubmit={handleCadastro} className="mt-7 space-y-5">
              <div>
                <label className="text-sm font-medium text-[#5B3A29]">
                  Nome
                </label>
                <input
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  type="text"
                  required
                  disabled={carregando}
                  autoComplete="name"
                  className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#5B3A29]">
                  E-mail
                </label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  required
                  disabled={carregando}
                  autoComplete="email"
                  className="mt-2 w-full rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] px-4 py-3 text-sm outline-none transition focus:border-[#5B3A29] disabled:opacity-60"
                  placeholder="voce@email.com"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[#5B3A29]">
                  Senha
                </label>

                <div className="mt-2 flex rounded-2xl border border-[#D9C9B5] bg-[#FBF7EF] focus-within:border-[#5B3A29]">
                  <input
                    value={senha}
                    onChange={(event) => setSenha(event.target.value)}
                    type={mostrarSenha ? "text" : "password"}
                    required
                    disabled={carregando}
                    autoComplete="new-password"
                    className="w-full rounded-2xl bg-transparent px-4 py-3 text-sm outline-none disabled:opacity-60"
                    placeholder="Mínimo 6 caracteres"
                  />

                  <button
                    type="button"
                    onClick={() => setMostrarSenha((valor) => !valor)}
                    className="px-4 text-sm font-medium text-[#5B3A29]"
                  >
                    {mostrarSenha ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              {erro && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                  {erro}
                </div>
              )}

              {sucesso && (
                <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">
                  {sucesso}
                </div>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="w-full rounded-full bg-[#2A1D16] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5B3A29] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {carregando ? "Criando conta..." : "Criar minha conta"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6F6256]">
              Já tem conta?{" "}
              <Link href="/login" className="font-semibold text-[#5B3A29]">
                Entrar
              </Link>
            </p>
            <p className="mt-4 text-center text-xs leading-5 text-[#6F6256]">
  Ao criar sua conta, você declara estar ciente dos{" "}
  <Link href="/termos" className="font-semibold text-[#5B3A29] hover:underline">
    Termos de Uso
  </Link>{" "}
  e da{" "}
  <Link
    href="/privacidade"
    className="font-semibold text-[#5B3A29] hover:underline"
  >
    Política de Privacidade
  </Link>
  .
</p>
          </section>
        </div>
      </div>
    </main>
  );
}