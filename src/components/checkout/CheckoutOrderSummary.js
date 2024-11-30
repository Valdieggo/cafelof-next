"use client";
import { useCart } from '@/context/CartContext';
import { useState } from 'react';
import formatCurrency from '../../../utils/formatCurrency';

export default function CheckoutOrderSummary() {
  const { getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const { cartItems } = useCart();

  const handlePlaceOrder = async () => {
    setLoading(true);

    try{
      const orderData = await fetch("http://localhost:3000/api/transaction/create",
        {
          method: "POST",
          body: JSON.stringify({ amount: getTotalPrice() })
        });
        const data = await orderData.json();
        window.location.href = `${data.url}?token_ws=${data.token}`;
      } catch (error) {
        console.error('Error al crear la transacción:', error);
        throw error;
      } finally {
        setLoading(false);
      }
  };

  return (
    <div className="summary-and-payment flex flex-col md:w-1/3 p-4 border-t md:border-l md:border-t-0 border-gray-300 gap-6">
      <div className="order-summary">
        <h2 className="text-2xl font-bold mb-5">Resúmen</h2>
        <div className="flex justify-between mb-3">
          <span>Subtotal</span>
          <span>{formatCurrency(getTotalPrice())}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span>Descuentos</span>
          <span>{formatCurrency(0)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatCurrency(getTotalPrice())}</span>
        </div>
      </div>
      <button
        className="w-full p-3 bg-black text-white font-bold rounded"
        onClick={handlePlaceOrder}
        disabled={loading}
      >
        Ir a pagar
      </button>
    </div>
  );
}
