import Link from "next/link";
import { CiCoffeeBean, CiCoffeeCup } from "react-icons/ci";
import { GiCoffeePot } from "react-icons/gi";

const categories = [
  { name: "Café de grano", icon: CiCoffeeBean },
  { name: "Cafeteras", icon: GiCoffeePot },
  { name: "Accesorios", icon: CiCoffeeCup },
];

export default function ProductCategories() {
  return (
    <div className="w-full py-6 bg-[var(--categories-bar)] container mx-auto">
      <h1 className="text-xl sm:text-4xl flex justify-center">Explora nuestras categorías</h1>
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex space-x-6 p-4 justify-start md:justify-center">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                href={`/category/${category.name.toLowerCase().replace(" & ", "-").replace(" ", "-")}`}
                className="w-[150px] text-center flex-shrink-0 transition-transform duration-300 ease-in-out transform hover:scale-105"
              >
                <div className="flex items-center justify-center w-[150px] h-[150px] bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl">
                  <IconComponent size={50} className="text-primary-500 drop-shadow-md" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-700 text-lg tracking-wide transition-colors duration-300 hover:text-primary-500">
                  {category.name}
                </h3>
                <div className="w-8 h-1 bg-primary-500 mx-auto mt-1 rounded"></div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
