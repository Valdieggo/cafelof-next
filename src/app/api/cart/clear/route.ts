import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const userId = req.headers.authorization?.split('Bearer ')[1];

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    await prisma.cart.deleteMany({
      where: { user_id: userId },
    });

    return res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ message: 'Failed to clear cart' });
  }
}