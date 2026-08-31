import { CurrentWeatherState, UserProfile } from '../types';

export interface LocationDetectionResult {
  success: boolean;
  latitude: number;
  longitude: number;
  accuracyMeters: number;
  village: string;
  district: string;
  state: string;
  country: string;
  formattedName: string;
  isGps: boolean;
  weather?: CurrentWeatherState;
  error?: string;
}

/**
 * Perform high-accuracy browser GPS location detection with reverse geocoding
 * and fallback to IP-based location if GPS is unavailable or blocked.
 */
export async function detectLocationAndWeather(
  onProgress?: (stage: 'locating_gps' | 'reverse_geocoding' | 'fetching_weather') => void
): Promise<LocationDetectionResult> {
  // Step 1: Attempt Browser Geolocation
  let coords: { latitude: number; longitude: number; accuracy: number; isGps: boolean } | null = null;

  if (onProgress) onProgress('locating_gps');

  if (typeof window !== 'undefined' && 'geolocation' in navigator) {
    try {
      coords = await new Promise<{ latitude: number; longitude: number; accuracy: number; isGps: boolean }>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              resolve({
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude,
                accuracy: Math.round(pos.coords.accuracy || 15),
                isGps: true
              });
            },
            (err) => {
              reject(err);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 60000
            }
          );
        }
      );
    } catch (gpsError) {
      console.warn('Browser GPS detection failed or permission denied, trying IP fallback...', gpsError);
    }
  }

  // If GPS failed or was unavailable, try IP location fallback
  if (!coords) {
    try {
      const ipRes = await fetch('/api/location/ip');
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.success && ipData.location) {
          coords = {
            latitude: ipData.location.latitude || 19.9975,
            longitude: ipData.location.longitude || 73.7898,
            accuracy: 2500, // IP accuracy in meters
            isGps: false
          };
        }
      }
    } catch (ipError) {
      console.warn('IP fallback failed:', ipError);
    }
  }

  // Fallback to default agricultural coordinates if all failed
  if (!coords) {
    coords = {
      latitude: 19.9975,
      longitude: 73.7898,
      accuracy: 5000,
      isGps: false
    };
  }

  // Step 2: Reverse Geocode coordinates to Village, District, State
  if (onProgress) onProgress('reverse_geocoding');
  let locationDetails = {
    village: 'Local Village',
    district: 'Farm District',
    state: 'Agricultural State',
    country: 'India',
    formattedName: `Field (${coords.latitude.toFixed(2)}°N, ${coords.longitude.toFixed(2)}°E)`
  };

  try {
    const revRes = await fetch(`/api/location/reverse?lat=${coords.latitude}&lon=${coords.longitude}`);
    if (revRes.ok) {
      const revData = await revRes.json();
      if (revData.success && revData.location) {
        locationDetails = {
          village: revData.location.village,
          district: revData.location.district,
          state: revData.location.state,
          country: revData.location.country,
          formattedName: revData.location.formattedName
        };
      }
    }
  } catch (revError) {
    console.error('Reverse geocode fetch failed:', revError);
  }

  // Step 3: Fetch live Agro-Weather and danger alarms for the detected coordinates
  if (onProgress) onProgress('fetching_weather');
  let weatherData: CurrentWeatherState | undefined;

  try {
    const weatherRes = await fetch(
      `/api/weather?lat=${coords.latitude}&lon=${coords.longitude}&locationName=${encodeURIComponent(
        locationDetails.formattedName
      )}`
    );
    if (weatherRes.ok) {
      const wData = await weatherRes.json();
      if (wData.success && wData.weather) {
        weatherData = {
          ...wData.weather,
          latitude: coords.latitude,
          longitude: coords.longitude,
          locationAccuracyMeters: coords.accuracy,
          isAutoDetected: true,
          locationName: locationDetails.formattedName,
          lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
    }
  } catch (weatherErr) {
    console.error('Live weather sync failed:', weatherErr);
  }

  return {
    success: true,
    latitude: coords.latitude,
    longitude: coords.longitude,
    accuracyMeters: coords.accuracy,
    village: locationDetails.village,
    district: locationDetails.district,
    state: locationDetails.state,
    country: locationDetails.country,
    formattedName: locationDetails.formattedName,
    isGps: coords.isGps,
    weather: weatherData
  };
}
