import PhotoCarousel from "../components/layout/Carousel";
import ProductCategories from "../components/products/ProductCategories";
import Hero from "@/components/Hero"

//Café Lof
export default async function Page() {
  return (
    <div>
      <PhotoCarousel />
      {/* <ProductCategories /> */}
      <Hero />
    </div>
  );
}
