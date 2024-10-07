"use client";

import { useState } from 'react';
import ProductList from './ProductList';
import CategoryFilter from './CategoryFilter';
import SortOptions from './SortOptions';
import mug from '../../mug.jpg';
import cafeDeGrano from '../../cafe-de-grano.jpg';

export default function MainPage() {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState('Orden predeterminado');
  
  const products = [
    {
      id: 1,
      title: 'Mug Cilindro 250 Ml.',
      category: 'mugs y vasos',
      size: '250 ml',
      price: '$13.500',
      image: mug,
    },
    {
      id: 2,
      title: 'Café De Grano',
      category: 'café de grano',
      size: '250 grs.',
      price: '$12.000',
      image: cafeDeGrano,
    },
  ];
  

  const categories = ['mugs y vasos', 'Tote bags'];
  const sortOptions = ['Orden predeterminado', 'Precio ascendente', 'Precio descendente'];

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex justify-between items-center mb-6">
        <CategoryFilter
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
        />
        <SortOptions options={sortOptions} selectedOption={sortOption} onSortChange={handleSortChange} />
      </div>
      <ProductList products={products} />
    </div>
  );
}
