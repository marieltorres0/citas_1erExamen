const ModalConfirmarCancelarCita = ({ cita, pacienteNombre, onClose, onConfirm }) => {
  const fechaLegible = cita
    ? new Date(`${cita.fecha}T${cita.hora}:00`).toLocaleString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    // Overlay semitransparente, consistente con el modal de eliminación de paciente.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
      <div className="w-104 max-w-[90vw] rounded-3xl border border-white/70 bg-white p-6 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.55)]">
        <h3 className="font-[Manrope] text-2xl font-extrabold text-slate-900">Confirmar cancelación</h3>

        {/* Mensaje de confirmación personalizado para cancelar una cita existente. */}
        <p className="mt-3 text-slate-600">
          ¿Deseas cancelar la cita de{' '}
          <span className="font-semibold text-slate-900">{pacienteNombre}</span>{' '}
          programada para <span className="font-semibold text-slate-900">{fechaLegible}</span>?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Mantener cita
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Cancelar cita
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmarCancelarCita
