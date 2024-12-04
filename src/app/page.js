import PhotoCarousel from "../components/layout/Carousel";
import ProductCategories from "../components/products/ProductCategories";
import Hero from "@/components/Hero"

export default async function Page() {
  return (
    <div>
      <PhotoCarousel />
      {/* <ProductCategories /> */}
      <Hero />
    </div>
  );
}
