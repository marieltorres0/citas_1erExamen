import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

const FORMATO_FECHA_REPORTE = {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}

export const generarReportePacientesPDF = (pacientes = []) => {
  const doc = new jsPDF()
  const fechaGeneracion = new Date().toLocaleString("es-ES", FORMATO_FECHA_REPORTE)

  // Encabezado institucional del reporte (reemplaza un logo cuando no hay imagen oficial).
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.text("Veterinaria San Patitas", 14, 18)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(11)
  doc.text(`Reporte de pacientes`, 14, 27)
  doc.text(`Fecha de generacion: ${fechaGeneracion}`, 14, 34)

  const head = [["Nombre", "Propietario", "Email", "Fecha Alta", "Sintomas"]]

  // Si no existen pacientes, se agrega una fila informativa para mantener una salida valida y clara.
  const body = pacientes.length > 0
    ? pacientes.map((paciente) => [
      paciente.nombre,
      paciente.propietario,
      paciente.email,
      paciente.fecha,
      paciente.sintomas,
    ])
    : [["Sin registros", "-", "-", "-", "No hay pacientes registrados"]]

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
  doc.save(`reporte-pacientes-${fechaNombreArchivo}.pdf`)
}
