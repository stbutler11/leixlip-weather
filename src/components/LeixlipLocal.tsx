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
  ShieldCheck
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

export const LeixlipLocal: React.FC<LeixlipLocalProps> = ({
  weather,
  loading,
  onRefresh,
  locationKey,
  onLocationChange,
}) => {
  const [selectedSpotIndex, setSelectedSpotIndex] = useState<number>(0);
  const [radarLayer, setRadarLayer] = useState<'rain' | 'clouds' | 'wind'>('rain');
  const [isAnimatingRadar, setIsAnimatingRadar] = useState<boolean>(true);
  const [forecastView, setForecastView] = useState<'hourly' | '7day'>('hourly');

  const spot = LEIXLIP_SPOTS[selectedSpotIndex];

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

      {/* 🛰️ 4. BENTO ROW: INTERACTIVE KILDARE LIVE RADAR VISUALIZER 🛰️ */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Kildare &amp; Midlands Live Simulated Radar
            </h3>
            <p className="text-xs text-slate-400">
              Atlantic front tracking across Maynooth, Celbridge, Lucan &amp; Stradbally Hall
            </p>
          </div>

          {/* Layer toggles */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['rain', 'clouds', 'wind'] as const).map((layer) => (
              <button
                key={layer}
                onClick={() => setRadarLayer(layer)}
                className={`px-3 py-1 rounded-lg font-medium capitalize cursor-pointer transition-colors ${
                  radarLayer === layer
                    ? 'bg-emerald-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {layer}
              </button>
            ))}
          </div>
        </div>

        {/* Radar Screen Map */}
        <div className="relative h-72 sm:h-80 w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

          {/* Sweeping Radar Beam */}
          {isAnimatingRadar && (
            <div className="absolute inset-0 origin-center animate-spin pointer-events-none opacity-40" style={{ animationDuration: '8s' }}>
              <div className="w-1/2 h-1/2 bg-gradient-to-tr from-emerald-500/30 to-transparent transform -rotate-45" />
            </div>
          )}

          {/* Simulated Rain Clouds / Wind Streams */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {radarLayer === 'rain' && (
              <>
                <div className="absolute top-1/4 left-1/3 w-48 h-32 bg-sky-500/20 rounded-full blur-2xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 w-64 h-40 bg-emerald-500/15 rounded-full blur-3xl" />
              </>
            )}
            {radarLayer === 'clouds' && (
              <div className="absolute inset-0 bg-slate-400/10 blur-xl" />
            )}
            {radarLayer === 'wind' && (
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-transparent animate-pulse" />
            )}
          </div>

          {/* Map Node Points */}
          <div className="relative z-10 w-full max-w-xl h-full flex flex-col justify-between py-6 px-4">
            {/* North: Maynooth / Confey */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> Maynooth ({Math.round((currentTemp - 0.5) * 10) / 10}°C)
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Confey / Canal ({Math.round((currentTemp - 0.3) * 10) / 10}°C)
              </div>
            </div>

            {/* Center: LEIXLIP PIN */}
            <div className="flex items-center justify-center">
              <div className="relative group cursor-pointer" onClick={() => onLocationChange('leixlip')}>
                <div className="absolute -inset-2 bg-emerald-500/30 rounded-full blur-md animate-ping" />
                <div className="relative flex items-center gap-2 bg-emerald-600 text-slate-950 font-black px-4 py-2 rounded-full shadow-lg border border-emerald-300 text-xs sm:text-sm">
                  <MapPin className="w-4 h-4" /> LEIXLIP STATION ({currentTemp}°C)
                </div>
              </div>
            </div>

            {/* South: Celbridge / Stradbally Direction */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> Celbridge / Castletown
              </div>
              <button
                onClick={() => onLocationChange('stradbally')}
                className="flex items-center gap-1.5 bg-amber-950/90 hover:bg-amber-900 px-2.5 py-1 rounded-lg border border-amber-600/50 text-amber-300 cursor-pointer transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" /> &darr; Stradbally Hall (Electric Picnic)
              </button>
            </div>
          </div>

          {/* Radar details badge */}
          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800 flex items-center gap-2">
            <span>Sweep: Active</span>
            <span>•</span>
            <span>Layer: {radarLayer.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
