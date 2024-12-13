import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCountries, useRegions, useCities } from "@/hooks";
import { EditableField, EditableSelect } from "@/components/checkout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GuestUserFormSchema } from "../../../schemas";

type GuestUserFormValues = z.infer<typeof GuestUserFormSchema>;

export default function UserInfoForm({
  onBack,
  onFormValidityChange,
  onSubmit,
  isGuest = false,
}: {
  onBack: () => void;
  onFormValidityChange: (isValid: boolean) => void;
  onSubmit: (data: Omit<GuestUserFormValues, "city"> & { city: number; user_id?: string }) => Promise<void>;
  isGuest?: boolean;
}) {
  const { data: session } = useSession();
  const countries = useCountries();

  const methods = useForm<GuestUserFormValues & { country: string; region: string }>({
    resolver: zodResolver(GuestUserFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      country: "",
      region: "",
      city: "",
    },
  });

  const { isValid } = methods.formState;
  const { watch, handleSubmit, control, reset } = methods;

  const country = watch("country");
  const region = watch("region");
  const city = watch("city");

  const { regions } = useRegions(country);
  const { cities } = useCities(region);

  const [isEditing, setIsEditing] = useState(isGuest || !session); // Si es invitado, empieza en modo edición
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    onFormValidityChange(isValid);
  }, [isValid, onFormValidityChange]);

  useEffect(() => {
    if (!session || isGuest) {
      setIsLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const userResponse = await fetch(`/api/auth/user/${session.user.id}`);
        const userData = await userResponse.json();

        if (!userData) return;

        const initialData = {
          name: userData.name || "",
          phone: userData.user_phone_number || "",
          email: userData.email || "",
          address: "",
          country: "",
          region: "",
          city: "",
        };

        if (userData.user_address_id) {
          const addressResponse = await fetch(
            `/api/userAddress?user_address_id=${userData.user_address_id}`
          );
          const addressData = await addressResponse.json();

          if (addressData.status === 200 && addressData.data) {
            initialData.address = addressData.data.street || "";
            initialData.country = addressData.data.country || "";
            initialData.region = addressData.data.region || "";
            initialData.city = addressData.data.city || "";
          }
        }

        reset(initialData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user?.id, reset, isGuest]);

  const onCancel = () => {
    reset();
    setIsEditing(false); // Volver a solo lectura
  };

  const handleSave = async (data: any) => {
    const payload = {
      ...data,
      city: Number(data.city), // Convertir city a número
      user_id: session?.user?.id, // Agregar user_id al payload
    };
  
    await onSubmit(payload);
  
    // Recargar las opciones dinámicas para asegurar la consistencia
    const updatedRegions = useRegions(data.country).regions;
    const updatedCities = useCities(data.region).cities;
  
    // Encontrar etiquetas correspondientes para país, región y ciudad
    const updatedData = {
      ...data,
      country: getLabel(
        countries.map((c) => ({
          value: c.country_id.toString(),
          label: c.country_name,
        })),
        data.country
      ),
      region: getLabel(
        updatedRegions.map((r) => ({
          value: r.region_id.toString(),
          label: r.region_name,
        })),
        data.region
      ),
      city: getLabel(
        updatedCities.map((c) => ({
          value: c.city_id.toString(),
          label: c.city_name,
        })),
        data.city
      ),
    };
  
    // Actualizar los valores en el formulario
    reset(updatedData);
  
    setIsEditing(false); // Cambiar a modo solo lectura
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-32" />
      </div>
    );
  }

  const getLabel = (options: { value: string; label: string }[], value: string) =>
    options.find((option) => option.value === value)?.label || value;

  return (
    <div>
      <h1 className="text-2xl font-bold pb-2">
        {session ? "Información del usuario" : "Información para envío"}
      </h1>
      {isEditing ? (
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
            <EditableField name="name" label="Nombre" placeholder="José Valdera" control={control} />
            <EditableField name="phone" label="Teléfono" placeholder="+(56)123456789" control={control} />
            <EditableField name="email" label="Email" placeholder="correo@ejemplo.com" control={control} />
            <EditableField name="address" label="Dirección" placeholder="Calle Bernardo O`Higgins 1127" control={control} />
            <EditableSelect
              name="country"
              label="País"
              options={countries.map((c) => ({
                value: c.country_id.toString(),
                label: c.country_name,
              }))}
              control={control}
            />
            <EditableSelect
              name="region"
              label="Región"
              options={regions.map((r) => ({
                value: r.region_id.toString(),
                label: r.region_name,
              }))}
              control={control}
              disabled={!country}
            />
            <EditableSelect
              name="city"
              label="Ciudad"
              options={cities.map((c) => ({
                value: c.city_id.toString(),
                label: c.city_name,
              }))}
              control={control}
              disabled={!region}
            />
            <div className="flex justify-between">
              <Button onClick={onCancel} type="button" className="bg-gray-300 text-black">
                Cancelar
              </Button>
              <Button type="submit" className="bg-black text-white">
                Guardar Información
              </Button>
            </div>
          </form>
        </FormProvider>
      ) : (
        <div>
          <p>
            <strong>Nombre:</strong> {watch("name")}
          </p>
          <p>
            <strong>Teléfono:</strong> {watch("phone")}
          </p>
          <p>
            <strong>Email:</strong> {watch("email")}
          </p>
          <p>
            <strong>Dirección:</strong> {watch("address")}
          </p>
          <p>
            <strong>País:</strong>{" "}
            {getLabel(
              countries.map((c) => ({
                value: c.country_id.toString(),
                label: c.country_name,
              })),
              country
            )}
          </p>
          <p>
            <strong>Región:</strong>{" "}
            {getLabel(
              regions.map((r) => ({
                value: r.region_id.toString(),
                label: r.region_name,
              })),
              region
            )}
          </p>
          <p>
            <strong>Ciudad:</strong>{" "}
            {getLabel(
              cities.map((c) => ({
                value: c.city_id.toString(),
                label: c.city_name,
              })),
              city
            )}
          </p>
          <div className="flex justify-between mt-4">
            <Button onClick={onBack} type="button" className="bg-gray-300 text-black">
              Regresar
            </Button>
            <Button onClick={() => setIsEditing(true)} className="bg-black text-white">
              Modificar información
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
