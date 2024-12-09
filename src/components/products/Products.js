"use client";

import { useState, useMemo } from "react";
import CategoryFilter from "./CategoryFilter";
import SortOptions from "./SortOptions";
import ProductList from "./ProductList";

export default function Products({ initialProducts = [], categories = [], sortOptions = [] }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("Orden predeterminado");
  console.log(JSON.stringify(initialProducts, null, 2));

  const filteredProducts = useMemo(() => {
    let products = [...initialProducts];

    // Filter by selected categories
    if (selectedCategories.length > 0) {
      products = products.filter((product) =>
        selectedCategories.includes(product.product_category_id) // Filter by `product_category_id`
      );
    }

    // Sort products
    if (sortOption === "Precio ascendente") {
      products.sort((a, b) => a.product_price - b.product_price);
    } else if (sortOption === "Precio descendente") {
      products.sort((a, b) => b.product_price - a.product_price);
    }

    return products;
  }, [initialProducts, selectedCategories, sortOption]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto px-6 grid lg:grid-cols-[250px_1fr] lg:gap-6">
        {/* Sidebar for large screens */}
        <aside className="hidden lg:block bg-white p-4 rounded-lg shadow-md sticky top-8 h-fit pt-2">
          <h2 className="text-lg font-semibold mb-4">Filtros</h2>
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
          <h2 className="text-lg font-semibold mt-6 mb-4">Ordenar por</h2>
          <SortOptions
            options={sortOptions}
            selectedOption={sortOption}
            onSortChange={handleSortChange}
          />
        </aside>

        {/* Main content */}
        <main className="lg:col-start-2 lg:col-span-1">
          {/* Filters and sorting options for small screens */}
          <div className="block lg:hidden bg-white p-4 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>
            <CategoryFilter
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
            />
            <h2 className="text-lg font-semibold mt-6 mb-4">Ordenar por</h2>
            <SortOptions
              options={sortOptions}
              selectedOption={sortOption}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Product List */}
          {filteredProducts.length ? (
            <ProductList products={filteredProducts} />
          ) : (
            <p className="flex justify-center">No hay productos para esta categoría actualmente</p>
          )}
        </main>
      </div>
    </div>
  );
}
