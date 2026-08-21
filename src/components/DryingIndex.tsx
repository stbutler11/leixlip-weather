import React, { useState } from 'react';
import { Shirt, Wind, Sun, Clock, CheckCircle2, AlertTriangle, Sparkles, Droplets } from 'lucide-react';
import { LiveWeatherData } from '../services/weatherApi';

interface LaundryItem {
  name: string;
  category: string;
  baseDryingTimeHours: number;
  riskLevel: 'Low' | 'Moderate' | 'High';
  note: string;
}

const LAUNDRY_ITEMS: LaundryItem[] = [
  {
    name: 'Bed Sheets & Duvet Covers',
    category: 'Linens',
    baseDryingTimeHours: 2.2,
    riskLevel: 'Low',
    note: 'Optimal wind catching. Will billow gracefully like sails in St. Catherine’s park.',
  },
  {
    name: 'Heavy Denim Jeans',
    category: 'Heavywear',
    baseDryingTimeHours: 4.5,
    riskLevel: 'Moderate',
    note: 'Pockets will stay slightly damp unless flipped inside out at 1:30pm.',
  },
  {
    name: 'Electric Picnic Wellies & Wool Socks',
    category: 'Festival Prep',
    baseDryingTimeHours: 3.0,
    riskLevel: 'Low',
    note: 'Stuff with newspaper and place near the rotary line breeze for prime prep.',
  },
  {
    name: 'Tea Towels & T-Shirts',
    category: 'Everyday',
    baseDryingTimeHours: 1.5,
    riskLevel: 'Low',
    note: 'Crisp, fresh, smelling of Kildare rain air.',
  },
  {
    name: 'Heavy Fleece Festival Hoodies',
    category: 'Outerwear',
    baseDryingTimeHours: 5.0,
    riskLevel: 'High',
    note: 'Watch the Maynooth clouds. You may need to finish them on the clothes horse by the radiator.',
  },
];

interface DryingIndexProps {
  weather?: LiveWeatherData | null;
}

export const DryingIndex: React.FC<DryingIndexProps> = ({ weather }) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const selectedLaundry = LAUNDRY_ITEMS[selectedItemIndex];

  const dryingScore = weather?.dryingIndexScore ?? 7;
  const dryingRating = weather?.dryingIndexRating ?? 'Fierce Good Air (Grade 2 Optimal)';
  const dryingAdvice = weather?.dryingAdvice ?? 'Rotary line is spinning nicely. Bed sheets will billow and dry in 3 hours.';
  const windKmh = weather?.windSpeedKmh ?? 19;
  const temp = weather?.temp ?? 16.5;
  const humidity = weather?.humidity ?? 74;
  const cloudCover = weather?.cloudCoverPercent ?? 68;

  // Calculate dynamic dry time multiplier based on live score (10 = 0.7x faster, 1 = 2.5x slower)
  const timeMultiplier = dryingScore >= 8 ? 0.75 : dryingScore >= 6 ? 1.0 : dryingScore >= 4 ? 1.4 : 2.2;
  const calculatedDryTime = Math.round(selectedLaundry.baseDryingTimeHours * timeMultiplier * 10) / 10;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wide border border-emerald-500/30">
          <Shirt className="w-3.5 h-3.5" /> Irish National Obsession
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          The Official Leixlip Drying Weather Index
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Forget supercomputers: the true measurement of Irish weather is whether the washing on the rotary line gets dry before the clouds roll over the Rye Water.
        </p>
      </div>

      {/* Main Status Bento Tile */}
      <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <span className="text-xs uppercase font-mono text-emerald-400 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Clothesline Telemetry • Open-Meteo Model
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {dryingRating}
            </h2>
            <p className="text-slate-300 text-sm">
              Current Index Score: <strong className="text-emerald-400 text-base">{dryingScore}/10</strong> • {dryingAdvice}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 px-5 py-3.5 rounded-2xl border border-slate-800">
            <Wind className="w-8 h-8 text-sky-400 animate-pulse" />
            <div>
              <div className="text-sm font-bold text-white">{windKmh} km/h Irish Breeze</div>
              <div className="text-xs text-slate-400">Temp: {temp}°C • Humidity: {humidity}%</div>
            </div>
          </div>
        </div>

        {/* 3 Pillars of Irish Drying Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="text-xs text-slate-400 font-medium">Breeze Factor</div>
            <div className="text-lg font-bold text-emerald-400">
              {windKmh >= 15 ? 'Steady & Healthy' : 'Light Drift'}
            </div>
            <p className="text-xs text-slate-400">
              {windKmh >= 15
                ? 'Clothes will spin nicely without ripping off the wooden pegs.'
                : 'Pockets will need a bit of extra patience.'}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="text-xs text-slate-400 font-medium">Cloud Cover Factor</div>
            <div className="text-lg font-bold text-amber-400">{cloudCover}% Cloud Cover</div>
            <p className="text-xs text-slate-400">
              {cloudCover < 50
                ? 'Great direct sunlight helping evaporation.'
                : 'High clouds keep the air warm without immediate rain threat.'}
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="text-xs text-slate-400 font-medium">Recommended Window</div>
            <div className="text-lg font-bold text-sky-400">10:00 AM – 4:30 PM</div>
            <p className="text-xs text-slate-400">Pull the towels in by tea time as evening damp sets in over the canal.</p>
          </div>
        </div>
      </div>

      {/* Interactive Laundry Estimator Bento */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          Interactive Kildare Clothesline Estimator
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* List of items */}
          <div className="lg:col-span-6 space-y-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Select Laundry Load:</span>
            {LAUNDRY_ITEMS.map((item, idx) => {
              const isSelected = selectedItemIndex === idx;
              const itemDryTime = Math.round(item.baseDryingTimeHours * timeMultiplier * 10) / 10;
              return (
                <button
                  key={item.name}
                  onClick={() => setSelectedItemIndex(idx)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950/70 border-emerald-400 text-white font-semibold shadow-md ring-1 ring-emerald-400/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-sm font-semibold">{item.name}</div>
                    <div className="text-[11px] text-slate-400">{item.category}</div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-400">~{itemDryTime} hrs</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Details */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-mono uppercase text-emerald-400">Live Estimated Dry Time</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 border border-slate-700 text-slate-300">
                  Risk: {selectedLaundry.riskLevel}
                </span>
              </div>

              <div className="text-4xl font-black text-white flex items-baseline gap-2">
                <span>{calculatedDryTime} Hours</span>
                <span className="text-xs font-normal text-emerald-400 font-mono">
                  ({dryingScore >= 7 ? 'Fast speed' : 'Standard pace'})
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedLaundry.note}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span><strong>The Leixlip Golden Rule:</strong> If you feel 3 drops of rain on your forearm, don’t walk — sprint to the rotary line.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
