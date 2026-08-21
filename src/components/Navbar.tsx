import React from 'react';
import { ActiveTab } from '../types';
import { 
  CloudSun, 
  Sparkles, 
  MapPin, 
  Shirt, 
  BookOpen, 
  HelpCircle, 
  Sliders, 
  Volume2,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audioSynth';
import { LiveWeatherData } from '../services/weatherApi';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  liveWeather?: LiveWeatherData | null;
  onRefreshWeather?: () => void;
  isLoadingWeather?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab, 
  liveWeather,
  onRefreshWeather,
  isLoadingWeather 
}) => {
  const handleGrandCelebration = () => {
    soundFX.playGrandChime();
    soundFX.speakVerdict("Official Leixlip Weather verdict for Electric Picnic 2026: It'll be grand!");
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.2 },
      colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#ffffff'],
    });
  };

  const navItems = [
    {
      id: 'electric-picnic' as ActiveTab,
      label: 'Electric Picnic 2026',
      badge: 'EP Highlight',
      icon: Sparkles,
      highlight: true,
    },
    {
      id: 'leixlip-local' as ActiveTab,
      label: 'Leixlip Live & Radar',
      icon: CloudSun,
    },
    {
      id: 'grand-o-meter' as ActiveTab,
      label: 'Grand-O-Meter',
      icon: Sliders,
    },
    {
      id: 'drying-index' as ActiveTab,
      label: 'Drying Index',
      icon: Shirt,
    },
    {
      id: 'glossary' as ActiveTab,
      label: 'Irish Slang',
      icon: BookOpen,
    },
    {
      id: 'ask-guy' as ActiveTab,
      label: 'Ask Weather Guy',
      icon: HelpCircle,
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl">
      {/* Top Banner: Real-time Leixlip Barometer Ticker */}
      <div className="bg-gradient-to-r from-emerald-950/90 via-slate-900 to-amber-950/60 border-b border-emerald-500/20 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${liveWeather?.isLive ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${liveWeather?.isLive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            </span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {liveWeather ? `${liveWeather.locationName.toUpperCase()}, ${liveWeather.county.toUpperCase()}` : 'LEIXLIP, CO. KILDARE'}
            </span>
            <span className="text-slate-500 hidden sm:inline">|</span>
            <span className="text-slate-200 font-medium">
              {liveWeather ? (
                <>
                  <strong className="text-emerald-300">{liveWeather.temp}°C</strong> • {liveWeather.irishWeatherState} • {liveWeather.windSpeedKmh} km/h wind
                </>
              ) : (
                '16.5°C • Fierce Mild • Rye River Breezes'
              )}
            </span>
            {onRefreshWeather && (
              <button
                onClick={onRefreshWeather}
                disabled={isLoadingWeather}
                title="Fetch latest Open-Meteo readings (Free & No Auth)"
                className="ml-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingWeather ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-amber-300 font-medium hidden md:inline">
              🎪 Electric Picnic 2026 Outlook:
            </span>
            <button
              onClick={handleGrandCelebration}
              className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer active:scale-95 shadow-sm"
              title="Click to hear the official verdict"
            >
              <Sparkles className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              IT&apos;LL BE GRAND <Volume2 className="w-3 h-3 text-emerald-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div 
            onClick={() => setActiveTab('electric-picnic')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center shadow-lg shadow-emerald-950/60 border border-emerald-400/30 group-hover:scale-105 transition-transform">
              <CloudSun className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Leixlip Weather
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Est. 2004
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                Local Kildare Lore &amp; Irish Forecasts
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800/80">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-950'
                        : 'bg-slate-800 text-white border border-slate-700'
                      : item.highlight
                      ? 'text-emerald-400 hover:bg-emerald-950/40 hover:text-emerald-300 border border-emerald-800/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Sound/Interaction trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundFX.playSoftRain(3);
              }}
              title="Play Soft Irish Rain Ambience"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 border border-slate-800 transition-colors cursor-pointer"
            >
              <CloudSun className="w-4 h-4 text-teal-400" />
              <span className="hidden sm:inline">Rain Sound</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Scroll Strip */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-2.5 pt-1 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors shrink-0 ${
                  isActive
                    ? item.highlight
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'bg-slate-800 text-white font-semibold border border-slate-700'
                    : 'bg-slate-900/80 text-slate-300 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
