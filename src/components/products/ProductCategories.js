import Link from "next/link"
import { CiCoffeeBean, CiCoffeeCup} from "react-icons/ci";
import { GiCoffeePot } from "react-icons/gi";

const categories = [
  { name: "Café de grano", icon: CiCoffeeBean },
  { name: "Cafeteras", icon: GiCoffeePot },
  { name: "Accesorios", icon: CiCoffeeCup },
]

export default function ProductCategories() {
  return (
    <div className="w-full py-6">
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 p-4 justify-start md:justify-center">
          {categories.map((category, index) => {
            const IconComponent = category.icon;
            return (
              <Link
                key={index}
                href={`/category/${category.name.toLowerCase().replace(" & ", "-").replace(" ", "-")}`}
                className="w-[150px] text-center flex-shrink-0"
              >
                <div className="flex items-center justify-center w-[150px] h-[150px] bg-gray-100 rounded-md">
                  <IconComponent size={50} className="text-gray-600 transition-all hover:scale-105" />
                </div>
                <h3 className="mt-2 font-medium text-sm">{category.name}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
