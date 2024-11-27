"use client";

import { useState, useMemo } from "react";
import CategoryFilter from "./CategoryFilter";
import SortOptions from "./SortOptions";
import ProductList from "./ProductList";

export default function Products({ initialProducts = [], categories = [], sortOptions = [] }) {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("Orden predeterminado");

  // Lógica de filtrado y ordenación
  const filteredProducts = useMemo(() => {
    let products = [...initialProducts];

    // Filtrado por categorías
    if (selectedCategories.length > 0) {
      products = products.filter((product) =>
        selectedCategories.includes(product.product_category_id)
      );
    }

    // Ordenar productos
    if (sortOption === "Precio ascendente") {
      products.sort((a, b) => a.product_price - b.product_price);
    } else if (sortOption === "Precio descendente") {
      products.sort((a, b) => b.product_price - a.product_price);
    }

    return products;
  }, [initialProducts, selectedCategories, sortOption]);

  // Manejadores de eventos
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-6">
        {/* Filtros y opciones de orden */}
        <div className="flex flex-wrap gap-4 items-center mb-6 bg-white p-4 rounded-lg shadow-md">
          <CategoryFilter
            categories={categories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
          />
          <SortOptions
            options={sortOptions}
            selectedOption={sortOption}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Lista de productos */}
        {console.log(filteredProducts)}
        <ProductList products={filteredProducts} />
      </div>
    </div>
  );
}
