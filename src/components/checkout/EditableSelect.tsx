import React from "react";
import { Control, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditableSelectProps {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  control: Control<any>;
  disabled?: boolean;
}

export const EditableSelect: React.FC<EditableSelectProps> = ({
  name,
  label,
  options,
  control,
  disabled = false,
}) => {
  return (
    <div className="form-item">
      <label className="form-label">{label}</label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selectedLabel = options.find((o) => o.value === field.value)?.label || "";
          return (
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Selecciona ${label.toLowerCase()}`}>
                  {selectedLabel}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        }}
      />
    </div>
  );
};
