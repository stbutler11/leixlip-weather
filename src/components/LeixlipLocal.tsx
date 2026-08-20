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
  Clock
} from 'lucide-react';
import { 
  CURRENT_LEIXLIP_CONDITIONS, 
  LEIXLIP_KEY_METRICS, 
  LEIXLIP_SPOTS 
} from '../data/weatherData';

export const LeixlipLocal: React.FC = () => {
  const [selectedSpotIndex, setSelectedSpotIndex] = useState<number>(0);
  const [radarLayer, setRadarLayer] = useState<'rain' | 'clouds' | 'wind'>('rain');
  const [isAnimatingRadar, setIsAnimatingRadar] = useState<boolean>(true);

  const spot = LEIXLIP_SPOTS[selectedSpotIndex];

  return (
    <div className="space-y-8 pb-12">
      {/* 📍 1. BENTO ROW: LIVE LEIXLIP OBSERVATION POST & KEY METRICS 📍 */}
      <div className="grid grid-cols-12 gap-5">
        {/* Main Station Observation Bento Box (Col 8 on LG) */}
        <div className="col-span-12 lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  LIVE LEIXLIP OBSERVATION POST • {CURRENT_LEIXLIP_CONDITIONS.lastUpdated}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-white">
                  Leixlip, Co. Kildare Weather
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm">
                  Confluence of River Liffey &amp; Rye Water • Elevation 45m
                </p>
              </div>

              <div className="flex items-baseline gap-4 bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800">
                <div>
                  <div className="text-4xl sm:text-5xl font-black text-emerald-400">
                    {CURRENT_LEIXLIP_CONDITIONS.temp}°C
                  </div>
                  <div className="text-xs text-slate-400">
                    Feels like {CURRENT_LEIXLIP_CONDITIONS.feelsLike}°C
                  </div>
                </div>
                <div className="border-l border-slate-800 pl-4">
                  <div className="text-sm font-bold text-amber-300">
                    {CURRENT_LEIXLIP_CONDITIONS.conditionText}
                  </div>
                  <div className="text-xs text-slate-400">
                    Humidity: {CURRENT_LEIXLIP_CONDITIONS.humidity}% • {CURRENT_LEIXLIP_CONDITIONS.windDirection}
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
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                  Leixlip Weather Observer&apos;s Dispatch:
                </div>
                <p className="text-sm text-slate-200 leading-relaxed italic">
                  &ldquo;{CURRENT_LEIXLIP_CONDITIONS.summaryBanter}&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* 6 Key Irish Weather Metrics Sub-grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-2">
            {LEIXLIP_KEY_METRICS.map((metric) => (
              <div
                key={metric.label}
                className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1"
              >
                <div className="text-[10px] text-slate-400 font-medium uppercase truncate">
                  {metric.label}
                </div>
                <div className={`text-sm sm:text-base font-extrabold truncate ${
                  metric.status === 'grand' ? 'text-amber-300' : 'text-emerald-400'
                }`}>
                  {metric.value}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight line-clamp-2">
                  {metric.subtext}
                </p>
              </div>
            ))}
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
                {spot.currentTemp}°C
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
                <span className="text-slate-400 font-medium text-[10px] uppercase block">Atmosphere</span>
                <p className="text-slate-200 font-semibold">{spot.condition}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 font-medium text-[10px] uppercase block">Wind Dynamics</span>
                <p className="text-slate-200 font-semibold">{spot.windNote}</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-0.5">
                <span className="text-slate-400 font-medium text-[10px] uppercase block">Drying Activity</span>
                <p className="text-slate-200 font-semibold">{spot.dryingStatus}</p>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span><strong>Kildare Lore:</strong> {spot.funFact}</span>
          </div>
        </div>
      </div>

      {/* 🧭 2. BENTO ROW: LANDMARKS SELECTOR 🧭 */}
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
            Select a spot to see specific micro-conditions &amp; local lore
          </p>
        </div>

        {/* Spot buttons grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {LEIXLIP_SPOTS.map((s, idx) => {
            const isSelected = selectedSpotIndex === idx;
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
                  <span className="font-bold text-emerald-400">{s.currentTemp}°C</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">{s.landmark.split('&')[0]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🛰️ 3. BENTO ROW: INTERACTIVE KILDARE LIVE RADAR VISUALIZER 🛰️ */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              Kildare &amp; Midlands Simulated Live Weather Radar
            </h3>
            <p className="text-xs text-slate-400">
              Live tracking Atlantic front progression across Maynooth, Celbridge, Lucan &amp; Stradbally
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
          </div>

          {/* Map Node Points */}
          <div className="relative z-10 w-full max-w-xl h-full flex flex-col justify-between py-6 px-4">
            {/* North: Maynooth / Confey */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> Maynooth (15.8°C)
              </div>
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Confey / Canal (15.9°C)
              </div>
            </div>

            {/* Center: LEIXLIP PIN */}
            <div className="flex items-center justify-center">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-2 bg-emerald-500/30 rounded-full blur-md animate-ping" />
                <div className="relative flex items-center gap-2 bg-emerald-600 text-slate-950 font-black px-4 py-2 rounded-full shadow-lg border border-emerald-300 text-xs sm:text-sm">
                  <MapPin className="w-4 h-4" /> LEIXLIP RADAR POST (16.5°C)
                </div>
              </div>
            </div>

            {/* South: Celbridge / Stradbally Direction */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-sky-400" /> Celbridge / Castletown
              </div>
              <div className="flex items-center gap-1.5 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-600/50 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> &darr; Stradbally Hall (Electric Picnic)
              </div>
            </div>
          </div>

          {/* Radar details badge */}
          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-slate-800">
            Sweep: Active • Layer: {radarLayer.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
