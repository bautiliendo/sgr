import { NextResponse } from "next/server";
import { Resend } from "resend";
import { GithubAccessTokenEmail } from "@/components/email-template";

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: "lucasliendo@sgr.renovarte.com.ar",
      to: ["juanbautistaliendo1@gmail.com"],
      subject: "Hemos recibido su solicitud de SGR",
      react: GithubAccessTokenEmail({ username: "Juan Perez" }),
    });

    return NextResponse.json({ data, error });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
