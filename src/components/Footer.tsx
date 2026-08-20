import React from 'react';
import { CloudSun, Sparkles, MapPin, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audioSynth';

export const Footer: React.FC = () => {
  const handleGrandClick = () => {
    soundFX.playGrandChime();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#10b981', '#f59e0b', '#3b82f6'],
    });
  };

  return (
    <footer className="mt-16 border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1: Brand Lore Bento */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <CloudSun className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base">Leixlip Weather</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Hyperlocal Irish weather conditions, drying index calculations, and unfiltered festival outlooks from the banks of the Rye Water and River Liffey.
            </p>
            <div className="text-[11px] text-slate-500 pt-1">
              📍 Leixlip, Co. Kildare • Home of Arthur Guinness (1756) &amp; Castletown House
            </div>
          </div>

          {/* Column 2: Key Forecast Directives Bento */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider">Meteorological Principles</h4>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>• <strong>Principle 1:</strong> It&apos;ll be grand.</li>
              <li>• <strong>Principle 2:</strong> There is no bad weather, only insufficient tea.</li>
              <li>• <strong>Principle 3:</strong> If the rotary line is spinning, get the jeans out.</li>
              <li>• <strong>Principle 4:</strong> Ponchos are high couture in Stradbally.</li>
            </ul>
          </div>

          {/* Column 3: The Irrevocable Guarantee Bento */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/30 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">Electric Picnic 2026 Guarantee</span>
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                &ldquo;No matter the cloud charts, squall lines, or mud depth, our certified forecast will always remain: It&apos;ll be grand.&rdquo;
              </p>
            </div>
            <button
              onClick={handleGrandClick}
              className="w-full py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-2xl font-bold text-xs cursor-pointer transition-colors shadow-sm mt-2"
            >
              Verify Grandness ✨
            </button>
          </div>
        </div>

        {/* Bottom copyright & Irish weather tribute */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Leixlip Weather. Independent Irish Local Weather commentary.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            Proudly keeping Kildare &amp; Stradbally spirit high since 2004
          </div>
        </div>
      </div>
    </footer>
  );
};
