"use client";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="p-6">Cargando...</p>;
  }

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

  const user = session.user;

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">
        Bienvenido {user?.name || user?.email}
      </h1>

      <div className="bg-gray-100 p-4 rounded shadow space-y-2 text-black">
        <p>
          <strong>Email:</strong> {user?.email}
        </p>
        {user?.name && (
          <p>
            <strong>Nombre:</strong> {user.name}
          </p>
        )}
        {user?.id && (
          <p>
            <strong>ID:</strong> {user.id}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <a
          href="/api/export/excel"
          target="_blank"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Exportar Excel
        </a>
        <a
          href="/api/export/pdf"
          target="_blank"
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Exportar PDF
        </a>
      </div>

      <button
        onClick={() => signOut()}
        className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
      >
        Cerrar sesión
      </button>
    </div>
  );
}
