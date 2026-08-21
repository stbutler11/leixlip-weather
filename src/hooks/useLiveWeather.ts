import { useState, useEffect, useCallback } from 'react';
import { fetchLiveLeixlipWeather, LiveWeatherData, LOCATIONS } from '../services/weatherApi';

export function useLiveWeather(initialLocation: keyof typeof LOCATIONS = 'leixlip') {
  const [locationKey, setLocationKey] = useState<keyof typeof LOCATIONS>(initialLocation);
  const [data, setData] = useState<LiveWeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshedAt, setLastRefreshedAt] = useState<Date>(new Date());

  const loadWeather = useCallback(async (locKey = locationKey) => {
    setLoading(true);
    setError(null);
    try {
      const weather = await fetchLiveLeixlipWeather(locKey);
      setData(weather);
      setLastRefreshedAt(new Date());
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Unable to reach Open-Meteo API. Showing Kildare telemetry.');
    } finally {
      setLoading(false);
    }
  }, [locationKey]);

  useEffect(() => {
    loadWeather(locationKey);

    // Auto-refresh every 10 minutes
    const interval = setInterval(() => {
      loadWeather(locationKey);
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [locationKey, loadWeather]);

  const changeLocation = (loc: keyof typeof LOCATIONS) => {
    setLocationKey(loc);
  };

  return {
    data,
    loading,
    error,
    lastRefreshedAt,
    locationKey,
    changeLocation,
    refresh: () => loadWeather(locationKey),
  };
}
