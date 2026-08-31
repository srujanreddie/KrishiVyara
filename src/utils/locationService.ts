import { CurrentWeatherState, WeatherForecastDay } from '../types';

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

type ForecastCondition = 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Light Rain' | 'Heavy Rain' | 'Thunderstorm';

function mapWmoCodeClient(code: number): { condition: ForecastCondition; icon: string; isRain: boolean } {
  if (code === 0) return { condition: 'Sunny', icon: 'sun', isRain: false };
  if (code === 1 || code === 2) return { condition: 'Partly Cloudy', icon: 'partly-cloudy', isRain: false };
  if (code === 3) return { condition: 'Cloudy', icon: 'cloudy', isRain: false };
  if (code >= 45 && code <= 48) return { condition: 'Cloudy', icon: 'cloudy', isRain: false };
  if (code >= 51 && code <= 55) return { condition: 'Light Rain', icon: 'rain', isRain: true };
  if (code >= 61 && code <= 65) return { condition: 'Light Rain', icon: 'rain', isRain: true };
  if (code >= 71 && code <= 77) return { condition: 'Cloudy', icon: 'cloudy', isRain: false };
  if (code >= 80 && code <= 82) return { condition: 'Heavy Rain', icon: 'rain', isRain: true };
  if (code >= 95 && code <= 99) return { condition: 'Thunderstorm', icon: 'thunderstorm', isRain: true };
  return { condition: 'Partly Cloudy', icon: 'partly-cloudy', isRain: false };
}

/**
 * Direct Open-Meteo Client Fallback when local API proxy is unavailable or during offline/network edge cases
 */
