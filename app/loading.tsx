export default function Loading() {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F6F1E8] px-6 text-[#241F1A]">
        <div className="w-full max-w-sm rounded-[2rem] border border-[#E3D6C3] bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-[#CBB89E] bg-[#FBF7EF]">
            <span className="text-2xl font-semibold text-[#2A1D16]">TU</span>
          </div>
  
          <p className="mt-5 text-sm font-medium uppercase tracking-[0.22em] text-[#6F6256]">
            Teoria Universal
          </p>
  
          <h1 className="mt-2 text-2xl font-semibold">
            Carregando sua linha da vida
          </h1>
  
          <div className="mx-auto mt-5 h-2 w-full overflow-hidden rounded-full bg-[#E3D6C3]">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#66785F]" />
          </div>
  
          <p className="mt-4 text-sm leading-6 text-[#6F6256]">
            Preparando um espaço seguro para continuar sua reconstrução.
          </p>
        </div>
      </main>
    );
  }