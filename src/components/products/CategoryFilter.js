import { Button } from "@/components/ui/button";

export default function CategoryFilter({ categories, selectedCategories, onCategoryChange }) {
  return (
    <div>
      {/* Heading for clarity */}
      <h2 className="text-lg font-semibold mb-2">Categorias</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.product_category_id}
            onClick={() => onCategoryChange(category.product_category_id)}
            variant={selectedCategories.includes(category.product_category_id) ? "category" : "outline"} // Use `category` variant
          >
            {category.product_category_name}
          </Button>
        ))}
      </div>
    </div>
  );
}
