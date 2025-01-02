import CheckoutClient from "./CheckoutClient"; // New client component

export const metadata = {
  title: "Checkout",
  description: "Finaliza tu compra aquí.",
};

export default async function Page() {
  return <CheckoutClient />;
}
