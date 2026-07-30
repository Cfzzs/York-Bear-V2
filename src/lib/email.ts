import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const BRAND_NAME = "STREETWEAR STORE";

export function buildEventEmailTemplate(event: {
  title: string;
  description: string;
  date: Date;
  image: string;
  link?: string;
}) {
  const dateStr = new Date(event.date).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 0; background: #0a0a0a; font-family: 'Inter', Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background: #111; }
        .header { background: #ff0040; padding: 30px; text-align: center; }
        .header h1 { color: #fff; font-size: 28px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: 2px; }
        .banner img { width: 100%; height: auto; display: block; }
        .content { padding: 40px 30px; color: #fafafa; }
        .content h2 { font-size: 24px; color: #ff0040; margin: 0 0 16px; text-transform: uppercase; }
        .content p { font-size: 16px; line-height: 1.6; color: #ccc; margin: 0 0 24px; }
        .date { display: inline-block; background: #ff0040; color: #fff; padding: 12px 24px; font-weight: 700; font-size: 18px; border-radius: 4px; margin-bottom: 24px; }
        .btn { display: inline-block; background: #00ff88; color: #0a0a0a; padding: 14px 32px; text-decoration: none; font-weight: 700; font-size: 16px; text-transform: uppercase; letter-spacing: 1px; border-radius: 4px; }
        .footer { background: #0a0a0a; padding: 24px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${BRAND_NAME}</h1>
        </div>
        ${
          event.image
            ? `<div class="banner"><img src="${event.image}" alt="${event.title}" /></div>`
            : ""
        }
        <div class="content">
          <h2>${event.title}</h2>
          <p>${event.description}</p>
          <div class="date">📅 ${dateStr}</div>
          <br/>
          ${
            event.link
              ? `<a href="${event.link}" class="btn">Garanta seu lugar</a>`
              : ""
          }
        </div>
        <div class="footer">
          <p>${BRAND_NAME} — Todos os direitos reservados</p>
          <p>Se você não deseja mais receber e-mails, <a href="#" style="color:#ff0040;">descadastre-se</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function sendEventNotification(
  to: string,
  event: {
    title: string;
    description: string;
    date: Date;
    image: string;
    link?: string;
  }
) {
  try {
    await transporter.sendMail({
      from: `"${BRAND_NAME}" <${process.env.EMAIL_FROM}>`,
      to,
      subject: `🔥 ${event.title} — ${BRAND_NAME}`,
      html: buildEventEmailTemplate(event),
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
