export default function CategoryFilter({ categories, selectedCategories, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category, index) => (
        <button
          key={index}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-md text-center ${
            selectedCategories.includes(category)
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
