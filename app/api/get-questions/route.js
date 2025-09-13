import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const questions = await prisma.question.findMany();
    return new Response(JSON.stringify({ questions }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
