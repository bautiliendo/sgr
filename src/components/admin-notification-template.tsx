import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';

interface DatosFormulario {
  personeria: string;
  tipoEmpresa: string;
  nombreRazonSocial: string;
  cuitCuil: string;
  nombre: string;
  apellido: string;
  cuitCuilContacto: string;
  email: string;
  relacionCuenta: string;
  telefono: string;
  accionistas?: Array<{
    nombre: string;
    apellido: string;
    email: string;
    cuitCuilAccionista: string;
    participacion: number;
  }>;
  archivos: string[];
}

interface AdminNotificationEmailProps {
  datos: DatosFormulario;
}

export const AdminNotificationEmail = ({
  datos,
}: AdminNotificationEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Preview>
        Nueva solicitud SGR de {datos.nombreRazonSocial}
      </Preview>
      <Container style={container}>
        
        <Text style={title}>
          <strong>NUEVA SOLICITUD SGR</strong>
        </Text>

        <Hr style={hr} />

        <Section style={section}>
          <Text style={sectionTitle}>DATOS DE LA EMPRESA</Text>
          <Text style={dataText}>
            <strong>Personería:</strong> {datos.personeria === 'juridica' ? 'Jurídica' : 'Física'}
          </Text>
          <Text style={dataText}>
            <strong>Tipo de Empresa:</strong> {datos.tipoEmpresa === 'agricola' ? 'Agrícola' : 'No Agrícola'}
          </Text>
          <Text style={dataText}>
            <strong>Razón Social:</strong> {datos.nombreRazonSocial}
          </Text>
          <Text style={dataText}>
            <strong>CUIT/CUIL:</strong> {datos.cuitCuil}
          </Text>
        </Section>

        <Section style={section}>
          <Text style={sectionTitle}>DATOS DE CONTACTO</Text>
          <Text style={dataText}>
            <strong>Nombre:</strong> {datos.nombre} {datos.apellido}
          </Text>
          <Text style={dataText}>
            <strong>Email:</strong> {datos.email}
          </Text>
          <Text style={dataText}>
            <strong>Teléfono:</strong> {datos.telefono}
          </Text>
          <Text style={dataText}>
            <strong>CUIT/CUIL del Contacto:</strong> {datos.cuitCuilContacto}
          </Text>
          <Text style={dataText}>
            <strong>Relación con la Cuenta:</strong> {datos.relacionCuenta}
          </Text>
        </Section>

        {datos.accionistas && datos.accionistas.length > 0 && (
          <Section style={section}>
            <Text style={sectionTitle}>ACCIONISTAS</Text>
            {datos.accionistas.map((accionista, index) => (
              <Text key={index} style={dataText}>
                <strong>• {accionista.nombre} {accionista.apellido}</strong><br />
                &nbsp;&nbsp;CUIT: {accionista.cuitCuilAccionista}<br />
                &nbsp;&nbsp;Email: {accionista.email}<br />
                &nbsp;&nbsp;Participación: {accionista.participacion}%
              </Text>
            ))}
          </Section>
        )}

        <Section style={section}>
          <Text style={sectionTitle}>📎 ARCHIVOS ADJUNTOS</Text>
          {datos.archivos.length > 0 ? (
            datos.archivos.map((archivo, index) => (
              <Text key={index} style={dataText}>
                • {archivo}
              </Text>
            ))
          ) : (
            <Text style={dataText}>Sin archivos adjuntos</Text>
          )}
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          Solicitud recibida automáticamente desde el formulario SGR
        </Text>
      </Container>
    </Body>
  </Html>
);

AdminNotificationEmail.PreviewProps = {
  datos: {
    personeria: 'juridica',
    tipoEmpresa: 'agricola',
    nombreRazonSocial: 'Empresa Ejemplo S.A.',
    cuitCuil: '12345678901',
    nombre: 'Juan',
    apellido: 'Pérez',
    cuitCuilContacto: '12345678901',
    email: 'juan@ejemplo.com',
    relacionCuenta: 'Gerente General',
    telefono: '+54 9 351 123-4567',
    accionistas: [
      {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@ejemplo.com',
        cuitCuilAccionista: '12345678901',
        participacion: 60
      },
      {
        nombre: 'María',
        apellido: 'García',
        email: 'maria@ejemplo.com',
        cuitCuilAccionista: '10987654321',
        participacion: 40
      }
    ],
    archivos: ['certificado-pyme.pdf', 'formulario-alta.xlsx', 'dni-juan.pdf']
  },
} as AdminNotificationEmailProps;

export default AdminNotificationEmail;

const main = {
  backgroundColor: '#f6f9fc',
  color: '#333',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif',
};

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const title = {
  fontSize: '24px',
  lineHeight: 1.25,
  textAlign: 'center' as const,
  color: '#1a73e8',
  marginBottom: '20px',
};

const section = {
  margin: '20px 0',
  padding: '15px',
  backgroundColor: '#f8f9fa',
  borderRadius: '6px',
  border: '1px solid #e1e5e9',
};

const sectionTitle = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#1a73e8',
  marginBottom: '10px',
  margin: '0 0 10px 0',
};

const dataText = {
  fontSize: '14px',
  lineHeight: 1.5,
  margin: '5px 0',
  color: '#444',
};

const hr = {
  border: 'none',
  borderTop: '2px solid #e1e5e9',
  margin: '30px 0',
};

const footer = {
  color: '#6a737d',
  fontSize: '12px',
  textAlign: 'center' as const,
  marginTop: '20px',
  fontStyle: 'italic',
};
