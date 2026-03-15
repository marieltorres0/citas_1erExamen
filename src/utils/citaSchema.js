import { z } from 'zod'

// Valores permitidos para la duracion de la cita
const DURACIONES_VALIDAS = ['30min', '1hr', '1.5hr', '2hr']

export const citaSchema = z.object({
  // El paciente debe ser seleccionado del dropdown (id no vacío)
  pacienteId: z
    .string()
    .min(1, 'Selecciona un paciente'),

  // La fecha de la cita debe ser hoy o en el futuro (a diferencia de la fecha de alta del paciente)
  fecha: z
    .string()
    .refine((val) => !Number.isNaN(Date.parse(val)), { message: 'La fecha no es válida' })
    .refine((val) => {
      const hoy = new Date().toISOString().slice(0, 10)
      // Comparacion lexicografica de strings YYYY-MM-DD funciona correctamente
      return val >= hoy
    }, { message: 'La fecha de la cita no puede ser en el pasado' }),

  hora: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'La hora no es válida'),

  motivo: z
    .string()
    .min(5, 'El motivo debe tener al menos 5 caracteres'),

  // Validamos contra la lista de duraciones permitidas
  duracion: z
    .string()
    .min(1, 'Selecciona una duración')
    .refine((val) => DURACIONES_VALIDAS.includes(val), { message: 'Duración no válida' }),
})
