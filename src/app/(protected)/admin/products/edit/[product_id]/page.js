"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'nextjs-toast-notify';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
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
      : [];

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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Editar producto</h1>
      <Card>
        <CardHeader>
          <CardTitle>Información del producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product_name">Nombre del producto</Label>
              <Input
                type="text"
                name="product_name"
                id="product_name"
                value={product.product_name}
                onChange={(e) => setProduct({ ...product, product_name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_price">Precio</Label>
              <Input
                type="number"
                name="product_price"
                id="product_price"
                step="0.01"
                value={product.product_price}
                onChange={(e) => setProduct({ ...product, product_price: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_image_url">URL de la imagen del producto</Label>
              <Input
                type="text"
                name="product_image_url"
                id="product_image_url"
                value={product.product_image_url}
                onChange={(e) => setProduct({ ...product, product_image_url: e.target.value })}
                placeholder="Ej: /imagenes_cafe/arabica_caturra.webp"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_description">Descripción del producto</Label>
              <Textarea
                name="product_description"
                id="product_description"
                value={product.product_description}
                onChange={(e) => setProduct({ ...product, product_description: e.target.value })}
                placeholder="Ingrese la descripción del producto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_category_id">Categoría del producto</Label>
              <Select
                name="product_category_id"
                value={product.product_category_id}
                onValueChange={(value) =>
                  setProduct({ ...product, product_category_id: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.product_category_id} value={category.product_category_id}>
                      {category.product_category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Atributos del producto</Label>
              <div className="grid grid-cols-2 gap-4">
                {attributes.map((attribute) => (
                  <div key={attribute.attribute_id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`attribute_${attribute.attribute_id}`}
                      checked={selectedAttributes.includes(attribute.attribute_id)}
                      onCheckedChange={() => handleAttributeSelection(attribute.attribute_id)}
                    />
                    <label htmlFor={`attribute_${attribute.attribute_id}`} className="text-sm">
                      {attribute.attribute_name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <CardFooter className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Regresar
              </Button>
              <Button type="submit">Guardar cambios</Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}