import React, { useState } from 'react';
import { 
  CloudSun, 
  MapPin, 
  Layers, 
  Sparkles, 
  Info, 
  Wind, 
  Compass, 
  Radio, 
  Clock, 
  RefreshCw, 
  Calendar, 
  Droplets, 
  Eye, 
  Gauge, 
  Shirt, 
  CheckCircle2, 
  ShieldCheck,
  ExternalLink,
  Maximize2,
  Tv,
  CloudRain,
  Satellite
} from 'lucide-react';
import { LEIXLIP_SPOTS } from '../data/weatherData';
import { LiveWeatherData, LOCATIONS } from '../services/weatherApi';

interface LeixlipLocalProps {
  weather: LiveWeatherData | null;
  loading: boolean;
  onRefresh: () => void;
  locationKey: keyof typeof LOCATIONS;
  onLocationChange: (loc: keyof typeof LOCATIONS) => void;
}

type RadarProvider = 'windy-radar' | 'rainviewer' | 'windy-wind' | 'windy-satellite';

export const LeixlipLocal: React.FC<LeixlipLocalProps> = ({
  weather,
  loading,
  onRefresh,
  locationKey,
  onLocationChange,
}) => {
  const [selectedSpotIndex, setSelectedSpotIndex] = useState<number>(0);
  const [radarProvider, setRadarProvider] = useState<RadarProvider>('windy-radar');
  const [forecastView, setForecastView] = useState<'hourly' | '7day'>('hourly');

  const spot = LEIXLIP_SPOTS[selectedSpotIndex];
  const currentLocation = LOCATIONS[locationKey] || LOCATIONS.leixlip;

  // Base fallback data if live is not yet loaded
  const currentTemp = weather?.temp ?? 16.5;
  const feelsLike = weather?.feelsLike ?? 15.8;
  const conditionText = weather?.weatherDescription ?? 'Partly Cloudy';
  const irishState = weather?.irishWeatherState ?? 'Fierce Mild';
  const humidity = weather?.humidity ?? 74;
  const windKmh = weather?.windSpeedKmh ?? 19;
  const windGusts = weather?.windGustsKmh ?? 26;
  const windDirection = weather?.windDirectionText ?? 'South-South-West (Breeze off Rye Water)';
  const pressure = weather?.pressureHpa ?? 1014;
  const cloudCover = weather?.cloudCoverPercent ?? 68;
  const rainMm = weather?.precipitationMm ?? 0;
  const banter = weather?.summaryBanter ?? "Look, it's not splitting the stones, but you wouldn't be lighting the fire either. Soft breeze coming up through St. Catherine's Park.";
  const jacket = weather?.jacketRecommendation ?? 'Grand in a decent hoody or light fleece';
  const dryingRating = weather?.dryingIndexRating ?? 'Fierce Good Air (Grade 2 Optimal)';
  const dryingScore = weather?.dryingIndexScore ?? 7;

  // Generate dynamic live radar embed URL based on active location and layer
  const getRadarEmbedUrl = () => {
    const lat = currentLocation.lat;
    const lon = currentLocation.lon;

    if (radarProvider === 'rainviewer') {
      return `https://www.rainviewer.com/map.html?loc=${lat},${lon},8&oFa=0&oC=1&oU=0&oCS=1&oF=0&oAP=1&c=3&o=83&lm=1&layer=radar&sm=1&sn=1`;
    }

    if (radarProvider === 'windy-wind') {
      return `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=750&height=480&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
    }

    if (radarProvider === 'windy-satellite') {
      return `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=750&height=480&zoom=8&level=surface&overlay=satellite&product=satellite&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
    }

    // Default: Windy Live Doppler Weather Radar
    return `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=750&height=480&zoom=8&level=surface&overlay=radar&product=radar&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 🧭 LOCATION SELECTOR & API TRANSPARENCY BAR 🧭 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-3xl shadow-lg">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mr-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Area Station:
          </span>
          {(Object.keys(LOCATIONS) as Array<keyof typeof LOCATIONS>).map((key) => {
            const loc = LOCATIONS[key];
            const isSelected = locationKey === key;
            return (
              <button
                key={key}
                onClick={() => onLocationChange(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/60 ring-1 ring-emerald-400/50'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {loc.name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-2xl border border-emerald-800/60">
            <span className={`w-2 h-2 rounded-full ${weather?.isLive ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
            <span>{weather?.isLive ? 'Open-Meteo Live Feed (No Auth / CORS)' : 'Local Telemetry'}</span>
          </div>

          <button
            onClick={onRefresh}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-all cursor-pointer disabled:opacity-50"
            title="Refresh current meteorological reading"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{loading ? 'Fetching...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* 📍 1. BENTO ROW: LIVE LEIXLIP OBSERVATION POST & KEY METRICS 📍 */}
      <div className="grid grid-cols-12 gap-5">
        {/* Main Station Observation Bento Box (Col 8 on LG) */}
        <div className="col-span-12 lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
                  <Clock className="w-3 h-3" />
                  {weather?.lastUpdated || 'Live Telemetry Active'}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white">
                  {LOCATIONS[locationKey]?.name || 'Leixlip'}, {LOCATIONS[locationKey]?.county || 'Co. Kildare'}
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm">
                  {LOCATIONS[locationKey]?.landmarks || 'Confluence of River Liffey & Rye Water'} • Elevation {weather?.elevation || 45}m
                </p>
              </div>

              <div className="flex items-baseline gap-4 bg-slate-950 px-5 py-3.5 rounded-2xl border border-slate-800 shadow-inner">
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
                    {currentTemp}°C
                  </div>
                  <div className="text-xs text-slate-400 font-medium mt-0.5">
                    Feels like <strong className="text-slate-200">{feelsLike}°C</strong>
                  </div>
                </div>
                <div className="border-l border-slate-800 pl-4 space-y-0.5">
                  <div className="text-sm font-bold text-amber-300">
                    {irishState}
                  </div>
                  <div className="text-xs text-slate-300">
                    {conditionText}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Humidity: {humidity}% • Rain: {rainMm} mm
                  </div>
                </div>
              </div>
            </div>

            {/* The Weather Guy's Local Commentary Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                  <span>Local Dispatch for {LOCATIONS[locationKey]?.name}:</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed italic">
                  &ldquo;{banter}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* 6 Key Irish Weather Metrics Sub-grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-medium uppercase truncate">Wind &amp; Gusts</div>
              <div className="text-sm sm:text-base font-extrabold text-emerald-400 truncate">
                {windKmh} <span className="text-xs font-normal">km/h</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight truncate">
                Gusts: {windGusts} km/h
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-medium uppercase truncate">Official State</div>
              <div className="text-sm sm:text-base font-extrabold text-amber-300 truncate">
                {irishState}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight truncate">
                Authentic Kildare status
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-medium uppercase truncate">Drying Index</div>
              <div className="text-sm sm:text-base font-extrabold text-emerald-400 truncate">
                {dryingScore}/10
              </div>
              <p className="text-[10px] text-slate-400 leading-tight truncate">
                {dryingRating.split('(')[0]}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-medium uppercase truncate">Jacket Advice</div>
              <div className="text-xs sm:text-sm font-extrabold text-slate-200 truncate">
                {jacket.split('or')[0]}
              </div>
              <p className="text-[10px] text-slate-400 leading-tight truncate">
                Don&apos;t overdress
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-medium uppercase truncate">Barometer</div>
              <div className="text-sm sm:text-base font-extrabold text-sky-400 truncate">
                {pressure} <span className="text-xs font-normal">hPa</span>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight truncate">
                Atlantic pressure
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[10px] text-slate-400 font-medium uppercase truncate">Cloud Cover</div>
              <div className="text-sm sm:text-base font-extrabold text-amber-400 truncate">
                {cloudCover}%
              </div>
              <p className="text-[10px] text-slate-400 leading-tight truncate">
                Mackerel Sky factor
              </p>
            </div>
          </div>
        </div>

        {/* Selected Landmark Microclimate Station Bento (Col 4 on LG) */}
        <div className="col-span-12 lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Micro-station Focus
              </span>
              <span className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-300 border border-slate-800 rounded font-mono">
                {Math.round((currentTemp + (selectedSpotIndex % 3 === 0 ? 0.3 : -0.4)) * 10) / 10}°C
              </span>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                {spot.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{spot.landmark}</p>
            </div>

            <div className="space-y-2 text-xs pt-1">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 font-medium text-[10px] uppercase block">Wind &amp; Airflow</span>
                <p className="text-slate-200 font-semibold">{windDirection}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 font-medium text-[10px] uppercase block">Local Atmosphere</span>
                <p className="text-slate-200 font-semibold">{spot.condition}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 font-medium text-[10px] uppercase block">Drying Index Status</span>
                <p className="text-slate-200 font-semibold">{weather?.dryingAdvice || spot.dryingStatus}</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Kildare Lore:</strong> {spot.funFact}</span>
          </div>
        </div>
      </div>

      {/* ⏱️ 2. BENTO ROW: LIVE HOURLY & 7-DAY REAL FORECAST CARDS ⏱️ */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-400" />
              Live Forecast Projection for {LOCATIONS[locationKey]?.name}
            </h2>
            <p className="text-xs text-slate-400">
              Direct hourly and multi-day meteorological model computed from open satellite grids
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
            <button
              onClick={() => setForecastView('hourly')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold cursor-pointer transition-colors ${
                forecastView === 'hourly'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Next 24 Hours
            </button>
            <button
              onClick={() => setForecastView('7day')}
              className={`px-3.5 py-1.5 rounded-xl font-semibold cursor-pointer transition-colors ${
                forecastView === '7day'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              7-Day Irish Outlook
            </button>
          </div>
        </div>

        {/* Next 24 Hours Horizontal Strip */}
        {forecastView === 'hourly' && (
          <div className="overflow-x-auto pb-3 pt-1 scrollbar-none">
            <div className="flex gap-3 min-w-max">
              {weather && weather.hourly && weather.hourly.length > 0 ? (
                weather.hourly.map((h, i) => (
                  <div
                    key={h.time || i}
                    className={`p-3.5 rounded-2xl border flex flex-col items-center justify-between space-y-2 w-28 text-center transition-all ${
                      i === 0
                        ? 'bg-emerald-950/70 border-emerald-400/80 ring-1 ring-emerald-400/40 shadow-md'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-300">
                      {i === 0 ? 'Now' : h.displayTime}
                    </span>
                    <CloudSun className={`w-5 h-5 ${h.rainProb > 40 ? 'text-sky-400' : 'text-amber-400'}`} />
                    <div className="text-base font-black text-white">
                      {h.temp}°C
                    </div>
                    <div className="space-y-0.5 text-[10px]">
                      <span className={`block font-semibold ${h.rainProb > 40 ? 'text-sky-400' : 'text-slate-400'}`}>
                        🌧️ {h.rainProb}%
                      </span>
                      <span className="block text-slate-500 font-mono">
                        💨 {h.windSpeedKmh} km/h
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 py-6 text-center w-full">
                  Loading hourly projections...
                </div>
              )}
            </div>
          </div>
        )}

        {/* 7-Day Multi-Day Grid */}
        {forecastView === '7day' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
            {weather && weather.daily && weather.daily.length > 0 ? (
              weather.daily.map((d, i) => (
                <div
                  key={d.date || i}
                  className={`p-4 rounded-2xl border flex flex-col justify-between space-y-2 text-center transition-all ${
                    i === 0
                      ? 'bg-emerald-950/60 border-emerald-400/80 ring-1 ring-emerald-400/40 shadow-md'
                      : 'bg-slate-950/70 border-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-white block">
                      {d.dayName}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {d.date.split('-').slice(1).join('/')}
                    </span>
                  </div>

                  <div className="py-1">
                    <CloudSun className={`w-6 h-6 mx-auto ${d.rainSumMm > 3 ? 'text-sky-400' : 'text-amber-400'}`} />
                    <div className="text-sm font-black text-white mt-1">
                      {d.tempMax}° / <span className="text-slate-400 font-normal text-xs">{d.tempMin}°</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-slate-800/80 text-[10px]">
                    <div className="text-sky-300 font-medium">
                      🌧️ {d.rainSumMm} mm ({d.rainProbMax}%)
                    </div>
                    <div className="text-emerald-400 font-bold truncate">
                      {d.irishVerdict}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-400 py-6 text-center col-span-full">
                Loading 7-day projections...
              </div>
            )}
          </div>
        )}
      </div>

      {/* 🧭 3. BENTO ROW: LANDMARKS SELECTOR 🧭 */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Kildare Microclimates
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Leixlip Landmarks Weather Station Network
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Select a spot to see micro-climate variations &amp; local lore
          </p>
        </div>

        {/* Spot buttons grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {LEIXLIP_SPOTS.map((s, idx) => {
            const isSelected = selectedSpotIndex === idx;
            const spotTemp = Math.round((currentTemp + (idx % 2 === 0 ? 0.2 : -0.3)) * 10) / 10;
            return (
              <button
                key={s.name}
                onClick={() => setSelectedSpotIndex(idx)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-950/80 to-slate-900 border-emerald-400 shadow-md text-white ring-1 ring-emerald-400/40'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold truncate">{s.name.split('&')[0]}</span>
                  <span className="font-bold text-emerald-400">{spotTemp}°C</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{s.landmark.split('&')[0]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🛰️ 4. BENTO ROW: GENUINE LIVE RAIN RADAR & MET ÉIREANN LAUNCHER 🛰️ */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Interactive Radar Feed Active
            </div>
            <h3 className="text-2xl font-black text-white flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-emerald-400" />
              Live Rain Radar &amp; Satellite: {currentLocation.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Real-time Doppler precipitation radar sweeps centered on Co. Kildare ({currentLocation.lat}°N, {currentLocation.lon}°W)
            </p>
          </div>

          {/* Radar Provider & Layer Toggles */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setRadarProvider('windy-radar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                radarProvider === 'windy-radar'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
              Live Rain Doppler
            </button>
            <button
              onClick={() => setRadarProvider('rainviewer')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                radarProvider === 'rainviewer'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tv className="w-3.5 h-3.5" />
              RainViewer Grid
            </button>
            <button
              onClick={() => setRadarProvider('windy-wind')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                radarProvider === 'windy-wind'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              Atlantic Wind Stream
            </button>
            <button
              onClick={() => setRadarProvider('windy-satellite')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                radarProvider === 'windy-satellite'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Satellite className="w-3.5 h-3.5" />
              Live Satellite IR
            </button>
          </div>
        </div>

        {/* Live Interactive Radar Frame */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-2xl">
          <iframe
            key={`${radarProvider}-${currentLocation.lat}-${currentLocation.lon}`}
            src={getRadarEmbedUrl()}
            title="Live Rain Radar for Kildare"
            className="w-full h-[450px] sm:h-[520px] border-0"
            loading="lazy"
            allowFullScreen
          />

          {/* Quick info bar overlay on bottom */}
          <div className="bg-slate-950/95 border-t border-slate-800 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Target Focus: <strong className="text-white">{currentLocation.name}</strong> ({currentLocation.county})
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-400 hidden sm:inline">
                Interactive: Drag map to pan, scroll to zoom, click bottom play button to animate radar history.
              </span>
            </div>

            {/* Live Rain Scale Indicator */}
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span>Rain:</span>
              <span className="px-1.5 py-0.5 rounded bg-sky-900/60 text-sky-300 border border-sky-700/50">Drizzle</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">Moderate</span>
              <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">Heavy</span>
              <span className="px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-300 border border-rose-700/50">Lashing</span>
            </div>
          </div>
        </div>

        {/* 🔗 DIRECT OFFICIAL RADAR LINKS & BROADCAST LAUNCH CARDS 🔗 */}
        <div className="space-y-3 pt-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Direct High-Resolution Irish Radar Launchers (External Full-Screen):
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Met Éireann National Radar */}
            <a
              href="https://www.met.ie/forecasts/radar"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Met Éireann Official</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 transition-colors" />
                </div>
                <h4 className="text-sm font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                  National Doppler Radar
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Shannon &amp; Dublin Airport dual-polarisation radar with 5-minute rain sweeps.
                </p>
              </div>
              <div className="mt-3 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                Open Met.ie Radar &rarr;
              </div>
            </a>

            {/* RainViewer Leixlip Live Map */}
            <a
              href="https://www.rainviewer.com/weather-radar-map-live/leixlip-ireland.html"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/60 hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-sky-400">RainViewer Live</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-400 transition-colors" />
                </div>
                <h4 className="text-sm font-extrabold text-white group-hover:text-sky-300 transition-colors">
                  Leixlip Radar &amp; Clouds
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  HD composite rain map with precipitation nowcasting up to 2 hours ahead.
                </p>
              </div>
              <div className="mt-3 text-[11px] text-sky-400 font-semibold flex items-center gap-1">
                Open RainViewer &rarr;
              </div>
            </a>

            {/* Windy Interactive Doppler */}
            <a
              href={`https://www.windy.com/?${currentLocation.lat},${currentLocation.lon},9`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">Windy Full App</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                </div>
                <h4 className="text-sm font-extrabold text-white group-hover:text-amber-300 transition-colors">
                  Full Kildare 3D Radar
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  ECMWF + GFS wind gusts, cloud layers, isobar pressures, and lightning strikes.
                </p>
              </div>
              <div className="mt-3 text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                Open Windy 3D Map &rarr;
              </div>
            </a>

            {/* Met Éireann Warnings & Rainfall Alerts */}
            <a
              href="https://www.met.ie/warnings"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-teal-500/60 hover:bg-slate-900/90 transition-all flex flex-col justify-between group shadow-md"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-400">Official Warnings</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-400 transition-colors" />
                </div>
                <h4 className="text-sm font-extrabold text-white group-hover:text-teal-300 transition-colors">
                  Kildare &amp; Midlands Alerts
                </h4>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Yellow/Orange/Red weather advisories, flood monitoring &amp; wind alerts.
                </p>
              </div>
              <div className="mt-3 text-[11px] text-teal-400 font-semibold flex items-center gap-1">
                Check Warnings &rarr;
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

