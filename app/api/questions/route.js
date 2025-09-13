import { prisma } from "../../../lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const { text, token } = await req.json();

    if (!text || !token) {
      return new Response(JSON.stringify({ error: "Faltan datos" }), { status: 400 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, "secreto-super-seguro");
    } catch {
      return new Response(JSON.stringify({ error: "Token inválido" }), { status: 401 });
    }

    const question = await prisma.question.create({
      data: {
        text,
        userId: decoded.id,
      },
    });

    return new Response(JSON.stringify({ question }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
