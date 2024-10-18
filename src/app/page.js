import PhotoCarousel from "./components/layout/Carousel";
import ProductCategories from "../app/components/ProductCategories";

// Los Server Components pueden hacer fetch directamente en el servidor
export default async function Page() {
  const response = await fetch('http://localhost:3000/api/prueba', {
    cache: 'no-store', // Si deseas evitar que se cachee la solicitud
  });

  if (!response.ok) {
    console.log(response);
    throw new Error('Failed to fetch data');
  }

  const data = await response.json();
  console.log("data available: ", data);

  return (
    <div>
      <PhotoCarousel />
      <ProductCategories />

      <div>
        <h1>Países que empiezan con la letra C</h1>
        <ul>
          {data.data.map((country, index) => (
            <li key={index}>ID_DB: {country.country_id}/Pais: {country.country_name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
