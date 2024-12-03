import { useEffect, useState } from "react";

export const useCountries = () => {
  const [countries, setCountries] = useState<{ country_id: number; country_name: string }[]>([]);

  useEffect(() => {
    fetch("/api/country")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200 && Array.isArray(data.data)) {
          setCountries(data.data);
        }
      });
  }, []);

  return countries;
};
