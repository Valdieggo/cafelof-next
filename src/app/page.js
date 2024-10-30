import PhotoCarousel from "../components/layout/Carousel";
import ProductCategories from "../components/products/ProductCategories";
import Products from "../components/products/Products";

export default async function Page() {
  return (
    <div>
      <PhotoCarousel />
      <ProductCategories />
      <Products />
    </div>
  );
}
