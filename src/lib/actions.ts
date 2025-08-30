"use server"

import { z } from "zod";
import { Resend } from "resend";
import { GithubAccessTokenEmail } from "@/components/email-template";
import { AdminNotificationEmail } from "@/components/admin-notification-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function enviarFormulario(formData: FormData) {
  try {
    // 1. Extraer datos básicos del FormData
    const datosBasicos = {
      personeria: formData.get('personeria') as string,
      tipoEmpresa: formData.get('tipoEmpresa') as string,
      nombreRazonSocial: formData.get('nombreRazonSocial') as string,
      cuitCuil: formData.get('cuitCuil') as string,
      nombre: formData.get('nombre') as string,
      apellido: formData.get('apellido') as string,
      cuitCuilContacto: formData.get('cuitCuilContacto') as string,
      email: formData.get('email') as string,
      relacionCuenta: formData.get('relacionCuenta') as string,
      telefono: formData.get('telefono') as string,
    };

    // 2. Extraer accionistas (si es jurídica)
    const accionistasData = formData.get('accionistas');
    const accionistas = accionistasData ? JSON.parse(accionistasData as string) : [];

    
    // 3. Validación mínima pero crítica
    if (!datosBasicos.email || !datosBasicos.personeria) {
      return { success: false, error: "Faltan datos obligatorios" };
    }

    const resultadoEmail = z.string().email().safeParse(datosBasicos.email);
    if (!resultadoEmail.success) {
      return { success: false, error: "Email inválido" };
    }
    

    // 4. Procesar archivos adjuntos
    const archivosAdjuntos: { filename: string; content: Buffer }[] = [];
    
    // Obtener todos los archivos del FormData
    for (const [, value] of formData.entries()) {
      if (value instanceof File && value.size > 0) {
        const buffer = Buffer.from(await value.arrayBuffer());
        archivosAdjuntos.push({
          filename: value.name,
          content: buffer
        });
      }
    }

    // 5. Preparar datos completos para el email del admin
    const datosCompletos = {
      ...datosBasicos,
      accionistas,
      archivos: archivosAdjuntos.map(archivo => archivo.filename)
    };

    // 6. Enviar email de confirmación al usuario
    const emailUsuario = await resend.emails.send({
      from: "lucasliendocba@sgr.renovarte.com.ar",
      to: [datosBasicos.email],
      subject: "Hemos recibido su solicitud de SGR",
      react: GithubAccessTokenEmail({ 
        username: `${datosBasicos.nombre} ${datosBasicos.apellido}` 
      }),
    });
    
    console.log('Email usuario resultado:', emailUsuario);

    // 7. Enviar email con datos completos al dueño
    console.log('Enviando email al admin...');
    const emailAdmin = await resend.emails.send({
      from: "lucasliendocba@sgr.renovarte.com.ar",
      to: ["lucasliendocba@gmail.com"], //prod: lucasliendocba@gmail.com
      subject: `Nueva Solicitud SGR - ${datosBasicos.nombreRazonSocial}`,
      react: AdminNotificationEmail({ datos: datosCompletos }),
      attachments: archivosAdjuntos.map(archivo => ({
        filename: archivo.filename,
        content: archivo.content,
      })),
    });
    
    console.log('Email admin resultado:', emailAdmin);
    console.log('Proceso completado exitosamente');

    return { success: true, message: "Formulario enviado correctamente" };

  } catch (error) {
    console.error('Error en enviarFormulario:', error);
    return { 
      success: false, 
      error: "Error interno del servidor. Inténtelo nuevamente." 
    };
  }
}