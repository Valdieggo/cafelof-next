'use client';

import { useState, useEffect } from 'react';
import { toast } from 'nextjs-toast-notify';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react'; // Iconos de lucide-react
import { Button } from '@/components/ui/button';

export default function CreateCategoryAndProduct() {
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [categoryData, setCategoryData] = useState({
    product_category_name: '',
    product_category_description: '',
  });
  const [productData, setProductData] = useState({
    product_name: '',
    product_price: '',
    product_image_url: '',
    product_category_id: '',
    product_description: '',
    inventory_quantity: 0,
  });
  const router = useRouter();

  useEffect(() => {
    fetchCategories();
    fetchAttributes();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/product/category');
      const data = await response.json();
      if (response.ok) {
        setCategories(data.data);
      } else {
        console.error(data.message || 'Failed to fetch categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchAttributes = async () => {
    try {
      const response = await fetch('/api/product/attributes');
      const data = await response.json();
      if (response.ok) {
        setAttributes(data.data);
      } else {
        console.error(data.message || 'Failed to fetch attributes');
      }
    } catch (err) {
      console.error('Error fetching attributes:', err);
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryData({
      ...categoryData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/product/category/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success('Categoría creada exitosamente', {
          duration: 4000,
          progress: false,
          position: 'bottom-center',
          transition: 'popUp',
          icon: '',
          sound: false,
        });
        setCategoryData({ product_category_name: '', product_category_description: '' });
        fetchCategories(); // Refresh categories
      } else {
        toast.error(data.message || 'Error al crear la categoría', {
          duration: 4000,
          progress: false,
          position: 'bottom-center',
          transition: 'popUp',
          icon: '',
          sound: false,
        });
      }
    } catch (err) {
      toast.error('Error al crear la categoría', {
        duration: 4000,
        progress: false,
        position: 'bottom-center',
        transition: 'popUp',
        icon: '',
        sound: false,
      });
    }
  };

  const handleProductChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAttributeSelection = (attributeId) => {
    setSelectedAttributes((prev) => {
      if (prev.includes(attributeId)) {
        return prev.filter((id) => id !== attributeId); // Deseleccionar el atributo
      } else {
        return [...prev, attributeId]; // Seleccionar el atributo
      }
    });
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Crear el producto
      const response = await fetch('/api/product/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productData.product_name,
          product_price: parseFloat(productData.product_price),
          product_image_url: productData.product_image_url || null,
          product_category_id: parseInt(productData.product_category_id),
          product_description: productData.product_description || null,
          attributes: selectedAttributes, // Enviar los atributos seleccionados
        }),
      });
      const data = await response.json(); // Aquí se obtiene la respuesta del producto creado
  
      if (response.ok) {
        const productId = data.data.product_id; // Usar `data` en lugar de `productDataResponse`
  
        // Crear el inventario para el producto
        const inventoryResponse = await fetch('/api/inventory/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            product_id: productId,
            inventory_quantity: Number(productData.inventory_quantity),
          }),
        });
  
        if (inventoryResponse.ok) {
          toast.success('Producto e inventario creados exitosamente', {
            duration: 4000,
            progress: false,
            position: 'bottom-center',
            transition: 'popUp',
            icon: '',
            sound: false,
          });
  
          setProductData({
            product_name: '',
            product_price: '',
            product_image_url: '',
            product_category_id: '',
            product_description: '',
            inventory_quantity: 0,
          });
          setSelectedAttributes([]); // Limpiar atributos seleccionados
        } else {
          console.log('Error al crear el inventario');
          const inventoryError = await inventoryResponse.json();
          toast.error(inventoryError.message || 'Error al crear el inventario', {
            duration: 4000,
            progress: false,
            position: 'bottom-center',
            transition: 'popUp',
            icon: '',
            sound: false,
          });
        }
      } else {
        toast.error(data.message || 'Error al crear el producto', {
          duration: 4000,
          progress: false,
          position: 'bottom-center',
          transition: 'popUp',
          icon: '',
          sound: false,
        });
      }
    } catch (err) {
      console.error('Error al crear el producto:', err);
      toast.error('Error al crear el producto', {
        duration: 4000,
        progress: false,
        position: 'bottom-center',
        transition: 'popUp',
        icon: '',
        sound: false,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Administración de productos y categorías</h1>
      <Button variant="outline" onClick={() => router.push("/admin")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Regresar
        </Button>

      {/* Category Form */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Crear nueva categoría</h2>
        <form onSubmit={handleCategorySubmit} className="space-y-4">
          <div>
            <label htmlFor="product_category_name" className="block text-sm font-medium">
              Nombre de la categoría
            </label>
            <input
              type="text"
              name="product_category_name"
              id="product_category_name"
              value={categoryData.product_category_name}
              onChange={handleCategoryChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="product_category_description" className="block text-sm font-medium">
              Descripción de la categoría
            </label>
            <input
              type="text"
              name="product_category_description"
              id="product_category_description"
              value={categoryData.product_category_description}
              onChange={handleCategoryChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Crear categoría
          </button>
        </form>
      </div>

      {/* Product Form */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Crear nuevo producto</h2>
        <form onSubmit={handleProductSubmit} className="space-y-4">
          <div>
            <label htmlFor="product_name" className="block text-sm font-medium">
              Nombre del producto
            </label>
            <input
              type="text"
              name="product_name"
              id="product_name"
              value={productData.product_name}
              onChange={handleProductChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="product_price" className="block text-sm font-medium">
              Precio
            </label>
            <input
              type="number"
              name="product_price"
              id="product_price"
              step="0.01"
              value={productData.product_price}
              onChange={handleProductChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="product_image_url" className="block text-sm font-medium">
              URL de la imagen del producto
            </label>
            <input
              type="url"
              name="product_image_url"
              id="product_image_url"
              value={productData.product_image_url}
              onChange={handleProductChange}
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="product_description" className="block text-sm font-medium">
              Descripción del producto
            </label>
            <textarea
              name="product_description"
              id="product_description"
              value={productData.product_description}
              onChange={handleProductChange}
              placeholder="Ingrese la descripción del producto"
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="product_category_id" className="block text-sm font-medium">
              Categoría del producto
            </label>
            <select
              name="product_category_id"
              id="product_category_id"
              value={productData.product_category_id}
              onChange={handleProductChange}
              required
              className="w-full mt-1 p-2 border rounded"
            >
              <option value="">Seleccione una categoría</option>
              {categories.map((category) => (
                <option key={category.product_category_id} value={category.product_category_id}>
                  {category.product_category_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="inventory_quantity" className="block text-sm font-medium">
              Cantidad en inventario
            </label>
            <input
              type="number"
              name="inventory_quantity"
              id="inventory_quantity"
              step="0.01"
              value={productData.inventory_quantity}
              onChange={handleProductChange}
              required
              className="w-full mt-1 p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="attributes" className="block text-sm font-medium">
              Atributos del producto
            </label>
            {attributes.map((attribute) => (
              <div key={attribute.attribute_id} className="mb-4">
                <input
                  type="checkbox"
                  name={`attribute_${attribute.attribute_id}`}
                  id={`attribute_${attribute.attribute_id}`}
                  checked={selectedAttributes.includes(attribute.attribute_id)}
                  onChange={() => handleAttributeSelection(attribute.attribute_id)}
                  className="mr-2"
                />
                <span>{attribute.attribute_name}</span>
              </div>
            ))}
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Crear producto
          </button>
        </form>
      </div>
    </div>
  );
}