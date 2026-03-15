import { useState, useEffect } from "react"
import Formulario from "./components/Formulario"
import Header from "./components/Header"
import ListadoPacientes from "./components/ListadoPacientes"
import ModalEditarPaciente from "./components/ModalEditarPaciente"
import ModalConfirmarEliminacion from "./components/ModalConfirmarEliminacion"
import AgendarCita from "./components/AgendarCita"
import CalendarioCitas from "./components/CalendarioCitas"
import ModalConfirmarCancelarCita from "./components/ModalConfirmarCancelarCita"
import ModalEditarCita from "./components/ModalEditarCita"

import { toast, ToastContainer } from "react-toastify" //https://fkhadra.github.io/react-toastify/introduction
import "react-toastify/dist/ReactToastify.css"
import { generarReportePacientesPDF } from "./utils/generarReportePacientesPDF"
import { generarReporteCitasPDF } from "./utils/generarReporteCitasPDF"

function App() {
  // localstorage es para recuperar info en la memoria local del explorawdor (como ujn cookie) y
  //  se puede usar para guardar info aunque se cierre la pestaña o el navegador, pero no es seguro para info sensible

  const [pacientes, setPacientes] = useState(() => {
    try {
      const stored = localStorage.getItem('pacientes')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error al cargar pacientes desde localStorage:", error)
      return []
    }
  }) 
  const [pacienteEditando, setPacienteEditando] = useState(null)
  const [pacientePendienteEliminar, setPacientePendienteEliminar] = useState(null)
  const [deletingIds, setDeletingIds] = useState([])
  const [citaPendienteCancelar, setCitaPendienteCancelar] = useState(null)
  const [citaEditando, setCitaEditando] = useState(null)
  const [seccionActiva, setSeccionActiva] = useState("inicio")
  const [mostrandoNuevoPaciente, setMostrandoNuevoPaciente] = useState(false)
  const [mostrandoNuevaCita, setMostrandoNuevaCita] = useState(false)

  // Estado de citas agendadas, inicializado desde localStorage igual que pacientes
  const [citas, setCitas] = useState(() => {
    try {
      const stored = localStorage.getItem('citas')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Error al cargar citas desde localStorage:", error)
      return []
    }
  })

  // sincronizar el estado en localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pacientes', JSON.stringify(pacientes))
    } catch (error) {
      console.error("Error al guardar pacientes en localStorage:", error)
    }
  }, [pacientes])

  // Sincronizar el array de citas con localStorage cada vez que cambia
  useEffect(() => {
    try {
      localStorage.setItem('citas', JSON.stringify(citas))
    } catch (error) {
      console.error("Error al guardar citas en localStorage:", error)
    }
  }, [citas])

  const handleGuardarEdicion = (pacienteActualizado) => {
    setPacientes((prevPacientes) => prevPacientes.map((paciente) => (
      paciente.id === pacienteActualizado.id ? pacienteActualizado : paciente
    )))
  }

  const handleSolicitarEliminarPaciente = (paciente) => {
    // Guardamos temporalmente el paciente para abrir el modal personalizado de confirmacion.
    setPacientePendienteEliminar(paciente)
  }

  const handleConfirmarEliminarPaciente = () => {
    if (!pacientePendienteEliminar) {
      return
    }

    const idPaciente = pacientePendienteEliminar.id
    const indiceOriginal = pacientes.findIndex((paciente) => paciente.id === idPaciente)
    const pacienteEliminado = pacientePendienteEliminar

    // Requisito 1: se marca la tarjeta para animar un fade out antes de eliminarla del estado.
    setDeletingIds((prevIds) => [...prevIds, idPaciente])
    setPacientePendienteEliminar(null)

    window.setTimeout(() => {
      setPacientes((prevPacientes) => prevPacientes.filter((paciente) => paciente.id !== idPaciente))
      setDeletingIds((prevIds) => prevIds.filter((id) => id !== idPaciente))

      setPacienteEditando((prevPaciente) => {
        if (prevPaciente?.id === idPaciente) {
          return null
        }

        return prevPaciente
      })

      // Requisito 3: el toast se crea con una accion "Deshacer" y se mantiene visible 5 segundos.
      const toastId = `undo-delete-${idPaciente}-${Date.now()}`

      toast(
        ({ closeToast }) => (
          <div className="flex items-center gap-3">
            <p className="text-sm text-slate-700">Paciente <span className="font-semibold">{pacienteEliminado.nombre}</span> eliminado.</p>
            <button
              type="button"
              onClick={() => {
                // Si el usuario pulsa "Deshacer", reinsertamos el paciente en su posicion original.
                setPacientes((prevPacientes) => {
                  const yaExiste = prevPacientes.some((paciente) => paciente.id === idPaciente)

                  if (yaExiste) {
                    return prevPacientes
                  }

                  const siguienteLista = [...prevPacientes]
                  const indiceSeguro = indiceOriginal < 0 ? prevPacientes.length : Math.min(indiceOriginal, prevPacientes.length)
                  siguienteLista.splice(indiceSeguro, 0, pacienteEliminado)
                  return siguienteLista
                })

                closeToast()
                toast.success(`Paciente ${pacienteEliminado.nombre} restaurado`, { autoClose: 2000 })
              }}
              className="rounded-full border border-teal-300 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
            >
              Deshacer
            </button>
          </div>
        ),
        {
          toastId,
          // Este temporizador define la ventana de tiempo para poder deshacer la eliminacion.
          autoClose: 5000,
          closeOnClick: false,
          closeButton: true,
        }
      )
    }, 320)
  }

  // Agregar una nueva cita al estado global
  const handleAgregarCita = (cita) => {
    setCitas((prevCitas) => [...prevCitas, cita])
  }

  // Solicitar cancelacion de cita: abrimos modal de confirmacion personalizado.
  const handleSolicitarCancelarCita = (cita) => {
    setCitaPendienteCancelar(cita)
  }

  const handleConfirmarCancelarCita = () => {
    if (!citaPendienteCancelar) return

    const idCita = citaPendienteCancelar.id
    const paciente = pacientes.find((p) => p.id === citaPendienteCancelar.pacienteId)

    setCitas((prevCitas) => prevCitas.filter((cita) => cita.id !== idCita))
    setCitaPendienteCancelar(null)

    toast.info(`Cita de ${paciente?.nombre ?? 'paciente'} cancelada`, { autoClose: 2500 })
  }

  // Iniciar edicion de una cita existente, reutilizando un modal similar al de paciente.
  const handleIniciarEditarCita = (cita) => {
    setCitaEditando(cita)
  }

  const handleGuardarCitaEditada = (citaActualizada) => {
    setCitas((prevCitas) => prevCitas.map((cita) => (cita.id === citaActualizada.id ? citaActualizada : cita)))
    setCitaEditando(null)
  }

  return(
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(13,148,136,0.10),transparent_28%),linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] text-slate-900">
      <ToastContainer
        position="top-right"
        autoClose={2500}
        theme="light"
      />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <Header />
        <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(13rem,0.6fr)_minmax(32rem,1.4fr)] lg:items-start xl:gap-8">
          {/* Menú lateral para navegar entre las funcionalidades principales */}
          <aside className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-[0_20px_50px_-32px_rgba(15,23,42,0.65)] backdrop-blur-sm">
            <h2 className="mb-4 text-left text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Navegacion</h2>

            <nav className="space-y-2">
              {[
                { id: "inicio", label: "Resumen", description: "Vision general" },
                { id: "pacientes", label: "Pacientes", description: "Registrar y gestionar" },
                { id: "citas", label: "Citas", description: "Agendar y revisar" },
                { id: "reportes", label: "Reportes", description: "Exportar a PDF" },
              ].map((item) => {
                const activo = seccionActiva === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSeccionActiva(item.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition duration-200 ${
                      activo
                        ? "border-teal-500 bg-teal-50 text-teal-800 shadow-[0_12px_30px_-20px_rgba(13,148,136,0.7)]"
                        : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/60 hover:text-teal-800"
                    }`}
                  >
                    <span>
                      <span className="block font-semibold">{item.label}</span>
                      <span className="block text-xs text-slate-500">{item.description}</span>
                    </span>
                    <span
                      className={`ml-3 h-2 w-2 rounded-full ${activo ? "bg-teal-500" : "bg-slate-200"}`}
                    />
                  </button>
                )
              })}
            </nav>
          </aside>

          <div>
            {seccionActiva === "inicio" && (
              <section className="rounded-[2.25rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.55)] backdrop-blur-sm sm:p-7">
                <h2 className="text-left font-[Manrope] text-2xl font-extrabold tracking-[-0.03em] text-slate-900 sm:text-3xl">
                  Bienvenida al panel
                </h2>
                <p className="mt-3 text-sm text-slate-600 sm:text-base">
                  Desde aqui puedes registrar pacientes, agendar citas, revisar el calendario y generar reportes en PDF para tu veterinaria.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-teal-100 bg-teal-50/80 px-4 py-4 text-teal-900">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]">Pacientes registrados</p>
                    <p className="mt-1 text-3xl font-extrabold">{pacientes.length}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 bg-slate-50/80 px-4 py-4 text-slate-900">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em]">Citas activas</p>
                    <p className="mt-1 text-3xl font-extrabold">{citas.length}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setSeccionActiva("pacientes")}
                    className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_24px_-12px_rgba(13,148,136,0.8)] transition hover:bg-teal-700"
                  >
                    Ir a Pacientes
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeccionActiva("citas")}
                    className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
                  >
                    Ver Citas
                  </button>
                </div>
              </section>
            )}

            {seccionActiva === "pacientes" && (
              <section className="space-y-8">
                <ListadoPacientes
                  pacientes={pacientes}
                  onEditarPaciente={setPacienteEditando}
                  onSolicitarEliminarPaciente={handleSolicitarEliminarPaciente}
                  deletingIds={deletingIds}
                  onAgregarPaciente={() => setMostrandoNuevoPaciente(true)}
                />
              </section>
            )}

            {seccionActiva === "citas" && (
              <section className="space-y-8">
                <CalendarioCitas
                  citas={citas}
                  pacientes={pacientes}
                  onSolicitarCancelarCita={handleSolicitarCancelarCita}
                  onEditarCita={handleIniciarEditarCita}
                  onAgregarCita={() => setMostrandoNuevaCita(true)}
                />
              </section>
            )}

            {seccionActiva === "reportes" && (
              <section className="rounded-[2.25rem] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.55)] backdrop-blur-sm sm:p-7">
                <h2 className="text-left font-[Manrope] text-2xl font-extrabold tracking-[-0.03em] text-slate-900 sm:text-3xl">
                  Reportes en PDF
                </h2>
                <p className="mt-3 text-sm text-slate-600 sm:text-base">
                  Genera reportes en PDF de pacientes y del calendario de citas para compartir o respaldar la informacion.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => generarReportePacientesPDF(pacientes)}
                    className="flex h-full flex-col items-start justify-between rounded-3xl border border-teal-200 bg-teal-50 px-4 py-4 text-left text-sm font-semibold text-teal-800 transition hover:border-teal-400 hover:bg-teal-100"
                  >
                    <span>Reporte de Pacientes</span>
                    <span className="mt-1 text-xs font-normal text-teal-900/80">Incluye datos de contacto y sintomas.</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => generarReporteCitasPDF(citas, pacientes)}
                    className="flex h-full flex-col items-start justify-between rounded-3xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50"
                  >
                    <span>Reporte de Citas</span>
                    <span className="mt-1 text-xs font-normal text-slate-700/80">Incluye agenda con fecha, hora y motivo.</span>
                  </button>
                </div>
              </section>
            )}
          </div>
        </section>
      </main>

      {pacienteEditando && (
        <ModalEditarPaciente
          paciente={pacienteEditando}
          onClose={() => setPacienteEditando(null)}
          onSave={handleGuardarEdicion}
        />
      )}

      {pacientePendienteEliminar && (
        // Requisito 2: se muestra un modal propio de React en lugar de usar window.confirm.
        <ModalConfirmarEliminacion
          paciente={pacientePendienteEliminar}
          onClose={() => setPacientePendienteEliminar(null)}
          onConfirm={handleConfirmarEliminarPaciente}
        />
      )}

      {mostrandoNuevoPaciente && (
        <ModalEditarPaciente
          paciente={null}
          onClose={() => setMostrandoNuevoPaciente(false)}
          onSave={handleGuardarEdicion}
        />
      )}

      {citaPendienteCancelar && (
        <ModalConfirmarCancelarCita
          cita={citaPendienteCancelar}
          pacienteNombre={
            pacientes.find((p) => p.id === citaPendienteCancelar.pacienteId)?.nombre ?? 'Paciente eliminado'
          }
          onClose={() => setCitaPendienteCancelar(null)}
          onConfirm={handleConfirmarCancelarCita}
        />
      )}

      {citaEditando && (
        <ModalEditarCita
          cita={citaEditando}
          pacienteNombre={
            pacientes.find((p) => p.id === citaEditando.pacienteId)?.nombre ?? 'Paciente eliminado'
          }
          onClose={() => setCitaEditando(null)}
          onSave={handleGuardarCitaEditada}
        />
      )}

      {mostrandoNuevaCita && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4 py-6 backdrop-blur-sm sm:px-6">
          <div className="relative w-full max-w-xl rounded-[2rem] border border-white/70 bg-white/95 p-4 shadow-[0_28px_80px_-40px_rgba(15,23,42,0.65)] sm:p-6">
            <button
              type="button"
              onClick={() => setMostrandoNuevaCita(false)}
              className="absolute right-4 top-4 rounded-full border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-700"
            >
              Cerrar
            </button>

            <AgendarCita
              pacientes={pacientes}
              onAgregarCita={(cita) => {
                handleAgregarCita(cita)
                setMostrandoNuevaCita(false)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default App