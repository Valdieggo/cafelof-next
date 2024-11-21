"use server";

export async function getUser(userId: string) {
    console.log("userid ", userId);
  const response = await fetch(`http://localhost:3000/api/auth/user/${userId}`, {
    next: { revalidate: 10 }, // Opcional: para revalidar caché cada 10 segundos
  });

  if (!response.ok) {
    console.error('Error al obtener usuario:', response.statusText);
    throw new Error('Failed to fetch user');
  }

  const jsonResponse = await response.json();
  return jsonResponse;
}
