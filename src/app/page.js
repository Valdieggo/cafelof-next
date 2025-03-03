import PhotoCarousel from "../components/layout/Carousel";
import ProductCategories from "../components/products/ProductCategories";
import Hero from "@/components/Hero"
import ProductInfo from "@/components/ProductInfo";

export const metadata = {
  title: "Inicio | Café Lof",
  description: "Bienvenido a nuestra tienda donde podrás encontrar café de especialidad tostado artesanalmente y personalizado a tu gusto.",
};

export default async function Page() {
  return (
    <div className="container mx-auto relative">
      <PhotoCarousel />
      <Hero />
      <ProductInfo />
      {/* <ProductCategories /> */}
    </div>
  );
}
