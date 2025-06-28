
import { useState, useEffect } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface City {
  name: string;
  latitude: number;
  longitude: number;
}

const UK_CITIES: City[] = [
  { name: 'London', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Manchester', latitude: 53.4808, longitude: -2.2426 },
  { name: 'Birmingham', latitude: 52.4862, longitude: -1.8904 },
  { name: 'Liverpool', latitude: 53.4084, longitude: -2.9916 },
  { name: 'Leeds', latitude: 53.8008, longitude: -1.5491 },
  { name: 'Sheffield', latitude: 53.3811, longitude: -1.4701 },
  { name: 'Bristol', latitude: 51.4545, longitude: -2.5879 },
  { name: 'Newcastle', latitude: 54.9783, longitude: -1.6178 },
  { name: 'Nottingham', latitude: 52.9548, longitude: -1.1581 },
  { name: 'Edinburgh', latitude: 55.9533, longitude: -3.1883 },
];

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const useGeolocation = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [closestCity, setClosestCity] = useState<string>('London');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(coords);
          
          // Find closest city
          let minDistance = Infinity;
          let closest = 'London';
          
          UK_CITIES.forEach(city => {
            const distance = calculateDistance(
              coords.latitude,
              coords.longitude,
              city.latitude,
              city.longitude
            );
            if (distance < minDistance) {
              minDistance = distance;
              closest = city.name;
            }
          });
          
          setClosestCity(closest);
          setLoading(false);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Default to London if geolocation fails
          setClosestCity('London');
          setLoading(false);
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    } else {
      setClosestCity('London');
      setLoading(false);
    }
  }, []);

  const getCityDistance = (cityName: string): number => {
    if (!userLocation) return 0;
    
    const city = UK_CITIES.find(c => c.name === cityName);
    if (!city) return Infinity;
    
    return calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      city.latitude,
      city.longitude
    );
  };

  const sortCitiesByDistance = (cities: string[]): string[] => {
    if (!userLocation) return cities;
    
    return cities.sort((a, b) => {
      const distanceA = getCityDistance(a);
      const distanceB = getCityDistance(b);
      return distanceA - distanceB;
    });
  };

  return {
    userLocation,
    closestCity,
    loading,
    getCityDistance,
    sortCitiesByDistance
  };
};
