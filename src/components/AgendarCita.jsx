import { useState } from 'react'
import { toast } from 'react-toastify'
import { citaSchema } from '../utils/citaSchema'

// Opciones de duración disponibles para la cita
const DURACIONES = [
  { value: '30min', label: '30 minutos' },
  { value: '1hr', label: '1 hora' },
  { value: '1.5hr', label: '1 hora 30 minutos' },
  { value: '2hr', label: '2 horas' },
]

const AgendarCita = ({ pacientes, onAgregarCita }) => {
  const [pacienteId, setPacienteId] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [motivo, setMotivo] = useState('')
  const [duracion, setDuracion] = useState('')
  const [error, setError] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validamos con Zod antes de guardar (mismo patron que Formulario.jsx)
    const resultado = citaSchema.safeParse({ pacienteId, fecha, hora, motivo, duracion })

    if (!resultado.success) {
      setError(resultado.error.format())
      return
    }

    setError({})

    const nuevaCita = {
      id: Date.now().toString(),
      pacienteId,
      fecha,
      hora,
      motivo,
      duracion,
    }

    onAgregarCita(nuevaCita)

    // Buscamos el nombre del paciente para el mensaje del toast
    const paciente = pacientes.find((p) => p.id === pacienteId)
    toast.success(`Cita para ${paciente?.nombre ?? 'paciente'} agendada`)

    setPacienteId('')
    setFecha('')
    setHora('')
    setMotivo('')
    setDuracion('')
  }

  return (
    <section>
      <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-7">
        <h2 className="text-center font-[Manrope] text-3xl font-extrabold tracking-[-0.03em] text-slate-900">Agendar Cita</h2>
        <p className="mb-8 mt-4 text-center text-lg text-slate-600">
          Programa las{' '}
          <span className="font-bold text-teal-700">Citas de tus Pacientes</span>
        </p>

        {/* Si no hay pacientes registrados, el formulario no tiene sentido mostrarlos */}
        {pacientes.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-lg text-slate-500">
            Registra al menos un paciente para agendar citas
          </p>
        ) : (
          <form
            className="rounded-[1.75rem] border border-slate-200/80 bg-white px-5 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:px-6"
            onSubmit={handleSubmit}
          >
            {/* Dropdown que lista los pacientes existentes */}
            <div className="mb-5">
              <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="cita-paciente">
                Paciente
              </label>
              <select
                id="cita-paciente"
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
              >
                <option value="">Selecciona un paciente</option>
                {pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.nombre} — {paciente.propietario}
                  </option>
                ))}
              </select>
              {error?.pacienteId?._errors[0] && (
                <p className="mt-2 text-sm text-rose-600">{error.pacienteId._errors[0]}</p>
              )}
            </div>

            {/* Fecha y hora en dos columnas para aprovechar el espacio */}
            <div className="mb-5 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="cita-fecha">
                  Fecha
                </label>
                <input
                  type="date"
                  id="cita-fecha"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
                {error?.fecha?._errors[0] && (
                  <p className="mt-2 text-sm text-rose-600">{error.fecha._errors[0]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="cita-hora">
                  Hora
                </label>
                <input
                  type="time"
                  id="cita-hora"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
                />
                {error?.hora?._errors[0] && (
                  <p className="mt-2 text-sm text-rose-600">{error.hora._errors[0]}</p>
                )}
              </div>
            </div>

            {/* Duración estimada de la cita */}
            <div className="mb-5">
              <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="cita-duracion">
                Duración Estimada
              </label>
              <select
                id="cita-duracion"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
              >
                <option value="">Selecciona la duración</option>
                {DURACIONES.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
              {error?.duracion?._errors[0] && (
                <p className="mt-2 text-sm text-rose-600">{error.duracion._errors[0]}</p>
              )}
            </div>

            {/* Motivo de la consulta (breve descripcion del problema) */}
            <div className="mb-6">
              <label className="block text-sm font-semibold uppercase tracking-[0.16em] text-slate-700" htmlFor="cita-motivo">
                Motivo de Consulta
              </label>
              <textarea
                id="cita-motivo"
                rows={3}
                placeholder="Describe el motivo de la consulta"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 hover:border-teal-300 hover:bg-white focus:border-teal-700 focus:bg-white focus:ring-4 focus:ring-teal-100"
              />
              {error?.motivo?._errors[0] && (
                <p className="mt-2 text-sm text-rose-600">{error.motivo._errors[0]}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-teal-600 py-3 text-sm font-bold text-white shadow-[0_4px_16px_-4px_rgba(13,148,136,0.5)] transition duration-200 hover:bg-teal-700 active:scale-[0.98]"
            >
              Agendar Cita
            </button>
          </form>
        )}
      </div>
    </section>
  )
}

export default AgendarCita
