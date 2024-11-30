import { MdError, MdInfo, MdTag } from 'react-icons/md';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface PaymentErrorDetails {
  orderNumber?: string;
  errorCode: string;
  errorMessage: string;
}

export default function UnsuccessfulPayment({
  orderNumber,
  errorCode,
  errorMessage
}: PaymentErrorDetails) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <MdError className="h-6 w-6 text-red-500" />
          <CardTitle className="text-2xl font-bold text-red-700">Pago rechazado</CardTitle>
        </div>
        <CardDescription>
          Lo sentimos, no pudimos procesar tu pago. A continuación, encontrarás los detalles del error.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-6">
          {orderNumber && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-500">Información de tu orden</p>
              <div className="flex items-center space-x-2">
                <MdTag className="h-4 w-4 text-gray-400" />
                <p><span className="font-medium">Número de orden:</span> {orderNumber}</p>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500">Detalles del error</p>
            <div className="flex items-center space-x-2">
              <MdInfo className="h-4 w-4 text-gray-400" />
              <p><span className="font-medium">Código de error:</span> {errorCode}</p>
            </div>
            <div className="flex items-center space-x-2">
              <MdInfo className="h-4 w-4 text-gray-400" />
              <p><span className="font-medium">Mensaje de error:</span> {errorMessage}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">¿Qué puedes hacer?</p>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Revisa los datos de tu tarjeta y asegúrate de que sean correctos.</li>
              <li>Intenta nuevamente en unos minutos.</li>
              <li>Contacta a tu banco si el problema persiste.</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}