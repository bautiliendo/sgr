import {
    Body,
    Button,
    Container,
    Head,
    Html,
    // Img,
    // Link,
    Preview,
    Section,
    Text,
  } from '@react-email/components';
  
  interface GithubAccessTokenEmailProps {
    username?: string;
  }
  
//   const baseUrl = "https://demo.react.email"
  
  export const GithubAccessTokenEmail = ({
    username,
  }: GithubAccessTokenEmailProps) => (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>
          He recibido su documentación de SGR
        </Preview>
        <Container style={container}>
          {/* <Img
            src={`${baseUrl}/static/github.png`}
            width="32"
            height="32"
            alt="Github"
          /> */}
  
          <Text style={title}>
            <strong>{username}</strong>, hemos recibido su solicitud.
          </Text>
  
          <Section style={section}>
            <Text style={text}>
              Hola <strong>{username}</strong>,
            </Text>
            <Text style={text}>
              Confirmamos la recepción de sus formularios y la documentación adjunta para calificar en SGR. Nuestro equipo de análisis la revisará y se pondrá en contacto con usted a la brevedad para informarle sobre los próximos pasos. Si necesitas responder este mail, hagalo a lucasliendocba@gmail.com o al +54 9 351 239-9026
            </Text>
  
            <Button style={button} 
            target="_blank"
            href="https://wa.me/5493512399026">
              Contactar por WhatsApp
            </Button>
          </Section>
          {/* <Text style={links}>
            <Link style={link}>Portal de Clientes</Link> ・{' '}
            <Link style={link}>Contactar a Soporte</Link>
          </Text> */}
  
          <Text style={footer}>
            Lucas Miguel Liendo, SGR & Leasing ・ Córdoba, Argentina   
          </Text>
        </Container>
      </Body>
    </Html>
  );
  
  GithubAccessTokenEmail.PreviewProps = {
    username: 'Juan Pérez',
  } as GithubAccessTokenEmailProps;
  
  export default GithubAccessTokenEmail;
  
  const main = {
    backgroundColor: '#ffffff',
    color: '#24292e',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
  };
  
  const container = {
    maxWidth: '480px',
    margin: '0 auto',
    padding: '20px 0 48px',
  };
  
  const title = {
    fontSize: '24px',
    lineHeight: 1.25,
  };
  
  const section = {
    padding: '24px',
    border: 'solid 1px #dedede',
    borderRadius: '5px',
    textAlign: 'center' as const,
  };
  
  const text = {
    margin: '0 0 10px 0',
    textAlign: 'left' as const,
  };
  
  const button = {
    fontSize: '14px',
    backgroundColor: '#28a745',
    color: '#fff',
    lineHeight: 1.5,
    borderRadius: '0.5em',
    padding: '12px 24px',
  };
  
//   const links = {
//     textAlign: 'center' as const,
//   };
  
//   const link = {
//     color: '#0366d6',
//     fontSize: '12px',
//   };
  
  const footer = {
    color: '#6a737d',
    fontSize: '12px',
    textAlign: 'center' as const,
    marginTop: '60px',
  };
  