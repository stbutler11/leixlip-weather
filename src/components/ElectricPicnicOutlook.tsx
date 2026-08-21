import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  Umbrella, 
  Volume2, 
  Calendar, 
  AlertTriangle, 
  CloudRain, 
  Wind, 
  CheckCircle2, 
  ShieldCheck, 
  TrendingUp, 
  Flame, 
  Award,
  MapPin,
  Clock,
  Compass,
  Zap,
  RefreshCw,
  Layers,
  ExternalLink,
  Tv,
  Bus,
  Train,
  Navigation,
  Sun,
  Droplets,
  Shirt
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  EP_2026_META, 
  EP_HISTORICAL_TRENDS,
  GRAND_RATIONALES
} from '../data/electricPicnicData';
import { 
  LiveWeatherData, 
  LOCATIONS, 
  fetchLiveLeixlipWeather, 
  fetchMultiLocationWeather 
} from '../services/weatherApi';
import { 
  generateLiveFestivalTelemetry, 
  generateLiveEPModelComparisons, 
  generateLiveEPDailyForecast 
} from '../services/electricPicnicWeather';
import { soundFX } from '../utils/audioSynth';

interface ElectricPicnicOutlookProps {
  weather?: LiveWeatherData | null;
  loading?: boolean;
  onRefresh?: () => void;
}

type SelectedLocationKey = keyof typeof LOCATIONS;

