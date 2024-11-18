"use client";
export default function CategoryFilter({ categories, selectedCategories, onCategoryChange }) {
    return (
      <div className="flex space-x-4">
        {categories.map((category) => (
          <label key={category} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCategories.includes(category)}
              onChange={() => onCategoryChange(category)}
            />
            <span className="text-gray-600">{category}</span>
          </label>
        ))}
      </div>
    );
  }
  