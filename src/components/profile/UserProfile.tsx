"use client";

import { FC, useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton"; // Importa Skeleton
import AddressForm from "../address/AddressForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type UserProfileProps = {
  user: {
    name: string;
    image?: string | null;
    email: string;
    user_address_id: string;
    user_phone_number?: string | null;
  };
};

const UserProfile: FC<UserProfileProps> = ({ user }) => {
  const [address, setAddress] = useState<{
    street: string;
    city: string;
    region: string;
    country: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user.user_address_id) {
      setLoading(true);
      fetch(`/api/userAddress?user_address_id=${user.user_address_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            setAddress(data.data);
          } else {
            setError(data.message || "Error al cargar la dirección");
          }
        })
        .catch(() => {
          setError("Error al cargar la dirección");
        })
        .finally(() => setLoading(false));
    }
  }, [user.user_address_id]);

  return (
    <div className="container mx-auto max-w-xl p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.image || undefined} alt={user.name} />
            </Avatar>
            <div>
              <CardTitle className="text-2xl font-bold">{user.name}</CardTitle>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="space-y-4">
            {/* Dirección */}
            <div>
              <h2 className="text-lg font-semibold">Dirección</h2>
              <div className="text-gray-600">
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                ) : error ? (
                  <p className="text-red-600">{error}</p>
                ) : address ? (
                  <p>
                    {address.street}, {address.city}, {address.region},{" "}
                    {address.country}
                  </p>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Agregar dirección</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar Dirección</DialogTitle>
                      </DialogHeader>
                      <AddressForm />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <h2 className="text-lg font-semibold">Teléfono</h2>
              <p className="text-gray-600">
                {user.user_phone_number ? (
                  user.user_phone_number
                ) : (
                  <Button>Agregar número</Button>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
