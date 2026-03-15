import Paciente from './Paciente'
import { generarReportePacientesPDF } from '../utils/generarReportePacientesPDF'

const ListadoPacientes = ({pacientes, onEditarPaciente, onSolicitarEliminarPaciente, deletingIds, onAgregarPaciente}) =>{
    const handleGenerarReportePDF = () => {
        // Centralizamos la exportacion para generar el PDF con datos o con fila informativa si la lista esta vacia.
        generarReportePacientesPDF(pacientes)
    }

    return (
        <section className="rounded-4xl border border-white/70 bg-white/75 p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.35)] backdrop-blur-sm lg:max-h-184 lg:overflow-y-auto lg:pr-4">
            <header className="mb-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="text-center sm:text-left">
                    <h2 className="font-[Manrope] text-3xl font-extrabold tracking-[-0.03em] text-slate-900">Listado Pacientes</h2>
                    <p className="mt-2 text-sm text-slate-600 sm:text-base">
                        Administra tus&nbsp;
                        <span className="font-bold text-teal-700">Pacientes y Citas</span>
                    </p>
                </div>

                <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-stretch">
                    <button
                        type="button"
                        onClick={onAgregarPaciente}
                        className="w-full rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-[0_18px_30px_-18px_rgba(15,23,42,0.8)] transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-[0_24px_35px_-20px_rgba(13,148,136,0.65)] sm:w-auto"
                    >
                        Agregar Paciente
                    </button>

                    <button
                        type='button'
                        onClick={handleGenerarReportePDF}
                        className='w-full rounded-full border border-teal-300 bg-teal-50 px-5 py-2 text-sm font-semibold text-teal-700 transition duration-200 hover:border-teal-400 hover:bg-teal-100 sm:w-auto'
                    >
                        Generar reporte PDF
                    </button>
                </div>
            </header>

            <div className="space-y-4">

                {pacientes.length === 0 ? (
                    <p className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-2xl text-slate-500">No hay pacientes aún</p>
                )
                : 
                    pacientes.map((paciente,index) => (
                        <Paciente
                            key={index}
                            paciente={paciente}
                            onEditar={onEditarPaciente}
                            onSolicitarEliminar={onSolicitarEliminarPaciente}
                            isDeleting={deletingIds.includes(paciente.id)}
                        />
                    ))
                    
            }
            </div>
        </section>
    )
}

export default ListadoPacientes