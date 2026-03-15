const Paciente = ({paciente, onEditar, onSolicitarEliminar, isDeleting}) => {

    const {nombre, propietario, email, fecha, sintomas} = paciente

    const handleEliminar = () => onSolicitarEliminar(paciente)

    return (
        <article
            className={`group relative overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_18px_35px_-28px_rgba(15,23,42,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_28px_50px_-28px_rgba(15,23,42,0.35)] ${isDeleting ? 'opacity-0 -translate-y-2 scale-[0.98] pointer-events-none' : 'opacity-100 translate-y-0 scale-100'}`}
        >
            <span className='absolute inset-y-6 left-0 w-1 rounded-r-full bg-linear-to-b from-teal-600 to-cyan-400 opacity-70 transition duration-300 group-hover:opacity-100'></span>

            <p className='mb-3 pl-3 font-bold uppercase tracking-[0.16em] text-slate-700'>Nombre: {''}
                <span className='normal-case font-normal tracking-normal text-slate-900'>{nombre}</span>
            </p>
            <p className='mb-3 pl-3 font-bold uppercase tracking-[0.16em] text-slate-700'>Propietario: {''}
                <span className='normal-case font-normal tracking-normal text-slate-900'>{propietario}</span>
            </p>
            <p className='mb-3 pl-3 font-bold uppercase tracking-[0.16em] text-slate-700'>Email: {''}
                <span className='normal-case font-normal tracking-normal text-slate-900'>{email}</span>
            </p>
            <p className='mb-3 pl-3 font-bold uppercase tracking-[0.16em] text-slate-700'>Fecha Alta: {''}
                <span className='normal-case font-normal tracking-normal text-slate-900'>{fecha}</span>
            </p>
            <p className='pl-3 font-bold uppercase tracking-[0.16em] text-slate-700'>Síntomas: {''}
                <span className='normal-case font-normal tracking-normal text-slate-900'>{sintomas}</span>
            </p>

            <div className='mt-6 flex justify-end gap-3'>
                <button
                    type='button'
                    onClick={() => onEditar(paciente)}
                    className='rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700'
                >
                    Editar
                </button>
                <button
                    type='button'
                    onClick={handleEliminar}
                    disabled={isDeleting}
                    className='rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 transition duration-200 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700'
                >
                    Eliminar
                </button>
            </div>
        </article>
    )
}

export default Paciente