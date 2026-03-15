import { generarReporteCitasPDF } from '../utils/generarReporteCitasPDF'

// Mapa para mostrar etiquetas legibles de duracion en la tarjeta de la cita
const DURACION_LABEL = {
  '30min': '30 min',
  '1hr': '1 hr',
  '1.5hr': '1 hr 30 min',
  '2hr': '2 hr',
}

const CalendarioCitas = ({ citas, pacientes, onSolicitarCancelarCita, onEditarCita, onAgregarCita }) => {
  // Buscamos el nombre del paciente por id; si fue eliminado lo indicamos en la UI
  const obtenerNombrePaciente = (pacienteId) => {
    const paciente = pacientes.find((p) => p.id === pacienteId)
    return paciente?.nombre ?? 'Paciente eliminado'
  }

  // Formato legible para el encabezado de cada grupo de fecha
  const formatearFecha = (fechaStr) =>
    new Date(`${fechaStr}T00:00:00`).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

  // Ordenamos todas las citas por fecha y hora de forma ascendente
  const citasOrdenadas = [...citas].sort((a, b) => {
    if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha)
    return a.hora.localeCompare(b.hora)
  })

  // Agrupamos las citas por fecha para darle estructura de "calendario"
  const citasPorFecha = citasOrdenadas.reduce((grupos, cita) => {
    if (!grupos[cita.fecha]) grupos[cita.fecha] = []
    grupos[cita.fecha].push(cita)
    return grupos
  }, {})

  const handleGenerarReporte = () => {
    // Reutilizamos la misma idea que en el reporte de pacientes, pero enfocada en citas.
    generarReporteCitasPDF(citas, pacientes)
  }

  return (
    <section className="rounded-4xl border border-white/70 bg-white/75 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm lg:max-h-184 lg:overflow-y-auto lg:pr-4">
      <header className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="text-center sm:text-left">
          <h2 className="font-[Manrope] text-3xl font-extrabold tracking-[-0.03em] text-slate-900">Calendario de Citas</h2>
          <p className="mt-2 text-sm text-slate-600 sm:text-base">
            Próximas&nbsp;
            <span className="font-bold text-teal-700">Citas Agendadas</span>
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-stretch">
          <button
            type="button"
            onClick={onAgregarCita}
            className="w-full rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.8)] transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-[0_24px_35px_-20px_rgba(13,148,136,0.65)] sm:w-auto"
          >
            Agendar Cita
          </button>

          <button
            type="button"
            onClick={handleGenerarReporte}
            className="w-full rounded-full border border-teal-300 bg-teal-50 px-5 py-2 text-sm font-semibold text-teal-700 transition duration-200 hover:border-teal-400 hover:bg-teal-100 sm:w-auto"
          >
            Generar reporte PDF
          </button>
        </div>
      </header>

      {citas.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-2xl text-slate-500">
          No hay citas agendadas
        </p>
      ) : (
        <div className="space-y-6">
          {/* Iteramos cada grupo de fecha y mostramos sus citas debajo */}
          {Object.entries(citasPorFecha).map(([fecha, citasDelDia]) => (
            <div key={fecha}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-[0.14em] text-teal-700 border-b border-teal-100 pb-2">
                {formatearFecha(fecha)}
              </h3>

              <div className="space-y-3">
                {citasDelDia.map((cita) => (
                  <article
                    key={cita.id}
                    className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_25px_-18px_rgba(15,23,42,0.35)] transition duration-300 hover:border-teal-200 hover:shadow-[0_18px_35px_-20px_rgba(15,23,42,0.25)]"
                  >
                    <span className="absolute inset-y-5 left-0 w-1 rounded-r-full bg-linear-to-b from-teal-500 to-cyan-400 opacity-70 transition duration-300 group-hover:opacity-100" />

                    <div className="flex items-start justify-between gap-4 pl-3">
                      <div className="min-w-0 flex-1">
                        <p className="mb-1 font-bold text-slate-900">{obtenerNombrePaciente(cita.pacienteId)}</p>
                        <p className="mb-2 text-sm text-slate-500">
                          {cita.hora} · {DURACION_LABEL[cita.duracion]}
                        </p>
                        <p className="text-sm text-slate-700">{cita.motivo}</p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {/* Boton para reprogramar/editar la cita, consistente con el estilo de acciones secundarias. */}
                        <button
                          type="button"
                          onClick={() => onEditarCita(cita)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition duration-200 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
                        >
                          Reprogramar
                        </button>

                        {/* Boton para solicitar la cancelacion de la cita, abre un modal de confirmacion. */}
                        <button
                          type="button"
                          onClick={() => onSolicitarCancelarCita(cita)}
                          className="rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs font-semibold text-rose-600 transition duration-200 hover:border-rose-300 hover:bg-rose-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default CalendarioCitas
