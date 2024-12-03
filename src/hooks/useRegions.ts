import { useEffect, useState } from "react";

export const useRegions = (countryId: string | null) => {
  const [regions, setRegions] = useState<{ region_id: number; region_name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!countryId) {
      setRegions([]);
      return;
    }

    const fetchRegions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/region?country_id=${countryId}`);
        const data = await response.json();
        if (data.status === 200 && Array.isArray(data.data)) {
          setRegions(data.data);
        }
      } catch (error) {
        console.error("Error fetching regions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegions();
  }, [countryId]);

  return { regions, isLoading };
};
