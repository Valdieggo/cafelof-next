import { Metadata } from 'next';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cookies } from 'next/headers';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export const metadata: Metadata = {
  title: 'Admin: Order Details',
  description: 'Admin page to view order details',
};

export const dynamic = "force-dynamic";

async function getOrderDetails(orderId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    
    const cookieStore = cookies();
    const sessionToken = process.env.NODE_ENV === 'production' ? '__Secure-authjs.session-token' : 'authjs.session-token';
    const token = cookieStore.get(sessionToken)?.value; 

    const response = await fetch(`${baseUrl}/order/details/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
      cache: 'no-store', 
    });

    if (!response.ok) {
      throw new Error(`Error al obtener los detalles de la orden: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los detalles de la orden:', error);
    return [];
  }
}

export default async function OrderDetailsPage({ params }: { params: { order_id: string } }) {
  const orderDetails = await getOrderDetails(params.order_id);

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Orden #{params.order_id}</CardTitle>
        </CardHeader>
        <CardContent>
          {orderDetails.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Producto</TableHead>
                    <TableHead>Cantidad</TableHead>
                    <TableHead>Precio Unitario</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderDetails.map((detail: any) => (
                    <TableRow key={detail.order_detail_id}>
                      <TableCell>{detail.product.product_name}</TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>${detail.price.toLocaleString("es-CL")}</TableCell>
                      <TableCell>${(detail.quantity * detail.price).toLocaleString("es-CL")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-right font-bold">
                Total de la Orden: $
                {orderDetails
                  .reduce((total: number, detail: any) => total + detail.quantity * detail.price, 0)
                  .toLocaleString("es-CL")}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center">No se encontraron detalles para esta orden.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}