import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { citaSchema } from '../utils/citaSchema'

const DURACIONES = [
  { value: '30min', label: '30 minutos' },
  { value: '1hr', label: '1 hora' },
  { value: '1.5hr', label: '1 hora 30 minutos' },
  { value: '2hr', label: '2 horas' },
]

const ModalEditarCita = ({ cita, pacienteNombre, onClose, onSave }) => {
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [motivo, setMotivo] = useState('')
  const [duracion, setDuracion] = useState('')
  const [error, setError] = useState({})

  useEffect(() => {
    if (cita) {
      setFecha(cita.fecha ?? '')
      setHora(cita.hora ?? '')
      setMotivo(cita.motivo ?? '')
      setDuracion(cita.duracion ?? '')
      setError({})
    }
  }, [cita])

  const handleSubmit = (e) => {
    e.preventDefault()

    // Reutilizamos el mismo esquema de validacion que en la creacion de citas.
    const resultado = citaSchema.safeParse({
      pacienteId: cita.pacienteId,
      fecha,
      hora,
      motivo,
      duracion,
    })

    if (!resultado.success) {
      setError(resultado.error.format())
      return
    }

    setError({})

    const citaActualizada = {
      ...cita,
      fecha,
      hora,
      motivo,
      duracion,
    }

    onSave(citaActualizada)
    toast.success(`Cita de ${pacienteNombre} actualizada`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
      <div className="w-120 max-w-[95vw] rounded-3xl border border-white/70 bg-white p-6 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.55)]">
        <h3 className="font-[Manrope] text-2xl font-extrabold text-slate-900">Editar cita</h3>
        <p className="mt-1 text-sm text-slate-600">
          Paciente: <span className="font-semibold text-slate-900">{pacienteNombre}</span>
        </p>

        <form
          className="mt-5 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="editar-fecha">
                Fecha
              </label>
              <input
                type="date"
                id="editar-fecha"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition duration-200 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
              />
              {error?.fecha?._errors[0] && (
                <p className="mt-1 text-xs text-rose-600">{error.fecha._errors[0]}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="editar-hora">
                Hora
              </label>
              <input
                type="time"
                id="editar-hora"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition duration-200 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
              />
              {error?.hora?._errors[0] && (
                <p className="mt-1 text-xs text-rose-600">{error.hora._errors[0]}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="editar-duracion">
              Duración Estimada
            </label>
            <select
              id="editar-duracion"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition duration-200 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
            >
              <option value="">Selecciona la duración</option>
              {DURACIONES.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            {error?.duracion?._errors[0] && (
              <p className="mt-1 text-xs text-rose-600">{error.duracion._errors[0]}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="editar-motivo">
              Motivo de Consulta
            </label>
            <textarea
              id="editar-motivo"
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
            />
            {error?.motivo?._errors[0] && (
              <p className="mt-1 text-xs text-rose-600">{error.motivo._errors[0]}</p>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-full border border-teal-500 bg-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-[0_4px_14px_-4px_rgba(13,148,136,0.6)] transition hover:bg-teal-700"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ModalEditarCita
