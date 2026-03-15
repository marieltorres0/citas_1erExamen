const ModalConfirmarEliminacion = ({ paciente, onClose, onConfirm }) => {
  return (
    // Overlay semitransparente para enfocar la atencion en la decision de eliminar.
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4">
      {/* Modal compacto: evita que la ventana se perciba como un panel de ancho completo. */}
      <div className="w-104 max-w-[90vw] rounded-3xl border border-white/70 bg-white p-6 shadow-[0_24px_60px_-35px_rgba(15,23,42,0.55)]">
        <h3 className="font-[Manrope] text-2xl font-extrabold text-slate-900">Confirmar eliminación</h3>

        {/* Mensaje personalizado del modal: explica la eliminacion sin depender de dialogs nativos del navegador. */}
        <p className="mt-3 text-slate-600">
          ¿Deseas eliminar a <span className="font-semibold text-slate-900">{paciente?.nombre}</span>? Esta acción removerá su registro de la lista.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            // "Cancelar" solo cierra el modal y no ejecuta la eliminacion.
            onClick={onClose}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            // "Eliminar" delega la accion al callback del componente padre.
            onClick={onConfirm}
            className="rounded-full border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ModalConfirmarEliminacion
