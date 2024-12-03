import { Button } from "@/components/ui/button";

export default function CategoryFilter({ categories, selectedCategories, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category, index) => (
        <Button
          key={index}
          onClick={() => onCategoryChange(category)}
          variant={selectedCategories.includes(category) ? "default" : "outline"}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}
