import PhotoCarousel from "./components/layout/Carousel";
import ProductCategories from "../app/components/ProductCategories";

export default async function Page() {
  return (
    <div>
      <PhotoCarousel />
      <ProductCategories />
    </div>
  );
}
