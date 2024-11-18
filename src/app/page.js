import PhotoCarousel from "../components/layout/Carousel";
import ProductCategories from "../components/products/ProductCategories";

export default async function Page() {
  return (
    <div>
      <PhotoCarousel />
      <ProductCategories />
    </div>
  );
}
