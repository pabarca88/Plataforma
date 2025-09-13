"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) router.push("/login");
    else setToken(t);

    // Traer preguntas
    fetch("/api/get-questions") // Creamos endpoint para obtener preguntas
      .then(res => res.json())
      .then(data => setQuestions(data.questions));
  }, [router]);

  const handleChange = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = Object.entries(answers).map(([questionId, text]) => ({ questionId, text }));

    const res = await fetch("/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, answers: payload }),
    });

    const data = await res.json();
    if (res.ok) setMessage("Respuestas guardadas!");
    else setMessage(`Error: ${data.error}`);
  };
   if (!session) {
      return (
        <div className="p-6 max-w-md mx-auto text-center">
          <p className="mb-4">No tienes acceso, debes iniciar sesión.</p>
          <button
            onClick={() => signIn()}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Ingresar
          </button>
        </div>
      );
    }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl mb-4">Cuestionario</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {questions.map(q => (
          <div key={q.id}>
            <label className="font-semibold">{q.text}</label>
            <input
              type="text"
              value={answers[q.id] || ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Enviar respuestas
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
