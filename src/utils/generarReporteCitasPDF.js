import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

const FORMATO_FECHA_REPORTE = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}

export const generarReporteCitasPDF = (citas = [], pacientes = []) => {
  const doc = new jsPDF()
  const fechaGeneracion = new Date().toLocaleString("es-ES", FORMATO_FECHA_REPORTE)

  // Encabezado institucional del reporte de citas (mismo estilo que el de pacientes).
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("Veterinaria San Patitas", 14, 18)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.text(`Calendario de citas`, 14, 27)
  doc.text(`Fecha de generacion: ${fechaGeneracion}`, 14, 34)

  const head = [["Paciente", "Fecha", "Hora", "Duracion", "Motivo"]]

  const obtenerNombrePaciente = (pacienteId) => {
    const paciente = pacientes.find((p) => p.id === pacienteId)
    return paciente?.nombre ?? "Paciente eliminado"
  }

  // Si no existen citas, se agrega una fila informativa para mantener una salida valida y clara.
  const body = citas.length > 0
    ? citas
        .slice()
        .sort((a, b) => {
          if (a.fecha !== b.fecha) return a.fecha.localeCompare(b.fecha)
          return a.hora.localeCompare(b.hora)
        })
        .map((cita) => [
          obtenerNombrePaciente(cita.pacienteId),
          cita.fecha,
          cita.hora,
          cita.duracion,
          cita.motivo,
        ])
    : [["Sin citas", "-", "-", "-", "No hay citas agendadas"]]

  autoTable(doc, {
    startY: 42,
    head,
    body,
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [13, 148, 136],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250],
    },
  })

  const fechaNombreArchivo = new Date().toISOString().slice(0, 10)
  doc.save(`reporte-citas-${fechaNombreArchivo}.pdf`)
}
