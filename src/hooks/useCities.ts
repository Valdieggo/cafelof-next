import { useEffect, useState } from "react";

export const useCities = (regionId: string | null) => {
  const [cities, setCities] = useState<{ city_id: number; city_name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!regionId) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/city?region_id=${regionId}`);
        const data = await response.json();
        if (data.status === 200 && Array.isArray(data.data)) {
          setCities(data.data);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCities();
  }, [regionId]);

  return { cities, isLoading };
};
