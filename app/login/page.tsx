"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");

    const emailLimpo = email.trim().toLowerCase();

    if (!emailLimpo || !senha) {
      setErro("Informe e-mail e senha.");
      return;
    }

    setCarregando(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: emailLimpo,
        password: senha,
      });

      if (error) {
        setErro("E-mail ou senha inválidos.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setErro("Ocorreu um erro inesperado ao entrar.");
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
              Continue sua reconstrução.
            </h1>

            <p className="mt-5 max-w-xl text-lg leading-8 text-[#6F6256]">
              Acesse sua linha da vida, revise episódios registrados e continue
              escrevendo uma nova leitura para sua própria história.
            </p>
          </section>

          <section className="rounded-[2rem] border border-[#E3D6C3] bg-white p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-semibold">Entrar</h2>
            <p className="mt-2 text-sm leading-6 text-[#6F6256]">
              Entre com o e-mail e a senha usados no cadastro.
            </p>

            <form onSubmit={handleLogin} className="mt-7 space-y-5">
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
                    autoComplete="current-password"
                    className="w-full rounded-2xl bg-transparent px-4 py-3 text-sm outline-none disabled:opacity-60"
                    placeholder="Sua senha"
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

              <button
                type="submit"
                disabled={carregando}
                className="w-full rounded-full bg-[#2A1D16] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#5B3A29] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {carregando ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-[#6F6256]">
              Ainda não tem conta?{" "}
              <Link href="/cadastro" className="font-semibold text-[#5B3A29]">
                Criar conta
              </Link>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}