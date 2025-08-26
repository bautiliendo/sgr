import { z } from "zod";

// Esquema para el Paso 1: Datos de la Cuenta
export const step1Schema = z.object({
  personeria: z.enum(["juridica", "fisica"], { message: "Debe seleccionar una personería." }),
  tipoEmpresa: z.enum(["agricola", "no-agricola"], { message: "Debe seleccionar un tipo de empresa." }),
  nombreRazonSocial: z.string().min(5, { message: "Debe tener al menos 5 caracteres." }),
  cuitCuil: z.string().regex(/^\d{11}$/, { message: "El CUIT/CUIL debe ser un número de 11 dígitos." }),
});

// Esquema para el Paso 2: Datos del Contacto
export const step2Schema = z.object({
  nombre: z.string().min(2, { message: "Debe tener al menos 5 caracteres." }),
  apellido: z.string().min(2, { message: "Debe tener al menos 5 caracteres." }),
  cuitCuilContacto: z.string().regex(/^\d{11}$/, { message: "El CUIT/CUIL debe ser un número de 11 dígitos." }),
  email: z.string().email({ message: "El formato del email no es válido." }),
  relacionCuenta: z.string().min(1, { message: "Debe seleccionar una relación con la cuenta." }),
  telefono: z.string().min(8, { message: "El teléfono debe tener al menos 8 dígitos." }),
});


export const accionistaSchema = z.object({
  nombre: z.string().min(2, { message: "Debe tener al menos 5 caracteres." }),
  apellido: z.string().min(2, { message: "Debe tener al menos 5 caracteres." }),
  cuitCuilAccionista: z.string().regex(/^\d{11}$/, { message: "El CUIT/CUIL debe ser un número de 11 dígitos." }),
  participacion: z.coerce.number().min(1, { message: "La participación debe ser mayor a 0." }).max(100, { message: "La participación no puede ser mayor a 100." }),
});

export const step3JuridicaSchema = z.object({
  accionistas: z.array(accionistaSchema)
    .min(1, { message: "Debe agregar al menos un accionista." })
    .refine(accionistas => {
      const totalParticipacion = accionistas.reduce((acc, curr) => acc + (curr.participacion || 0), 0);
      return totalParticipacion === 100;
    }, { message: "La suma de las participaciones de los accionistas debe ser igual al 100%." })
});