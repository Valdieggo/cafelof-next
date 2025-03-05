import { Metadata } from 'next';
import OrdersTable from "@/components/orders/OrdersTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cookies } from 'next/headers'; 

export const metadata: Metadata = {
  title: 'Admin: All Orders',
  description: 'Admin page to view and manage all user orders',
};

export const dynamic = "force-dynamic";

async function getOrders() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const cookieStore = cookies();
    const sessionToken = process.env.NODE_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token';
    const token = cookieStore.get(sessionToken)?.value; 

    const response = await fetch(`${baseUrl}/order`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      cache: 'no-store', 
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
          <CardTitle>Órdenes</CardTitle>
        </CardHeader>
        <CardContent>
          {orders.length > 0 ? (
            <OrdersTable initialOrders={orders} />
          ) : (
            <p className="text-gray-500 text-center">No se encuentran órdenes</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
