import { Metadata } from 'next'
import OrdersTable from "@/components/orders/OrdersTable"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: 'Admin: All Orders',
  description: 'Admin page to view and manage all user orders',
}

async function getOrders() {
  // In a real application, you would fetch this data from your API or database
  // This is just mock data for demonstration purposes
  return [
    { id: '1', user: 'john@example.com', total: 99.99, status: 'completed', date: '2023-05-01' },
    { id: '2', user: 'jane@example.com', total: 149.99, status: 'processing', date: '2023-05-02' },
    { id: '3', user: 'bob@example.com', total: 79.99, status: 'completed', date: '2023-05-03' },
    { id: '4', user: 'alice@example.com', total: 199.99, status: 'shipped', date: '2023-05-04' },
    { id: '5', user: 'charlie@example.com', total: 59.99, status: 'cancelled', date: '2023-05-05' },
    { id: '7', user: 'bob@example.com', total: 79.99, status: 'completed', date: '2023-05-03' },
    { id: '8', user: 'alice@example.com', total: 199.99, status: 'shipped', date: '2023-05-04' },
    { id: '9', user: 'charlie@example.com', total: 59.99, status: 'cancelled', date: '2023-05-05' },
    { id: '32', user: 'bob@example.com', total: 79.99, status: 'completed', date: '2023-05-03' },
    { id: '43', user: 'alice@example.com', total: 199.99, status: 'shipped', date: '2023-05-04' },
    { id: '54', user: 'charlie@example.com', total: 59.99, status: 'cancelled', date: '2023-05-05' },
    { id: '35', user: 'bob@example.com', total: 79.99, status: 'completed', date: '2023-05-03' },
    { id: '45', user: 'alice@example.com', total: 199.99, status: 'shipped', date: '2023-05-04' },
    { id: '55', user: 'charlie@example.com', total: 59.99, status: 'cancelled', date: '2023-05-05' },
  ]
}

export default async function AdminOrdersPage() {
  const orders = await getOrders()

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <OrdersTable initialOrders={orders} />
        </CardContent>
      </Card>
    </div>
  )
}

