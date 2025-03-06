"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'nextjs-toast-notify';
import { Skeleton } from '@/components/ui/skeleton'; // Importa el componente Skeleton
import CoffeeLoader from "@/lib/CoffeeLoader"; // Importa el componente CoffeeLoader

export default function EditProductPage({ params }) {
  const { product_id } = params;
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedAttributes, setSelectedAttributes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch product details
    fetch(`/api/product/${product_id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setProduct(data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching product:', error);
      });
  
    // Fetch categories
    fetch('/api/product/category')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setCategories(data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  
    // Fetch attributes
    fetch('/api/product/attributes')
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setAttributes(data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching attributes:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [product_id]);
  
  // Efecto adicional para inicializar selectedAttributes cuando tanto product como attributes estén disponibles
  useEffect(() => {
    if (product && attributes.length > 0) {
      // Obtener los nombres de los atributos del producto
      const productAttributeNames = product.attributes.map(attr => attr.attribute_name);
  
      // Filtrar los atributos completos para obtener los attribute_id correspondientes
      const selectedAttributeIds = attributes
        .filter(attr => productAttributeNames.includes(attr.attribute_name))
        .map(attr => attr.attribute_id);
  
      // Actualizar selectedAttributes
      setSelectedAttributes(selectedAttributeIds);
    }
  }, [product, attributes]);

  const handleAttributeSelection = (attributeId) => {
    setSelectedAttributes((prev) => {
      if (prev.includes(attributeId)) {
        return prev.filter((id) => id !== attributeId); // Deseleccionar el atributo
      } else {
        return [...prev, attributeId]; // Seleccionar el atributo
      }
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Filtrar valores null del array selectedAttributes
    const attributesToSend = selectedAttributes.length > 0
    ? selectedAttributes.filter((attr) => attr !== null)
    : product.attributes.map((attr) => attr.attribute_id);

  
    try {
      const response = await fetch(`/api/product/update?id=${product_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: product.product_name,
          product_price: product.product_price,
          product_image_url: product.product_image_url || null,
          product_category_id: product.product_category_id,
          product_description: product.product_description || null,
          attributes: attributesToSend, // Usar el array filtrado
        }),
      });
      const data = await response.json();
  
      if (response.ok) {
        toast.success('Producto actualizado exitosamente', {
          duration: 4000,
          progress: false,
          position: 'bottom-center',
          transition: 'popUp',
          icon: '',
          sound: false,
        });
        router.push('/admin/products/edit'); // Redirigir a la lista de productos
      } else {
        toast.error(data.message || 'Error al actualizar el producto', {
          duration: 4000,
          progress: false,
          position: 'bottom-center',
          transition: 'popUp',
          icon: '',
          sound: false,
        });
      }
    } catch (err) {
      toast.error('Error al actualizar el producto', {
        duration: 4000,
        progress: false,
        position: 'bottom-center',
        transition: 'popUp',
        icon: '',
        sound: false,
      });
    }
  };

  if (isLoading) {
    return <CoffeeLoader />; // Usa el componente CoffeeLoader en lugar del texto "Cargando..."
  }

  if (!product) {
    return <div>No se encontró el producto</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar producto</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product_name" className="block text-sm font-medium">
            Nombre del producto
          </label>
          <input
            type="text"
            name="product_name"
            id="product_name"
            value={product.product_name}
            onChange={(e) => setProduct({ ...product, product_name: e.target.value })}
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
            value={product.product_price}
            onChange={(e) => setProduct({ ...product, product_price: e.target.value })}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </div>

        <div>
          <label htmlFor="product_image_url" className="block text-sm font-medium">
            URL de la imagen del producto
          </label>
          <input
            type="text" // Cambiado de "url" a "text"
            name="product_image_url"
            id="product_image_url"
            value={product.product_image_url}
            onChange={(e) => setProduct({ ...product, product_image_url: e.target.value })}
            placeholder="Ej: /imagenes_cafe/arabica_caturra.webp"
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
            value={product.product_description}
            onChange={(e) => setProduct({ ...product, product_description: e.target.value })}
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
            value={product.product_category_id}
            onChange={(e) => setProduct({ ...product, product_category_id: e.target.value })}
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
          <label htmlFor="attributes" className="block text-sm font-medium">
            Atributos del producto
          </label>
          {attributes.map((attribute) => (
            <div key={attribute.attribute_id} className="mb-4">
              <input
                type="checkbox"
                name={`attribute_${attribute.attribute_id}`}
                id={`attribute_${attribute.attribute_id}`}
                checked={selectedAttributes.includes(attribute.attribute_id)} // Establecer correctamente el valor del checkbox
                onChange={() => handleAttributeSelection(attribute.attribute_id)}
                className="mr-2"
              />
              <span>{attribute.attribute_name}</span>
            </div>
          ))}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Guardar cambios
        </button>
        <button type="button" onClick={() => router.back()} className="bg-gray-600 text-white px-4 ml-4 py-2 rounded">
          Regresar
        </button>
      </form>
    </div>
  );
}
