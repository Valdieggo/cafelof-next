'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from 'next/link';

type Order = {
  order_id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  order_total_price: number;
  transaction_status: string | null;
  order_date: string;
};

type OrdersTableProps = {
  initialOrders: Order[]
}

export default function OrdersTable({ initialOrders }: OrdersTableProps) {
  const [orders, setOrders] = useState(initialOrders)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredOrders = orders.filter(order => 
    order.user_id.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === 'all' || order.transaction_status === statusFilter)
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Input
          placeholder="Buscar por ID de usuario"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="AUTHORIZED">Pagada</SelectItem>
            <SelectItem value="FAILED">Sin pagar</SelectItem>
            <SelectItem value="CREADA">Creada</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Órden</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.order_id}>
                <TableCell>{order.order_id}</TableCell>
                <TableCell>{order.user_name} ({order.user_email})</TableCell>
                <TableCell>${order.order_total_price.toLocaleString("es-CL")}</TableCell>
                <TableCell>{order.transaction_status || 'N/A'}</TableCell>
                <TableCell>{new Date(order.order_date).toLocaleString()}</TableCell>
<TableCell>
  <Link href={`/admin/orders/${order.order_id}`}>
    <button className="bg-blue-600 text-white px-4 py-2 rounded">
      Ver Detalles
    </button>
  </Link>
</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