export const ElectricPicnicOutlook: React.FC<ElectricPicnicOutlookProps> = ({
  weather: parentWeather,
  loading: parentLoading,
  onRefresh: parentRefresh,
}) => {
  // Multi-location live telemetry state
  const [selectedHub, setSelectedHub] = useState<SelectedLocationKey>('stradbally');
  const [multiWeather, setMultiWeather] = useState<Record<string, LiveWeatherData>>({});
  const [isLoadingMulti, setIsLoadingMulti] = useState<boolean>(true);
  const [lastRefreshedTime, setLastRefreshedTime] = useState<string>('');

  // UI state
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(2); // Saturday by default
  const [gloomLevel, setGloomLevel] = useState<number>(85);
  const [activeRationaleIndex, setActiveRationaleIndex] = useState<number>(0);
  const [userCampsite, setUserCampsite] = useState<string>('Jimi Hendrix Campsite');
  const [stampedPass, setStampedPass] = useState<boolean>(false);
  const [radarProvider, setRadarProvider] = useState<'windy-radar' | 'rainviewer' | 'windy-wind'>('windy-radar');

  // Load multi-location weather on mount
  const loadAllHubs = useCallback(async () => {
    setIsLoadingMulti(true);
    try {
      const keys: SelectedLocationKey[] = ['stradbally', 'leixlip', 'portlaoise', 'dublin', 'maynooth', 'celbridge'];
      const dataMap = await fetchMultiLocationWeather(keys);
      setMultiWeather(dataMap);
      setLastRefreshedTime(new Intl.DateTimeFormat('en-IE', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date()));
    } catch (err) {
      console.warn('Failed to load multi-location weather:', err);
    } finally {
      setIsLoadingMulti(false);
    }
  }, []);

  useEffect(() => {
    loadAllHubs();
    const interval = setInterval(loadAllHubs, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadAllHubs]);

  // Derive weather objects
  const stradballyWeather = multiWeather.stradbally || (parentWeather?.locationName.includes('Stradbally') ? parentWeather : null);
  const leixlipWeather = multiWeather.leixlip || parentWeather || null;
  const currentFocusedWeather = multiWeather[selectedHub] || (selectedHub === 'leixlip' ? leixlipWeather : stradballyWeather);

  // Derive dynamic festival telemetry & funny quotes based on live data
  const festivalTelemetry = generateLiveFestivalTelemetry(stradballyWeather, leixlipWeather, multiWeather);
  const modelComparisons = generateLiveEPModelComparisons(stradballyWeather);
  const dailyForecast = generateLiveEPDailyForecast(stradballyWeather);

  const selectedDay = dailyForecast[selectedDayIndex] || dailyForecast[0];
  const activeHubInfo = LOCATIONS[selectedHub] || LOCATIONS.stradbally;

  const triggerGrandFanfare = () => {
    soundFX.playGrandChime();
    const stradballyTemp = stradballyWeather?.temp ?? 16.5;
    const rain = stradballyWeather?.precipitationMm ?? 0;
    const spokenMessage = `Official Electric Picnic Forecast: Currently ${stradballyTemp} degrees at Stradbally Hall with ${rain} millimetres of rain. No matter the Atlantic isobars, the conclusion is one hundred percent grand!`;
    soundFX.speakVerdict(spokenMessage);
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.3 },
      colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#ffffff', '#e11d48'],
    });
  };

  const cycleRationale = () => {
    setActiveRationaleIndex((prev) => (prev + 1) % GRAND_RATIONALES.length);
  };

  const handleStampPass = (e: React.FormEvent) => {
    e.preventDefault();
    setStampedPass(true);
    triggerGrandFanfare();
  };

  const handleManualRefresh = () => {
    loadAllHubs();
    if (parentRefresh) parentRefresh();
  };

  // Generate radar embed URL centered on active hub
  const getRadarEmbedUrl = () => {
    const lat = activeHubInfo.lat;
    const lon = activeHubInfo.lon;

    if (radarProvider === 'rainviewer') {
      return `https://www.rainviewer.com/map.html?loc=${lat},${lon},8&oFa=0&oC=1&oU=0&oCS=1&oF=0&oAP=1&c=3&o=83&lm=1&layer=radar&sm=1&sn=1`;
    }
    if (radarProvider === 'windy-wind') {
      return `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=750&height=480&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
    }
    return `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=750&height=480&zoom=8&level=surface&overlay=radar&product=radar&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=&metricWind=km%2Fh&metricTemp=%C2%B0C&radarRange=-1`;
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 🧭 0. REGIONAL MULTI-SPOT LIVE WEATHER TELEMETRY BAR & HUB SELECTOR 🧭 */}
      <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Multi-Hub Weather Grid Active
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-400" />
              Electric Picnic Regional Live Telemetry
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Live Open-Meteo measurements across Stradbally Hall, transit hubs, and Leixlip HQ.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={isLoadingMulti || parentLoading}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 hover:text-emerald-300 rounded-xl border border-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMulti || parentLoading ? 'animate-spin' : ''}`} />
              {isLoadingMulti ? 'Syncing...' : 'Refresh Live Hubs'}
            </button>
            {lastRefreshedTime && (
              <span className="text-[11px] font-mono text-slate-500 hidden md:inline">
                Synced at {lastRefreshedTime}
              </span>
            )}
          </div>
        </div>

        {/* 🗺️ Interactive Hub Cards Grid with Live Data & Funny Quotes 🗺️ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {(Object.keys(LOCATIONS) as SelectedLocationKey[]).map((key) => {
            const loc = LOCATIONS[key];
            const live = multiWeather[key];
            const isSelected = selectedHub === key;
            const isEPGroundZero = key === 'stradbally';

            const temp = live?.temp ?? '--';
            const feels = live?.feelsLike ?? '--';
            const rain = live?.precipitationMm ?? 0;
            const wind = live?.windSpeedKmh ?? '--';
            const weatherDesc = live?.weatherDescription || (live ? 'Live Irish Air' : 'Syncing...');

            // Dynamic funny mini quote per spot
            let spotBanter = '';
            if (key === 'stradbally') {
              spotBanter = rain > 1 ? 'Wellies locked & loaded on the lawn' : 'Turf is holding firm, cold cans ready';
            } else if (key === 'leixlip') {
              spotBanter = 'Banter HQ watching radar from Salmon Leap';
            } else if (key === 'portlaoise') {
              spotBanter = 'Shuttle buses queueing, ponchos on sale';
            } else if (key === 'dublin') {
              spotBanter = 'Coaches boarding with glitter and sleeping bags';
            } else if (key === 'maynooth') {
              spotBanter = 'Student convoy gathering at the train station';
            } else {
              spotBanter = 'Castletown gates checking M7 traffic';
            }

            return (
              <button
                key={key}
                onClick={() => setSelectedHub(key)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-b from-emerald-950/80 to-slate-950 border-2 border-emerald-400 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-400/40'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                      {isEPGroundZero ? (
                        <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40">
                          EP STAGE
                        </span>
                      ) : (
                        <span>{loc.county}</span>
                      )}
                    </span>
                    {live?.isLive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>

                  <div className="font-extrabold text-sm text-white group-hover:text-emerald-300 transition-colors truncate">
                    {loc.name.split('(')[0].trim()}
                  </div>

                  {/* Temperature & Live Conditions */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-black text-amber-400">{temp}°C</span>
                    <span className="text-[10px] text-slate-400">feels {feels}°C</span>
                  </div>

                  <div className="text-[11px] text-slate-300 line-clamp-1 font-medium">
                    {weatherDesc}
                  </div>
                </div>

                {/* Rain & Wind + Spot Banter */}
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1 text-[10px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="flex items-center gap-1">
                      <Umbrella className="w-3 h-3 text-sky-400" /> {rain} mm
                    </span>
                    <span className="flex items-center gap-1">
                      <Wind className="w-3 h-3 text-slate-300" /> {wind} km/h
                    </span>
                  </div>
                  <div className="text-emerald-400/90 italic truncate font-mono text-[9.5px]">
                    &ldquo;{spotBanter}&rdquo;
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Comparative Route Banter */}
        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Bus className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>M7 Festival Transit Advisory:</strong> {festivalTelemetry.comparativeTransitQuote}
            </span>
          </div>
          <span className="text-amber-400 font-mono text-[11px] shrink-0">
            Distance: {activeHubInfo.distanceFromLeixlip || 'Direct Route'}
          </span>
        </div>
      </div>

      {/* 🌟 1. BENTO HERO ROW: THE OFFICIAL VERDICT & FESTIVAL METRICS 🌟 */}
      <div className="grid grid-cols-12 gap-5">
        {/* HERO BENTO TILE: THE IRREVOCABLE "IT'LL BE GRAND" VERDICT (Col 8 on LG) */}
        <div className="col-span-12 lg:col-span-8 rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950/70 to-slate-950 border-2 border-emerald-500/60 p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between group">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            {/* Top Pill / Badge */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Official Kildare-to-Stradbally Bulletin • {EP_2026_META.edition}
              </div>
              <div className="text-xs font-mono text-slate-300 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Stradbally Feed: <strong className="text-amber-400">{stradballyWeather?.temp ?? 16.5}°C</strong> ({stradballyWeather?.precipitationMm ?? 0}mm rain)
              </div>
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans">
                Electric Picnic 2026 <span className="text-emerald-400">Outlook</span>
              </h1>
              <p className="text-slate-300 text-sm mt-1">
                {EP_2026_META.location} • {EP_2026_META.dates}
              </p>
            </div>

            {/* THE GIANT UNCONDITIONAL VERDICT HIGHLIGHT CARD */}
            <div className="bg-slate-950/90 border-2 border-amber-400/80 rounded-2xl p-5 sm:p-7 shadow-2xl relative group/card hover:border-amber-300 transition-all">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-widest rounded-full shadow">
                The Irrevocable Live Consensus
              </div>

              <div className="space-y-3 text-center py-1">
                <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
                  Scientific Meteorological Conclusion for Stradbally Hall
                </div>

                {/* The Dynamic Hero Statement */}
                <div className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200 drop-shadow-sm py-1 leading-tight">
                  {festivalTelemetry.dynamicHeroQuote}
                </div>

                <p className="text-xs sm:text-base text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed">
                  {festivalTelemetry.dynamicVerdictSubtext}
                </p>

                {/* Live Real-time Telemetry Chips */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 max-w-xl mx-auto text-left">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Live Temp</span>
                    <span className="text-sm font-extrabold text-amber-400">
                      {stradballyWeather?.temp ?? 16.5}°C (feels {stradballyWeather?.feelsLike ?? 15.8}°C)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Live Rain</span>
                    <span className="text-sm font-extrabold text-sky-400">
                      {stradballyWeather?.precipitationMm ?? 0} mm/h
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Mud Resilience</span>
                    <span className="text-sm font-extrabold text-emerald-400">
                      {festivalTelemetry.mudCategory} ({festivalTelemetry.mudPercentage}%)
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase block">Poncho Protocol</span>
                    <span className="text-sm font-extrabold text-amber-300 truncate block">
                      {festivalTelemetry.ponchoStatus.split('(')[0]}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={triggerGrandFanfare}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-900/50 flex items-center gap-2 cursor-pointer transition-all transform hover:scale-105 active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-amber-950" />
                    Proclaim the Grand Verdict! (Confetti &amp; Chimes)
                  </button>

                  <button
                    onClick={() => {
                      const stradballyTemp = stradballyWeather?.temp ?? 16.5;
                      const rain = stradballyWeather?.precipitationMm ?? 0;
                      soundFX.speakVerdict(`Live Stradbally update: ${stradballyTemp} degrees, ${rain} mm rain. The verdict is ironclad: it'll be grand!`);
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                    Read Live Verdict Aloud
                  </button>
                </div>
              </div>

              {/* Dynamic Campsite Survival Advice from Live Weather */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
                <div className="flex items-center gap-2 text-left">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong className="text-slate-200">Live Campsite Wisdom:</strong> {festivalTelemetry.campsiteSurvivalTip}</span>
                </div>
                <button 
                  onClick={cycleRationale}
                  className="text-amber-400 hover:text-amber-300 font-semibold underline cursor-pointer shrink-0 text-xs"
                >
                  Next Grand Rationale &rarr;
                </button>
              </div>

              {/* Dynamic Rationale Display */}
              <div className="mt-2.5 p-2.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300 italic text-left">
                💡 &ldquo;{GRAND_RATIONALES[activeRationaleIndex]}&rdquo;
              </div>
            </div>
          </div>
        </div>

        {/* SIDE BENTO STACK (Col 4 on LG) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
          {/* BENTO TILE 1: LIVE FESTIVAL METRIC CARD */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Stradbally Hall, Co. Laois
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded font-mono">
                  AUG 27-31
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">Festival Status</div>
                <div className="text-2xl font-black text-amber-300">100% Certified Grand</div>
                <p className="text-xs text-slate-300">
                  70,000 music lovers, 300+ acts, 600 acres of prime Kildare-adjacent grass and mud.
                </p>
              </div>

              {/* Dynamic live telemetry breakdown */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Live Mud Index</span>
                  <span className="text-sm font-bold text-emerald-400">{festivalTelemetry.mudCategory}</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Poncho Index</span>
                  <span className="text-sm font-bold text-amber-400">
                    {stradballyWeather && stradballyWeather.precipitationMm > 0 ? 'Active Deployment' : 'Ready in Boot'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Leixlip Distance: 68 km</span>
              <span className="text-emerald-400 font-semibold">M7 Clear</span>
            </div>
          </div>

          {/* BENTO TILE 2: GLOOM-TO-GRAND SLIDER WIDGET */}
          <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 flex flex-col justify-between shadow-xl space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" /> Gloom Converter
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                  Always 100% Grand
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Drag model gloom to see Irish festival spirit response.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>Model Gloom: <strong className="text-amber-400">{gloomLevel}%</strong></span>
                <span>Spirit: <strong className="text-emerald-400">100%</strong></span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gloomLevel}
                onChange={(e) => setGloomLevel(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-300">
                {gloomLevel > 75 ? (
                  <span>🌧️ <strong>Biblical Deluge:</strong> Mud to the knees. <em>Verdict: Still fierce grand, head to Mindfield!</em></span>
                ) : gloomLevel > 35 ? (
                  <span>🌦️ <strong>Standard Drizzle:</strong> Ponchos up, cider in hand. <em>Verdict: Pure grand.</em></span>
                ) : (
                  <span>☀️ <strong>Rare Scorcher:</strong> Factor 50 on nose. <em>Verdict: Unbelievably grand!</em></span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setGloomLevel(20);
                  triggerGrandFanfare();
                }}
                className="py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-[11px] font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                ☀️ Set Scorcher
              </button>
              <button
                onClick={() => {
                  setGloomLevel(100);
                  triggerGrandFanfare();
                }}
                className="py-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[11px] font-bold rounded-xl border border-slate-700 transition-colors cursor-pointer"
              >
                🌧️ Test Storm &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 2. BENTO ROW: SUPERCOMPUTERS VS LEIXLIP VERDICT (DYNAMIC LIVE DATA) 📊 */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Supercomputers vs. Kildare Wisdom
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Global Model Forecasts vs. The Reality
            </h2>
          </div>
          <div className="text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            Current Stradbally Telemetry: <span className="text-amber-400 font-bold">{stradballyWeather?.temp ?? 16.5}°C</span> • <span className="text-sky-400 font-bold">{stradballyWeather?.precipitationMm ?? 0}mm</span> Rain
          </div>
        </div>

        {/* 4 Bento Model Tiles with Live Metrics */}
        <div className="grid grid-cols-12 gap-4">
          {modelComparisons.map((model, idx) => {
            const isLeixlip = idx === 3;
            return (
              <div
                key={model.name}
                className={`col-span-12 sm:col-span-6 lg:col-span-3 rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                  isLeixlip
                    ? 'bg-gradient-to-b from-emerald-950/70 to-slate-950 border-2 border-emerald-500 shadow-xl ring-1 ring-emerald-400/40'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-bold text-base ${isLeixlip ? 'text-emerald-300' : 'text-slate-100'}`}>
                        {model.name}
                      </h3>
                      <p className="text-xs text-slate-400">{model.provider}</p>
                    </div>
                    {isLeixlip ? (
                      <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
                        <Award className="w-4 h-4" />
                      </span>
                    ) : (
                      <span className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                      </span>
                    )}
                  </div>

                  {/* Predictions */}
                  <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                    <div>
                      <span className="text-slate-400">Rain Estimate:</span>{' '}
                      <span className="font-semibold text-slate-200">{model.rainEstimate}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Temp Range:</span>{' '}
                      <span className="font-semibold text-slate-200">{model.tempRange}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Verdict:</span>{' '}
                      <span className={`font-semibold ${isLeixlip ? 'text-emerald-400 font-bold' : 'text-amber-400'}`}>
                        {model.confidence}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed italic">
                    &ldquo;{model.prediction}&rdquo;
                  </p>
                </div>

                {/* Local Critique */}
                <div className="mt-4 pt-3 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium">Leixlip Observation:</span>
                  <p className={`mt-0.5 font-medium ${isLeixlip ? 'text-emerald-300 font-bold' : 'text-amber-300/90'}`}>
                    {model.leixlipCritique}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 📅 3. BENTO ROW: 5-DAY FESTIVAL SCHEDULE & DETAILED INSPECTOR (LIVE BLENDED) 📅 */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> August 27 – 31, 2026 (Live Blended Forecast)
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Day-by-Day Festival Forecast &amp; Survival Guide
            </h2>
          </div>
          <div className="text-xs text-slate-400">
            Powered by live Open-Meteo 7-day model projections for Stradbally Hall
          </div>
        </div>

        {/* Day Selector Bento Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {dailyForecast.map((day, index) => {
            const isSelected = selectedDayIndex === index;
            return (
              <button
                key={day.dayName}
                onClick={() => setSelectedDayIndex(index)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-br from-emerald-900/80 to-slate-900 border-emerald-400 shadow-lg text-white ring-1 ring-emerald-400/50'
                    : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-400">
                    {day.date.split('-')[2]} Aug
                  </span>
                  <span className="text-xs font-bold text-amber-400">
                    {day.tempDay}°C
                  </span>
                </div>
                <div className="font-bold text-sm sm:text-base mt-1">{day.dayName}</div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {day.phase.split('&')[0]}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[11px]">
                  <Umbrella className="w-3 h-3 text-sky-400" />
                  <span>{day.rainfallMm} mm</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-emerald-400 font-semibold truncate">Grand</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Detailed Inspector Bento Box */}
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
          {/* Day banner */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                  {selectedDay.date}
                </span>
                <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
                  Phase: {selectedDay.phase}
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {selectedDay.dayName} at Stradbally Hall
              </h3>
              <p className="text-slate-300 text-sm mt-1">{selectedDay.vibeSummary}</p>
            </div>

            {/* Quick Metrics Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[75px]">
                <div className="text-[10px] text-slate-400 uppercase">Day / Night</div>
                <div className="text-base font-black text-amber-400">{selectedDay.tempDay}° / {selectedDay.tempNight}°C</div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[75px]">
                <div className="text-[10px] text-slate-400 uppercase">Rain Volume</div>
                <div className="text-base font-black text-sky-400">{selectedDay.rainfallMm} mm</div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[75px]">
                <div className="text-[10px] text-slate-400 uppercase">Wind Gusts</div>
                <div className="text-base font-black text-slate-200">{selectedDay.windGustsKmh} km/h</div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[75px]">
                <div className="text-[10px] text-slate-400 uppercase">Mud Status</div>
                <div className="text-xs font-bold text-amber-300 mt-1">{selectedDay.mudIndex}</div>
              </div>
            </div>
          </div>

          {/* Model Prediction vs The Irrefutable Verdict Bento Sub-grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Gloomy Model Report */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/80 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <CloudRain className="w-4 h-4" /> Official Meteorological Simulation
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {selectedDay.officialModelPrediction}
              </p>
              <div className="space-y-1.5 pt-2 border-t border-slate-900 text-xs text-slate-400">
                <div>• <strong>ECMWF Track:</strong> {selectedDay.ecmwfModel}</div>
                <div>• <strong>GFS Track:</strong> {selectedDay.gfsModel}</div>
                <div>• <strong>Met Éireann Note:</strong> {selectedDay.metEireannNote}</div>
              </div>
            </div>

            {/* THE IRISH VERDICT FOR THE DAY */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-slate-950 border-2 border-emerald-500/60 space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Leixlip Weather Daily Verdict
                </div>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-emerald-500 text-slate-950 rounded-full">
                  100% Grand
                </span>
              </div>

              <div className="text-lg sm:text-xl font-black text-white leading-tight">
                &ldquo;{selectedDay.localIrishVerdict}&rdquo;
              </div>

              <div className="pt-2 text-xs text-slate-300 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-400 shrink-0" />
                <span><strong>Recommended Sanctuary:</strong> {selectedDay.recommendedStage}</span>
              </div>
            </div>
          </div>

          {/* Mud Matrix Bar & Survival Gear List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* Mud meter */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400 font-medium">Stradbally Mud Depth</span>
                <span className="text-amber-400 font-bold">{selectedDay.mudPercentage}% ({selectedDay.mudIndex})</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    selectedDay.mudPercentage > 60 
                      ? 'bg-amber-600' 
                      : selectedDay.mudPercentage > 30 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${selectedDay.mudPercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400">
                {selectedDay.mudPercentage > 60 
                  ? 'Double-knot your welly laces to avoid spontaneous boot loss.'
                  : 'Grass is currently holding together nicely.'}
              </p>
            </div>

            {/* Essential Gear */}
            <div className="md:col-span-2 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-400">Recommended Kildare Survival Gear for {selectedDay.dayName}:</div>
              <div className="flex flex-wrap gap-2">
                {selectedDay.essentialGear.map((gear) => (
                  <span
                    key={gear}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    {gear}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🛰️ 4. BENTO ROW: LIVE STRADBALLY & REGIONAL RADAR 🛰️ */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-800/60">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Doppler Radar Sweeps
            </div>
            <h3 className="text-2xl font-black text-white flex items-center gap-2.5">
              <Layers className="w-6 h-6 text-emerald-400" />
              Live Festival Radar: {activeHubInfo.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Real-time Doppler precipitation radar tracking Atlantic cloud fronts moving across Co. Laois and Co. Kildare.
            </p>
          </div>

          {/* Radar Provider Toggles */}
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
              Wind Streams
            </button>
          </div>
        </div>

        {/* Live Interactive Radar Frame */}
        <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-2xl">
          <iframe
            key={`${radarProvider}-${activeHubInfo.lat}-${activeHubInfo.lon}`}
            src={getRadarEmbedUrl()}
            title="Live Rain Radar for Stradbally"
            className="w-full h-[450px] sm:h-[500px] border-0"
            loading="lazy"
            allowFullScreen
          />

          {/* Quick info bar overlay on bottom */}
          <div className="bg-slate-950/95 border-t border-slate-800 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Target Focus: <strong className="text-white">{activeHubInfo.name}</strong> ({activeHubInfo.county})
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-400 hidden sm:inline">
                Interactive: Drag map to pan across Stradbally Hall, scroll to zoom, click play for radar loop.
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

        {/* 🔗 Direct External Radar Launchers 🔗 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <a
            href="https://www.met.ie/forecasts/radar"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/60 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-emerald-400">Met Éireann Official</div>
              <div className="text-xs font-extrabold text-white">National Doppler Sweeps</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
          </a>

          <a
            href="https://www.rainviewer.com/weather-radar-map-live/stradbally-ireland.html"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-sky-500/60 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-sky-400">RainViewer Stradbally</div>
              <div className="text-xs font-extrabold text-white">2-Hour Rain Nowcast</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-sky-400 transition-colors" />
          </a>

          <a
            href="https://www.met.ie/warnings"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 transition-all flex items-center justify-between group"
          >
            <div>
              <div className="text-xs font-bold text-amber-400">Laois &amp; Kildare Warnings</div>
              <div className="text-xs font-extrabold text-white">Official Weather Alerts</div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
          </a>
        </div>
      </div>

      {/* 📜 5. BENTO ROW: HISTORICAL EP WEATHER MATRIX (2004 - 2025) 📜 */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> 20+ Years of Stradbally Weather Archives
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Historical Electric Picnic Weather Trends
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            From the 2023 heat scorcher to the legendary 2015 mud marathon
          </p>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {EP_HISTORICAL_TRENDS.map((item) => (
            <div
              key={item.year}
              className="col-span-12 sm:col-span-6 lg:col-span-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-white">{item.year}</span>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      item.overallVerdict === 'Scorcher'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.overallVerdict === 'Biblical Mud Bath'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {item.overallVerdict}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.headlineMemories}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-950 rounded-xl text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Peak Temp</span>
                    <span className="font-bold text-amber-400">{item.tempMax}°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Rainfall</span>
                    <span className="font-bold text-sky-400">{item.rainfallTotalMm} mm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Mud (1-10)</span>
                    <span className="font-bold text-amber-300">{item.mudRating}/10</span>
                  </div>
                </div>
              </div>

              {/* Eyewitness Quote */}
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 italic">
                {item.quote}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🏷️ 6. BENTO ROW: PERSONALIZED "CERTIFIED GRAND" PASSPORT GENERATOR 🏷️ */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-amber-950/40 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="max-w-2xl">
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Official Festival Preparedness Tool
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Get Your Official &ldquo;It&apos;ll Be Grand&rdquo; 2026 Passport
          </h2>
          <p className="text-sm text-slate-300 mt-1.5">
            Enter your campsite and generate an ironclad meteorological immunity pass for Electric Picnic 2026.
          </p>
        </div>

        <form onSubmit={handleStampPass} className="flex flex-col sm:flex-row gap-3 max-w-xl">
          <input
            type="text"
            value={userCampsite}
            onChange={(e) => setUserCampsite(e.target.value)}
            placeholder="e.g. Jimi Hendrix, Oscar Wilde, Charlie Chaplin..."
            className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-2"
          >
            <Award className="w-4 h-4" /> Issue Certified Pass
          </button>
        </form>

        {stampedPass && (
          <div className="p-6 rounded-2xl bg-slate-950 border-2 border-amber-400/80 shadow-2xl space-y-4 max-w-xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <div className="font-bold text-white text-sm">STRADBALLY IMMUNITY PASSPORT</div>
                  <div className="text-[10px] text-slate-400 font-mono">Issued by Leixlip Meteorological Banter Bureau</div>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-black text-xs rounded uppercase">
                EP 2026 VALID
              </span>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <div><strong>Bearer Camp:</strong> {userCampsite || 'General Stradbally Camper'}</div>
              <div><strong>Live Stradbally Condition:</strong> {stradballyWeather?.temp ?? 16.5}°C, {stradballyWeather?.weatherDescription || 'Fresh Irish Air'}</div>
              <div><strong>Guaranteed Verdict:</strong> <span className="text-emerald-400 font-bold">100% IT&apos;LL BE GRAND</span></div>
              <p className="italic text-slate-400 text-[11px] pt-1">
                &ldquo;The holder of this pass is legally exempt from complaining about rain, wet socks, or tent zipper failure for the duration of Electric Picnic 2026.&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