async function fetchDirectOpenMeteoWeather(
  latitude: number,
  longitude: number,
  locationName: string
): Promise<CurrentWeatherState | undefined> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m,wind_direction_10m&hourly=precipitation_probability,precipitation,temperature_2m,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto&forecast_days=6`;

    const res = await fetch(url);
    if (!res.ok) return undefined;
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) return undefined;

    const data = await res.json();
    const current = data.current || {};
    const daily = data.daily || {};
    const hourly = data.hourly || {};

    const temp = Math.round(current.temperature_2m ?? 28);
    const humidity = Math.round(current.relative_humidity_2m ?? 70);
    const windSpeed = Math.round(current.wind_speed_10m ?? 10);
    const weatherCode = current.weather_code ?? 1;
    const wmoInfo = mapWmoCodeClient(weatherCode);

    const currentHourIndex = new Date().getHours();
    const next4HoursProb = hourly.precipitation_probability
      ? Math.max(...hourly.precipitation_probability.slice(currentHourIndex, currentHourIndex + 4), 0)
      : (wmoInfo.isRain ? 80 : 15);

    const isRainImminent = next4HoursProb >= 50 || (current.precipitation && current.precipitation > 0.3) || wmoInfo.isRain;
    const isHeatWaveRisk = temp >= 37 || (daily.temperature_2m_max && daily.temperature_2m_max[0] >= 38);

    const dangerAlerts: CurrentWeatherState['dangerAlerts'] = [];

    if (isRainImminent) {
      dangerAlerts.push({
        type: 'rain_wash',
        severity: 'danger',
        title: `🚨 RAIN WASH ALARM: ${next4HoursProb}% Chance of Downpour!`,
        description: 'Do NOT spray any chemical pesticides, fungicides, or foliar fertilizers today. Heavy rainfall will wash chemicals into the soil and waste your investment.',
        actionNeeded: 'Postpone all field sprays until clear dry weather is confirmed.'
      });
    }

    if (isHeatWaveRisk) {
      dangerAlerts.push({
        type: 'heat_pest_spike',
        severity: 'warning',
        title: `🔥 HEAT SPIKE WARNING: ${temp}°C Field Temperature!`,
        description: 'Intense heat accelerates the reproduction cycles of Thrips, Mites, and Whiteflies by 35-50%.',
        actionNeeded: 'Inspect crop leaf undersides early morning. Maintain root zone moisture through drip irrigation.'
      });
    }

    if (windSpeed >= 18) {
      dangerAlerts.push({
        type: 'high_wind',
        severity: 'warning',
        title: `💨 HIGH WIND DRIFT HAZARD: ${windSpeed} km/h Wind Speed`,
        description: 'Strong gusts cause severe spray drift, missing target foliage and risking adjacent crops.',
        actionNeeded: 'Wait until wind drops below 12 km/h before spraying.'
      });
    }

    if (!isRainImminent && windSpeed < 15 && temp < 36) {
      dangerAlerts.push({
        type: 'optimal_spray',
        severity: 'info',
        title: '🌤️ Favorable Field Window Available',
        description: `Calm conditions (Wind: ${windSpeed} km/h, Temp: ${temp}°C). Safe for pest/disease treatments.`,
        actionNeeded: 'Spray during early morning or late afternoon for best absorption.'
      });
    }

    const forecastDays: WeatherForecastDay[] = [];
    if (daily.time && Array.isArray(daily.time)) {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      for (let i = 0; i < Math.min(daily.time.length, 6); i++) {
        const dateObj = new Date(daily.time[i]);
        const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[dateObj.getDay()];
        const dateFormatted = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayCode = daily.weather_code ? daily.weather_code[i] : 1;
        const dayWmo = mapWmoCodeClient(dayCode);
        const dayMax = Math.round(daily.temperature_2m_max ? daily.temperature_2m_max[i] : temp + 2);
        const dayMin = Math.round(daily.temperature_2m_min ? daily.temperature_2m_min[i] : temp - 5);
        const dayRainProb = daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 20;
        const dayWind = Math.round(daily.wind_speed_10m_max ? daily.wind_speed_10m_max[i] : windSpeed);

        let suitability: 'excellent' | 'moderate' | 'poor' | 'danger' = 'excellent';
        let advice = 'Favorable weather conditions for spraying.';
        if (dayRainProb >= 50 || dayWmo.isRain) {
          suitability = 'danger';
          advice = 'High rain risk! Avoid foliar sprays to prevent chemical wash-off.';
        } else if (dayWind >= 18 || dayMax >= 37) {
          suitability = 'poor';
          advice = 'Spray early in the morning before heat and winds rise.';
        } else if (dayRainProb >= 30) {
          suitability = 'moderate';
          advice = 'Moderate spray conditions. Monitor wind speed and rain clouds.';
        }

        forecastDays.push({
          day: dayLabel,
          date: dateFormatted,
          tempMax: dayMax,
          tempMin: dayMin,
          humidity,
          rainProbability: dayRainProb,
          windSpeedKmh: dayWind,
          condition: dayWmo.condition,
          icon: dayWmo.icon,
          spraySuitability: suitability,
          sprayAdvice: advice
        });
      }
    }

    return {
      temperature: temp,
      humidity,
      windSpeedKmh: windSpeed,
      rainProbabilityNext4h: next4HoursProb,
      isHeatWaveRisk,
      isRainImminent,
      condition: wmoInfo.condition,
      locationName,
      latitude,
      longitude,
      isAutoDetected: true,
      lastUpdatedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dangerAlerts,
      forecast: forecastDays
    };
  } catch (directErr) {
    console.warn('Direct Open-Meteo sync failed:', directErr);
    return undefined;
  }
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
      const contentType = ipRes.headers.get('content-type');
      if (ipRes.ok && contentType && contentType.includes('application/json')) {
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
    const contentType = revRes.headers.get('content-type');
    if (revRes.ok && contentType && contentType.includes('application/json')) {
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
    console.warn('Reverse geocode fetch failed, using coordinate name fallback:', revError);
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
    const contentType = weatherRes.headers.get('content-type');
    if (weatherRes.ok && contentType && contentType.includes('application/json')) {
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
    } else {
      // Fallback directly to Open-Meteo client-side fetch if /api/weather returned non-JSON/error
      weatherData = await fetchDirectOpenMeteoWeather(coords.latitude, coords.longitude, locationDetails.formattedName);
    }
  } catch (weatherErr) {
    console.warn('Backend weather fetch failed, attempting client-side Open-Meteo sync:', weatherErr);
    weatherData = await fetchDirectOpenMeteoWeather(coords.latitude, coords.longitude, locationDetails.formattedName);
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
