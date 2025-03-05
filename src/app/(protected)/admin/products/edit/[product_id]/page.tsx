"use client";
import { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton'; // Importa el componente Skeleton

export default function EditProductPage({ params }: { params: any }) {
  const [productData, setProductData] = useState({
    product_id: '',
    product_name: '',
    product_price: '',
    product_image_url: '',
    product_category_id: '',
    product_slug: '',
    product_description: '',
    attributes: [], // Para manejar atributos dinámicos
  });
  const [categories, setCategories] = useState([]); // Estado para almacenar las categorías
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga
  const productId = params.product_id; // Obtener el ID del producto de las props

  // Obtener las categorías al cargar la página
  useEffect(() => {
    // Fetch categories
    fetch('/api/product/category')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setCategories(data.data); // Almacenar las categorías en el estado
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  // Obtener los datos del producto cuando se carga la página
  useEffect(() => {
    if (productId) {
      // Fetch product data by id
      fetch(`/api/product/${productId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200) {
            // Establecer los datos del producto en el estado
            setProductData({
              product_id: data.data.product_id,
              product_name: data.data.product_name,
              product_price: data.data.product_price,
              product_image_url: data.data.product_image_url || '',
              product_category_id: data.data.product_category_id,
              product_slug: data.data.product_slug,
              product_description: data.data.product_description || '',
              attributes: data.data.attributes || [], // Manejar atributos dinámicos
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching product data:', error);
        })
        .finally(() => {
          setIsLoading(false); // Finalizar la carga
        });
    } else {
      console.error("No product ID found");
      setIsLoading(false); // Finalizar la carga incluso si no hay ID
    }
  }, [productId]);

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAttributeChange = (index, key, value) => {
    const updatedAttributes = [...productData.attributes];
    updatedAttributes[index][key] = value;
    setProductData({
      ...productData,
      attributes: updatedAttributes,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`/api/product/update?id=${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage('Product updated successfully!');
      } else {
        setMessage(data.message || 'Failed to update product.');
      }
    } catch (error) {
      setMessage('Error occurred while updating product.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Producto</h1>
      {message && (
        <div className={`p-2 rounded mb-4 ${message.includes('successfully') ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product_name" className="block text-sm font-medium">
            Nombre del producto
          </label>
          {isLoading ? (
            <Skeleton className="h-10 w-full mt-1" />
          ) : (
            <input
              type="text"
              name="product_name"
              id="product_name"
              value={productData.product_name}
              onChange={handleChange}
              placeholder="Nombre del producto"
              required
              className="w-full mt-1 p-2 border rounded"
            />
          )}
        </div>

        <div>
          <label htmlFor="product_price" className="block text-sm font-medium">
            Precio
          </label>
          {isLoading ? (
            <Skeleton className="h-10 w-full mt-1" />
          ) : (
            <input
              type="number"
              name="product_price"
              id="product_price"
              value={productData.product_price}
              onChange={handleChange}
              placeholder="99999"
              required
              className="w-full mt-1 p-2 border rounded"
            />
          )}
        </div>

        <div>
          <label htmlFor="product_image_url" className="block text-sm font-medium">
            URL de la imagen del producto
          </label>
          {isLoading ? (
            <Skeleton className="h-10 w-full mt-1" />
          ) : (
            <input
              type="url"
              name="product_image_url"
              id="product_image_url"
              value={productData.product_image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className="w-full mt-1 p-2 border rounded"
            />
          )}
        </div>

        <div>
          <label htmlFor="product_slug" className="block text-sm font-medium">
            Slug
          </label>
          {isLoading ? (
            <Skeleton className="h-10 w-full mt-1" />
          ) : (
            <input
              type="text"
              name="product_slug"
              id="product_slug"
              value={productData.product_slug}
              onChange={handleChange}
              placeholder="Ingrese el slug del producto"
              required
              className="w-full mt-1 p-2 border rounded"
            />
          )}
        </div>

        <div>
          <label htmlFor="product_description" className="block text-sm font-medium">
            Descripción
          </label>
          {isLoading ? (
            <Skeleton className="h-20 w-full mt-1" />
          ) : (
            <textarea
              name="product_description"
              id="product_description"
              value={productData.product_description || ''}
              onChange={handleChange}
              placeholder="Descripción"
              className="w-full mt-1 p-2 border rounded"
            />
          )}
        </div>

        <div>
          <label htmlFor="product_category_id" className="block text-sm font-medium">
            Categoría
          </label>
          {isLoading ? (
            <Skeleton className="h-10 w-full mt-1" />
          ) : (
            <select
              name="product_category_id"
              id="product_category_id"
              value={productData.product_category_id}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="">Seleccione un valor</option>
              {categories.map((category) => (
                <option key={category.product_category_id} value={category.product_category_id}>
                  {category.product_category_name}
                </option>
              ))}
            </select>
          )}
        </div>

        {isLoading ? (
          Array.from({ length: 2 }).map((_, index) => (
            <div key={index}>
              <Skeleton className="h-4 w-[100px] mb-2" /> {/* Skeleton para el nombre del atributo */}
              <Skeleton className="h-10 w-full" /> {/* Skeleton para el selector del atributo */}
            </div>
          ))
        ) : (
          productData.attributes.map((attribute, index) => (
            <div key={index}>
              <label htmlFor={`attribute_${index}`} className="block text-sm font-medium">
                {attribute.attribute_name}
              </label>
              <select
                name={`attribute_${index}`}
                id={`attribute_${index}`}
                value={attribute.value}
                onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                className="w-full mt-1 p-2 border rounded"
              >
                <option value="">Seleccione un valor</option>
                {attribute.values.map((value, i) => (
                  <option key={i} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
          ))
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isLoading} // Deshabilitar el botón mientras se carga
        >
          {isLoading ? <Skeleton className="h-10 w-24" /> : 'Actualizar producto'}
        </button>
      </form>
    </div>
  );
}