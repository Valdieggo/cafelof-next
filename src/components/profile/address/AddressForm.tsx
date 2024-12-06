"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

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

const AddressForm: React.FC = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [address, setAddress] = useState(""); 

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

  // Fetch regions when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      fetch(`/api/region?country_id=${selectedCountry}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200 && Array.isArray(data.data)) {
            setRegions(data.data);
            setCities([]); // Reset cities when the country changes
            setSelectedRegion(null); // Reset selected region
          } else {
            console.error("Invalid regions response:", data);
          }
        })
        .catch((error) => console.error("Error fetching regions:", error));
    }
  }, [selectedCountry]);

  // Fetch cities when a region is selected
  useEffect(() => {
    if (selectedRegion) {
      fetch(`/api/city?region_id=${selectedRegion}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200 && Array.isArray(data.data)) {
            setCities(data.data);
            setSelectedCity(null); // Reset selected city
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
      alert("Por favor, completa todos los campos");
      return;
    }

    const payload = {
      userId: session?.user.id,
      userAddressStreet: address,
      cityId: selectedCity,
    };

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/userAddress/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Dirección guardada exitosamente");
        console.log("Respuesta del servidor:", result);
      } else {
        alert("Hubo un error al guardar la dirección");
        console.error("Error del servidor:", result.error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Hubo un error al enviar los datos");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        {/* Address */}
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

        {/* Country */}
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

        {/* Region */}
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            Región
          </label>
          <select
            id="region"
            value={selectedRegion ?? ""}
            onChange={(e) => setSelectedRegion(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={!selectedCountry} // Disabled until a country is selected
          >
            <option value="">Selecciona una región</option>
            {regions.map((region) => (
              <option key={region.region_id} value={region.region_id}>
                {region.region_name}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Ciudad
          </label>
          <select
            id="city"
            value={selectedCity ?? ""}
            onChange={(e) => setSelectedCity(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            disabled={!selectedRegion} // Disabled until a region is selected
          >
            <option value="">Selecciona una ciudad</option>
            {cities.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.city_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Guardar Dirección
      </Button>
    </form>
  );
};

export default AddressForm;
