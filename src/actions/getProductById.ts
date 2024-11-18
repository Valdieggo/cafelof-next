"use server";

export async function getProductById( productId: number){
    const response = await fetch(`http://localhost:3000/api/product/${productId}`, {
        next: { revalidate: 10 }, // Opcional: para revalidar caché cada 10 segundos
      });
    
      if (!response.ok) {
        console.error('Error al obtener productos:', response.statusText);
        throw new Error('Failed to fetch products');
      }
    
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      return jsonResponse.data || [];
}