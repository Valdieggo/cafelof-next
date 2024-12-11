import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCountries, useRegions, useCities } from "@/hooks";
import { EditableField, EditableSelect } from "@/components/checkout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserFormSchema } from "../../../schemas";

export default function UserInfoForm({
  onBack,
  onFormValidityChange,
}: {
  onBack: () => void;
  onFormValidityChange: (isValid: boolean) => void;
  onConfirm: () => void;
}) {
  const { data: session } = useSession();
  const countries = useCountries();

  const methods = useForm<z.infer<typeof UserFormSchema>>({
    resolver: zodResolver(UserFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      phone: "",
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
  const { regions } = useRegions(country);
  const { cities } = useCities(region);

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<any>(null);

  useEffect(() => {
    onFormValidityChange(isValid);
  }, [isValid, onFormValidityChange]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user?.id) return;

      try {
        const userResponse = await fetch(`/api/auth/user/${session.user.id}`);
        const userData = await userResponse.json();

        if (!userData) return;

        const initialData = {
          name: userData.name || "",
          phone: userData.user_phone_number || "",
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

        setInitialValues(initialData);
        reset(initialData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user?.id, reset]);

  const onSubmit = async (values: z.infer<typeof UserFormSchema>) => {
    try {
      const payload = {
        user_id: session?.user?.id,
        user_phone_number: values.phone,
        name: values.name,
        user_address_street: values.address,
        city_id: parseInt(values.city, 10),
      };
  
      const response = await fetch("/api/auth/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        const result = await response.json();
        console.error(result.message);
        alert("Hubo un error al guardar la información.");
        return;
      }
  
      // Procesar respuesta exitosa
      const updatedData = {
        ...values,
        country: countries.find((c) => c.country_id.toString() === values.country)?.country_name || values.country,
        region: regions.find((r) => r.region_id.toString() === values.region)?.region_name || values.region,
        city: cities.find((c) => c.city_id.toString() === values.city)?.city_name || values.city,
      };
  
      alert("Información guardada con éxito.");
      setInitialValues(updatedData);
      reset(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error interno al guardar la información:", error);
      alert("Error interno del servidor.");
    }
  };    

  const onCancel = () => {
    if (initialValues) {
      reset(initialValues);
      setIsEditing(false);
    }
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

  return (
    <div>
      <h1 className="text-2xl font-bold pb-2">Información para envío</h1>
      <FormProvider {...methods}>
        {!isEditing ? (
          <div>
            <p>
              <strong>Nombre:</strong> {watch("name")}
            </p>
            <p>
              <strong>Teléfono:</strong> {watch("phone")}
            </p>
            <p>
              <strong>Dirección:</strong> {watch("address")}
            </p>
            <p>
              <strong>País:</strong> {watch("country")}
            </p>
            <p>
              <strong>Región:</strong> {watch("region")}
            </p>
            <p>
              <strong>Ciudad:</strong> {watch("city")}
            </p>
            <div className="flex justify-between mt-4">
              <Button onClick={onBack} type="button" className="bg-gray-300 text-black">
                Regresar
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                type="button"
                className="bg-gray-300 text-black"
              >
                Modificar información
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <EditableField name="name" label="Nombre" placeholder="John Doe" control={control} />
            <EditableField name="phone" label="Teléfono" placeholder="+(56)123456789" control={control} />
            <EditableField name="address" label="Dirección" placeholder="123 Main St" control={control} />
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
        )}
      </FormProvider>
    </div>
  );
}
