"use client";

import React, { useState, useEffect } from "react";
import { FaUser, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

// Tipos para los datos de país, región y ciudad
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

export default function UserInfoForm() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [selectedCity, setSelectedCity] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const { data: session } = useSession();

  // Cargar países al montar el componente
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

  // Cargar regiones al seleccionar un país
  useEffect(() => {
    if (selectedCountry) {
      fetch(`/api/region?country_id=${selectedCountry}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200 && Array.isArray(data.data)) {
            setRegions(data.data);
            setCities([]); // Resetear ciudades al cambiar el país
            setSelectedRegion(null); // Resetear la región seleccionada
          } else {
            console.error("Invalid regions response:", data);
          }
        })
        .catch((error) => console.error("Error fetching regions:", error));
    }
  }, [selectedCountry]);

  // Cargar ciudades al seleccionar una región
  useEffect(() => {
    if (selectedRegion) {
      fetch(`/api/city?region_id=${selectedRegion}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 200 && Array.isArray(data.data)) {
            setCities(data.data);
            setSelectedCity(null); // Resetear la ciudad seleccionada
          } else {
            console.error("Invalid cities response:", data);
          }
        })
        .catch((error) => console.error("Error fetching cities:", error));
    }
  }, [selectedRegion]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !address || !phone || !selectedCountry || !selectedRegion || !selectedCity) {
      alert("Por favor, completa todos los campos");
      return;
    }

    const payload = {
      userId: session?.user.id,
      name,
      address,
      phone,
      cityId: selectedCity,
    };

    try {
      const response = await fetch("/api/userInfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Información guardada exitosamente");
        console.log("Respuesta del servidor:", result);
      } else {
        alert("Hubo un error al guardar la información");
        console.error("Error del servidor:", result.error);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Hubo un error al enviar los datos");
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <div className="relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="name"
              placeholder="John Doe"
              className="pl-10"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        {/* Dirección */}
        <div className="space-y-2">
          <Label htmlFor="address">Dirección</Label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="address"
              placeholder="123 Main St"
              className="pl-10"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* País, Región y Ciudad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Select onValueChange={(value) => setSelectedCountry(Number(value))}>
              <SelectTrigger id="country">
                <SelectValue placeholder="Selecciona un país" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.country_id} value={String(country.country_id)}>
                    {country.country_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region">Región</Label>
            <Select
              onValueChange={(value) => setSelectedRegion(Number(value))}
              disabled={!selectedCountry}
            >
              <SelectTrigger id="region">
                <SelectValue placeholder="Selecciona una región" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.region_id} value={String(region.region_id)}>
                    {region.region_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ciudad</Label>
            <Select
              onValueChange={(value) => setSelectedCity(Number(value))}
              disabled={!selectedRegion}
            >
              <SelectTrigger id="city">
                <SelectValue placeholder="Selecciona una ciudad" />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city.city_id} value={String(city.city_id)}>
                    {city.city_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <div className="relative">
            <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              className="pl-10"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>

        {/* Botón de enviar */}
        <Button type="submit" className="w-full">
          Guardar Información
        </Button>
      </form>
    </div>
  );
}
