import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface EditableFieldProps {
  name: string;
  label: string;
  placeholder: string;
  control: any; // Replace with the correct type from `react-hook-form`.
}

export const EditableField: React.FC<EditableFieldProps> = ({ name, label, placeholder, control }) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input id={name} placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
