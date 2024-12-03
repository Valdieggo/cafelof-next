import { MdCheckCircle, MdCreditCard, MdCalendarToday, MdTag, MdAttachMoney, MdBusiness, MdShoppingBag } from 'react-icons/md'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import formatCurrency from '../../../utils/formatCurrency';

interface PaymentDetails {
  orderNumber: string;
  amount: number;
  currency: string;
  authorizationCode: string;
  transactionDate: string;
  paymentType: 'Debit' | 'Credit';
  feeType: string;
  feeAmount: number;
  installmentAmount: number;
  cardLastFourDigits: string;
  description: string;
}

export default function SuccessfulPayment({ 
  orderNumber,
  amount,
  currency,
  authorizationCode,
  transactionDate,
  paymentType,
  feeType,
  feeAmount,
  installmentAmount,
  cardLastFourDigits,
  description
}: PaymentDetails) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <MdCheckCircle className="h-6 w-6 text-green-500" />
          <CardTitle className="text-2xl font-bold text-green-700">Pago exitoso</CardTitle>
        </div>
        <CardDescription>Gracias por tu compra. Aquí están los detalles de tu transacción</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Información de tu orden</p>
            <div className="flex items-center space-x-2">
              <MdTag className="h-4 w-4 text-gray-400" />
              <p><span className="font-medium">Número de orden:</span> {orderNumber}</p>
            </div>
            <div className="flex items-center space-x-2">
              <MdShoppingBag className="h-4 w-4 text-gray-400" />
              <p><span className="font-medium">Descripción:</span> {description}</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Detalles del método de pago</p>
            <div className="flex items-center space-x-2">
              <MdAttachMoney className="h-4 w-4 text-gray-400" />
              <p><span className="font-medium">Monto:</span> {amount.toLocaleString("es-CL")} {currency}</p>
            </div>
            <div className="flex items-center space-x-2">
              <MdCreditCard className="h-4 w-4 text-gray-400" />
              <p><span className="font-medium">Tipo de pago:</span> {paymentType}</p>
            </div>
            <p><span className="font-medium">Número de tarjeta:</span> **** **** **** {cardLastFourDigits}</p>
            <p><span className="font-medium">Código de autorización:</span> {authorizationCode}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Detalles de transacción</p>
            <div className="flex items-center space-x-2">
              <MdCalendarToday className="h-4 w-4 text-gray-400" />
              <p><span className="font-medium">Fecha:</span> {transactionDate}</p>
            </div>
            <p><span className="font-medium">Tipo de impuesto:</span> {feeType}</p>
            <p><span className="font-medium">Fee Amount:</span> {feeAmount.toFixed(2)} {currency}</p>
            <p><span className="font-medium">Installment Amount:</span> {installmentAmount.toFixed(2)} {currency}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

