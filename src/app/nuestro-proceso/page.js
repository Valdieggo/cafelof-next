import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FaHardHat } from "react-icons/fa"

export default async function Page() {
  return (
    <div className="flex items-center justify-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold flex items-center justify-center space-x-2">
            <FaHardHat className="text-yellow-500" size={24} />
            <h1>Página en construcción</h1>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-600">
            Vuelve pronto para ver el contenido de esta página.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

