import { z } from 'zod'

export const pacienteSchema = z.object({
  nombre: z
    .string()
    .min(3, 'El nombre debe tener al menos 3 caracteres'),

  propietario: z
    .string()
    .min(5, 'El propietario debe tener al menos 5 caracteres'),

  email: z
    .string()
    .email('El email no es válido'),

  fecha: z
    .string()
    .refine((value) => !Number.isNaN(Date.parse(value)), {
      message: 'La fecha no es válida',
    })
    .refine((value) => new Date(value) <= new Date(), {
      message: 'La fecha no puede ser futura',
    }),

  sintomas: z
    .string()
    .min(10, 'Describe los síntomas con al menos 10 caracteres'),
})