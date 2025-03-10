"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "nextjs-toast-notify";

interface Country {
  country_id: number;
  country_name: string;
}

interface Region {
  region_id: number;
  region_name: string;
}

interface City {
  city_id: number;
  city_name: string;
}

type AddressFormProps = {
  existingAddress?: {
    userAddressId: string;
    userAddressStreet: string;
    cityId: number;
  };
};

const AddressForm: React.FC<AddressFormProps> = ({ existingAddress }) => {
  const router = useRouter();
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(
    existingAddress?.cityId || null
  );
  const [address, setAddress] = useState<string>(
    existingAddress?.userAddressStreet || ""
  );

  const { data: session } = useSession();

  useEffect(() => {
    fetch("/api/country")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200 && Array.isArray(data.data)) {
          setCountries(data.data);
        } else {
          console.error("Invalid countries response:", data);
        }
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetch(`/api/region?country_id=${selectedCountry}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200 && Array.isArray(data.data)) {
            setRegions(data.data);
            setCities([]);
            setSelectedRegion(null);
          } else {
            console.error("Invalid regions response:", data);
          }
        })
        .catch((error) => console.error("Error fetching regions:", error));
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedRegion) {
      fetch(`/api/city?region_id=${selectedRegion}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200 && Array.isArray(data.data)) {
            setCities(data.data);
            setSelectedCity(null);
          } else {
            console.error("Invalid cities response:", data);
          }
        })
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [selectedRegion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCountry || !selectedRegion || !selectedCity || !address) {
      toast.error("Por favor, completa todos los campos", {
        duration: 4000,
        progress: false,
        position: "bottom-center",
        transition: "popUp",
        icon: "",
        sound: false,
      });
      return;
    }

    const payload: { userId?: string; userAddressStreet: string; cityId: number } = {
      userAddressStreet: address,
      cityId: selectedCity,
    };

    if (existingAddress) {
      const updatedPayload = {
        ...payload,
        userAddressId: existingAddress.userAddressId,
      };

      try {
        const response = await fetch(`/api/userAddress/update`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedPayload),
        });

        if (response.ok) {
          toast.success("Dirección actualizada exitosamente", {
            duration: 4000,
            progress: false,
            position: "bottom-center",
            transition: "popUp",
            icon: "",
            sound: false,
          });
          router.refresh();
        } else {
          toast.error("Hubo un error al actualizar la dirección", {
            duration: 4000,
            progress: false,
            position: "bottom-center",
            transition: "popUp",
            icon: "",
            sound: false,
          });
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
        toast.error("Hubo un error al enviar los datos", {
          duration: 4000,
          progress: false,
          position: "bottom-center",
          transition: "popUp",
          icon: "",
          sound: false,
        });
      }
    } else {
      payload.userId = session?.user.id;

      try {
        const response = await fetch(`/api/userAddress/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          toast.success("Dirección creada exitosamente", {
            duration: 4000,
            progress: false,
            position: "bottom-center",
            transition: "popUp",
            icon: "",
            sound: false,
          });
          router.refresh();
        } else {
          toast.error("Hubo un error al crear la dirección", {
            duration: 4000,
            progress: false,
            position: "bottom-center",
            transition: "popUp",
            icon: "",
            sound: false,
          });
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
        toast.error("Hubo un error al enviar los datos", {
          duration: 4000,
          progress: false,
          position: "bottom-center",
          transition: "popUp",
          icon: "",
          sound: false,
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Dirección
        </label>
        <input
          type="text"
          id="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Ingresa tu dirección"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          País
        </label>
        <select
          id="country"
          value={selectedCountry ?? ""}
          onChange={(e) => setSelectedCountry(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Selecciona un país</option>
          {countries.map((country) => (
            <option key={country.country_id} value={country.country_id}>
              {country.country_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="region" className="block text-sm font-medium text-gray-700">
          Región
        </label>
        <select
          id="region"
          value={selectedRegion ?? ""}
          onChange={(e) => setSelectedRegion(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={!selectedCountry}
        >
          <option value="">Selecciona una región</option>
          {regions.map((region) => (
            <option key={region.region_id} value={region.region_id}>
              {region.region_name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          Ciudad
        </label>
        <select
          id="city"
          value={selectedCity ?? ""}
          onChange={(e) => setSelectedCity(Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          disabled={!selectedRegion}
        >
          <option value="">Selecciona una ciudad</option>
          {cities.map((city) => (
            <option key={city.city_id} value={city.city_id}>
              {city.city_name}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" className="w-full">
        {existingAddress ? "Actualizar Dirección" : "Guardar Dirección"}
      </Button>
    </form>
  );
};

export default AddressForm;