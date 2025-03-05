"use client";

import { FC, useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import AddressForm from "./address/AddressForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PhoneForm from "./phone/PhoneForm";
import { FaUser } from "react-icons/fa";

type UserProfileProps = {
  user: {
    name: string;
    image?: string | null;
    email: string;
    user_address_id: string;
    user_phone_number?: string | null;
  };
  userId: number;
};

const UserProfile: FC<UserProfileProps> = ({ user, userId }) => {
  const [address, setAddress] = useState<{
    street: string;
    city: string;
    cityId: number;
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
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Avatar className="w-16 h-16">
          {user.image ? (
            <AvatarImage src={user.image || undefined} alt={user.name} />
          ) : (
            <AvatarFallback>
              <FaUser className="h-6 w-6 text-gray-400" />
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Dirección</h2>
        <div className="text-gray-600 space-y-2">
          {loading ? (
            <Skeleton className="h-6 w-3/4" />
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : address ? (
            <div>
              <p>
                {address.street}, {address.city}, {address.region},{" "}
                {address.country}
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default">Modificar Dirección</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modificar Dirección</DialogTitle>
                  </DialogHeader>
                  <AddressForm
                    existingAddress={{
                      userAddressId: user.user_address_id,
                      userAddressStreet: address.street,
                      cityId: address.cityId,
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Agregar Dirección</Button>
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

      <div>
        <h2 className="text-lg font-semibold">Teléfono</h2>
        <div className="text-gray-600 space-y-2">
          {loading ? (
            <Skeleton className="h-6 w-3/4" />
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : user.user_phone_number ? (
            <div>
              <p>{user.user_phone_number}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="default">Modificar Número</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Modificar Número</DialogTitle>
                  </DialogHeader>
                  <PhoneForm userId={userId} />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button>Agregar Número</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agregar Número</DialogTitle>
                </DialogHeader>
                <PhoneForm userId={userId} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
