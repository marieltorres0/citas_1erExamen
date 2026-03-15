import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { pacienteSchema } from '../utils/pacienteSchema'

function ModalEditarPaciente({ paciente, onClose, onSave }) {
  const [nombre, setNombre] = useState('')
  const [propietario, setPropietario] = useState('')
  const [email, setEmail] = useState('')
  const [fecha, setFecha] = useState('')
  const [sintomas, setSintomas] = useState('')
  const [error, setError] = useState({})

  useEffect(() => {
    if (!paciente?.id) {
      return
    }

    setNombre(paciente.nombre ?? '')
    setPropietario(paciente.propietario ?? '')
    setEmail(paciente.email ?? '')
    setFecha(paciente.fecha ?? '')
    setSintomas(paciente.sintomas ?? '')
    setError({})
  }, [paciente])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const handleSubmit = (event) => {
    event.preventDefault()

    const resultado = pacienteSchema.safeParse({
      nombre,
      propietario,
      email,
      fecha,
      sintomas,
    })

    if (!resultado.success) {
      setError(resultado.error.format())
      return
    }

    const confirmar = window.confirm('¿Estás segura de que deseas guardar los cambios?')

    if (!confirmar) {
      return
    }

    onSave({
      ...paciente,
      ...resultado.data,
    })

    toast('Cambios guardados')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-2xl rounded-[2rem] border border-white/70 bg-white p-6 shadow-[0_30px_80px_-35px_rgba(15,23,42,0.45)] sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="font-[Manrope] text-3xl font-extrabold tracking-[-0.03em] text-slate-900">
              Editar Paciente
            </h3>
            <p className="mt-2 text-sm text-slate-500">Modifica los datos del paciente registrado.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-500 transition hover:border-slate-300 hover:text-slate-800"
          >
            Cerrar
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="editar-mascota">
              Nombre Mascota
            </label>
            <input
              type="text"
              id="editar-mascota"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
            />
            {error?.nombre?._errors[0] && <p className="mt-2 text-sm text-rose-600">{error.nombre._errors[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="editar-propietario">
              Nombre Propietario
            </label>
            <input
              type="text"
              id="editar-propietario"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
              value={propietario}
              onChange={(event) => setPropietario(event.target.value)}
            />
            {error?.propietario?._errors[0] && <p className="mt-2 text-sm text-rose-600">{error.propietario._errors[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="editar-email">
              Email
            </label>
            <input
              type="email"
              id="editar-email"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            {error?.email?._errors[0] && <p className="mt-2 text-sm text-rose-600">{error.email._errors[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="editar-fecha">
              Alta
            </label>
            <input
              type="date"
              id="editar-fecha"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
              value={fecha}
              onChange={(event) => setFecha(event.target.value)}
            />
            {error?.fecha?._errors[0] && <p className="mt-2 text-sm text-rose-600">{error.fecha._errors[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="editar-sintomas">
              Sintomas
            </label>
            <textarea
              id="editar-sintomas"
              className="mt-2 min-h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
              value={sintomas}
              onChange={(event) => setSintomas(event.target.value)}
            />
            {error?.sintomas?._errors[0] && <p className="mt-2 text-sm text-rose-600">{error.sintomas._errors[0]}</p>}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.8)] transition duration-200 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-[0_24px_35px_-20px_rgba(13,148,136,0.65)] active:translate-y-0"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalEditarPaciente