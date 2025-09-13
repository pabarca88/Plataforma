import { prisma } from "../../../../lib/prisma";
import { PDFDocument, StandardFonts } from "pdf-lib";

export async function GET() {
  try {
    const answers = await prisma.answer.findMany({
      include: { user: true, question: true },
    });

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = height - 50;

    // Título
    page.drawText("Respuestas de usuarios", { x: 50, y, font, size: 16 });
    y -= 30;

    // Contenido
    answers.forEach((a) => {
      page.drawText(`Usuario: ${a.user.firstName} ${a.user.lastName}`, { x: 50, y, font, size: 12 });
      y -= 18;
      page.drawText(`Email: ${a.user.email}`, { x: 50, y, font, size: 12 });
      y -= 18;
      page.drawText(`Pregunta: ${a.question.text}`, { x: 50, y, font, size: 12 });
      y -= 18;
      page.drawText(`Respuesta: ${a.text}`, { x: 50, y, font, size: 12 });
      y -= 25;

      if (y < 50) {
        y = height - 50;
        pdfDoc.addPage();
      }
    });

    const pdfBytes = await pdfDoc.save();

    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="respuestas.pdf"',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
