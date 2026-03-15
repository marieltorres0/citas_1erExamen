const Header = () => {
  return (
    <header className="mb-10 text-center lg:mb-14">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-teal-100 bg-teal-50/80 px-4 py-1 text-xs font-semibold tracking-[0.16em] text-teal-700 shadow-[0_8px_18px_-12px_rgba(15,118,110,0.6)]">
        <span className="h-2 w-2 rounded-full bg-teal-500" />
        <span>Panel de gestion de pacientes y citas</span>
      </div>

      <h1 className="mx-auto mt-4 max-w-3xl font-[Manrope] text-4xl font-extrabold tracking-[-0.04em] text-slate-900 sm:text-5xl lg:text-6xl">
        <span className="relative inline-block text-teal-700">
          Veterinaria San Patitas
          <span className="absolute inset-x-1 bottom-1 -z-10 h-3 rounded-full bg-teal-100"></span>
        </span>
      </h1>
    </header>
  )
}

export default Header