import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'PUT') {
    const { product_name, product_price, product_image_url, product_category_id } = req.body;

    try {
      const updatedProduct = await prisma.product.update({
        where: { product_id: Number(id) },
        data: {
          product_name,
          product_price: parseFloat(product_price),
          product_image_url,
          product_category_id: Number(product_category_id),
        },
      });

      return res.status(200).json(updatedProduct);
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ message: 'Error updating product' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}