import { Metadata } from 'next'
import OrdersTable from "@/components/orders/OrdersTable"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: 'Admin: All Orders',
  description: 'Admin page to view and manage all user orders',
}

// Obtener órdenes desde el endpoint
async function getOrders() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${baseUrl}/product`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Evitar caché para obtener siempre datos actualizados
    });

    if (!response.ok) {
      throw new Error(`Error al obtener las órdenes: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener las órdenes:', error);
    return [];
  }
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <OrdersTable initialOrders={orders} />
          ) : (
            <p className="text-gray-500 text-center">No orders found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


// TODO: 
// Fix the Date to avoid hydratation errors