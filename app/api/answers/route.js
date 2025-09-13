import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { token, answers } = await req.json();

    if (!token || !answers || !Array.isArray(answers)) {
      return new Response(JSON.stringify({ error: "Datos incompletos" }), { status: 400 });
    }

    // Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, "secreto-super-seguro");
    } catch {
      return new Response(JSON.stringify({ error: "Token inválido" }), { status: 401 });
    }

    // Guardar cada respuesta
    const createdAnswers = [];
    for (const ans of answers) {
      const answer = await prisma.answer.create({
        data: {
          text: ans.text,
          questionId: ans.questionId,
          userId: decoded.id,
        },
      });
      createdAnswers.push(answer);
    }

    return new Response(JSON.stringify({ answers: createdAnswers }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
