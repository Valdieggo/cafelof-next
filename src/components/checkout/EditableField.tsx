import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EditableFieldProps {
  name: string;
  label: string;
  placeholder: string;
  control: any; // Replace with the correct type from `react-hook-form`.
  disabled?: boolean; // Agregado: Prop opcional para desactivar el campo
}

export const EditableField: React.FC<EditableFieldProps> = ({ name, label, placeholder, control, disabled }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input 
            id={name} 
            placeholder={placeholder} 
            disabled={disabled} // Agregado: Desactiva el campo si se pasa el prop
            {...field} 
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
