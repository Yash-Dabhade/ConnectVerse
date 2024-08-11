import { Resend } from "resend";

export const sendMail = async (to, subject, body) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: [to],
    subject: subject,
    html: "<p>" + body + "</p>",
  });

  if (error) return false;
  return true;
};
