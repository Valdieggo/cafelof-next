import CheckoutDetails from '@/components/checkout/CheckoutDetails';
import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';
import UserInfoForm from '@/components/checkout/UserInfoForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Page() {

  return (
    <div className="w-full mx-auto mt-8 mb-8 container px-4">
      <Card>
        <CardHeader>
          <CardTitle>Tu carro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* En pantallas grandes: dos columnas, en pequeñas: una columna */}
            {/* <CheckoutDetails /> */}
            <UserInfoForm />
            <CheckoutOrderSummary />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}