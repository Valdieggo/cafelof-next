import PhotoCarousel from "./components/layout/Carousel";

// Los Server Components pueden hacer fetch directamente en el servidor
export default async function Page() {
  const response = await fetch('http://localhost:3000/api/prueba', {
    cache: 'no-store', // Si deseas evitar que se cachee la solicitud
  });

  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();

  return (
    <div>
      <PhotoCarousel />
      <div>
        <h1>Países que empiezan con la letra C</h1>
        <ul>
          {data.data.map((country) => (
            <li key={country.id}>{country.country_name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
