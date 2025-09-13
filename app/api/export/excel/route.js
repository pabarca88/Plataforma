import { prisma } from "../../../../lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    // Traer todas las respuestas con usuario y pregunta
    const answers = await prisma.answer.findMany({
      include: { user: true, question: true },
    });

    // Transformar los datos a un arreglo de objetos plano
    const data = answers.map(a => ({
      Usuario: `${a.user.firstName} ${a.user.lastName}`,
      Email: a.user.email,
      Pregunta: a.question.text,
      Respuesta: a.text,
    }));

    // Crear libro de Excel
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Respuestas");

    // Convertir a buffer
    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new Response(buf, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": 'attachment; filename="respuestas.xlsx"',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
