'use client';

import { useState, useEffect } from 'react';
import { toast } from 'nextjs-toast-notify';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react'; // Iconos de lucide-react
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

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
      const response = await fetch('/api/product/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_name: productData.product_name,
          product_price: parseFloat(productData.product_price),
          product_image_url: productData.product_image_url || null,
          product_category_id: parseInt(productData.product_category_id),
          product_description: productData.product_description || null,
          attributes: selectedAttributes,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        const productId = data.data.product_id;

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
          setSelectedAttributes([]);
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
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Administración de productos y categorías</h1>
        <Button variant="outline" onClick={() => router.push("/admin")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Regresar
        </Button>
      </div>

      {/* Category Form */}
      <Card>
        <CardHeader>
          <CardTitle>Crear nueva categoría</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product_category_name">Nombre de la categoría</Label>
              <Input
                type="text"
                name="product_category_name"
                id="product_category_name"
                value={categoryData.product_category_name}
                onChange={handleCategoryChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_category_description">Descripción de la categoría</Label>
              <Input
                type="text"
                name="product_category_description"
                id="product_category_description"
                value={categoryData.product_category_description}
                onChange={handleCategoryChange}
                required
              />
            </div>

            <Button type="submit">Crear categoría</Button>
          </form>
        </CardContent>
      </Card>

      {/* Product Form */}
      <Card>
        <CardHeader>
          <CardTitle>Crear nuevo producto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProductSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product_name">Nombre del producto</Label>
              <Input
                type="text"
                name="product_name"
                id="product_name"
                value={productData.product_name}
                onChange={handleProductChange}
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
                value={productData.product_price}
                onChange={handleProductChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_image_url">URL de la imagen del producto</Label>
              <Input
                type="text"
                name="product_image_url"
                id="product_image_url"
                value={productData.product_image_url}
                onChange={handleProductChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_description">Descripción del producto</Label>
              <Textarea
                name="product_description"
                id="product_description"
                value={productData.product_description}
                onChange={handleProductChange}
                placeholder="Ingrese la descripción del producto"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_category_id">Categoría del producto</Label>
              <Select
  name="product_category_id"
  value={String(productData.product_category_id)} // Asegúrate de que el valor sea una cadena
  onValueChange={(value) =>
    setProductData({ ...productData, product_category_id: parseInt(value, 10) })
  }
  required
>
  <SelectTrigger>
    <SelectValue placeholder="Seleccione una categoría" />
  </SelectTrigger>
  <SelectContent>
    {categories.map((category) => (
      <SelectItem key={category.product_category_id} value={String(category.product_category_id)}>
        {category.product_category_name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inventory_quantity">Cantidad en inventario</Label>
              <Input
                type="number"
                name="inventory_quantity"
                id="inventory_quantity"
                step="0.01"
                value={productData.inventory_quantity}
                onChange={handleProductChange}
                required
              />
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

            <Button type="submit">Crear producto</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}