import React, { useState } from 'react';
import { Sliders, Sparkles, AlertTriangle, ShieldCheck, RefreshCw, Volume2, Flame, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/audioSynth';

export const GrandOMeterSimulator: React.FC = () => {
  const [rainMm, setRainMm] = useState<number>(35);
  const [windKmh, setWindKmh] = useState<number>(48);
  const [mudDepthCm, setMudDepthCm] = useState<number>(14);
  const [tentPegsMissing, setTentPegsMissing] = useState<number>(4);
  const [lukewarmCans, setLukewarmCans] = useState<number>(8);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [calculationStep, setCalculationStep] = useState<string>('');

  const calculateVerdict = () => {
    setIsCalculating(true);
    setCalculationStep('Analyzing Atlantic cyclonic vortex...');

    setTimeout(() => {
      setCalculationStep('Stress-testing €3 Dunnes Stores poncho resilience...');
    }, 400);

    setTimeout(() => {
      setCalculationStep('Calculating collective Irish stoicism quotient...');
    }, 800);

    setTimeout(() => {
      setIsCalculating(false);
      soundFX.playGrandChime();
      soundFX.speakVerdict("Simulation complete. No matter the catastrophe, it will be grand!");
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.4 },
        colors: ['#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#ffffff'],
      });
    }, 1200);
  };

  const getCustomRationale = () => {
    if (rainMm > 60 && windKmh > 60) {
      return "Hurricane-force deluge detected. However, human body heat inside the Electric Arena will create a thermal bubble. You'll barely notice the roof shaking.";
    }
    if (mudDepthCm > 20) {
      return "Mud is above ankle depth. Recommendation: abandon runners, accept the welly lifestyle, slide gracefully across the grass to the Salty Dog.";
    }
    if (tentPegsMissing >= 6) {
      return "Tent is held down by only 2 pegs and a six-pack of cider. As long as you sleep in the middle to weigh it down, it'll be grand.";
    }
    return "Standard Irish festival climate. Put on the glitter, slip into the fleece, and march onward into glory.";
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wide border border-emerald-500/30">
          <Sliders className="w-3.5 h-3.5" /> Irish Festival Meteorological Stress Test
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          The &ldquo;Will It Be Grand?&rdquo; Simulator
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Dial in whatever apocalyptic weather or campsite disaster you can imagine. Our Leixlip quantum algorithm will compute the absolute truth.
        </p>
      </div>

      {/* Bento 12-Column Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Controls Bento Column (Col 7 on LG) */}
        <div className="col-span-12 lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                Simulate Disaster Variables
              </h2>
              <span className="text-xs font-mono text-slate-400">Deterministic Engine</span>
            </div>

            <div className="space-y-4">
              {/* Rainfall slider */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">🌧️ Predicted Rainfall:</span>
                  <span className="text-sky-400 font-bold">{rainMm} mm {rainMm > 50 ? '(Biblical)' : rainMm > 20 ? '(Heavy)' : '(Soft mist)'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rainMm}
                  onChange={(e) => setRainMm(Number(e.target.value))}
                  className="w-full accent-sky-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Wind Gusts */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">💨 Atlantic Wind Gusts:</span>
                  <span className="text-amber-400 font-bold">{windKmh} km/h {windKmh > 70 ? '(Tent Lifter)' : '(Fresh breeze)'}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  value={windKmh}
                  onChange={(e) => setWindKmh(Number(e.target.value))}
                  className="w-full accent-amber-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Mud Depth */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">🥾 Stradbally Mud Squelch Depth:</span>
                  <span className="text-amber-600 font-bold">{mudDepthCm} cm {mudDepthCm > 15 ? '(Boot Swallower)' : '(Dewy Grass)'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={mudDepthCm}
                  onChange={(e) => setMudDepthCm(Number(e.target.value))}
                  className="w-full accent-amber-600 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Missing Tent Pegs */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">🎪 Missing Tent Pegs:</span>
                  <span className="text-rose-400 font-bold">{tentPegsMissing} pegs lost</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={tentPegsMissing}
                  onChange={(e) => setTentPegsMissing(Number(e.target.value))}
                  className="w-full accent-rose-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Lukewarm Cans */}
              <div className="space-y-1.5 p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-300">🥫 Lukewarm Cans in Tent:</span>
                  <span className="text-emerald-400 font-bold">{lukewarmCans} cans ready</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={lukewarmCans}
                  onChange={(e) => setLukewarmCans(Number(e.target.value))}
                  className="w-full accent-emerald-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              onClick={calculateVerdict}
              disabled={isCalculating}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-950 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 disabled:opacity-50"
            >
              {isCalculating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing Irish Resilience...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-950" />
                  <span>Re-Run Irish Grandness Algorithm</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setRainMm(85);
                setWindKmh(95);
                setMudDepthCm(28);
                setTentPegsMissing(8);
                setLukewarmCans(2);
                calculateVerdict();
              }}
              className="py-3.5 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs border border-slate-700 cursor-pointer"
            >
              Max Catastrophe
            </button>
          </div>
        </div>

        {/* The Result Bento Column (Col 5 on LG) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col justify-between">
          <div className="h-full bg-gradient-to-b from-slate-900 via-emerald-950/40 to-slate-950 border-2 border-emerald-500/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {/* Glow backdrop */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                  Algorithm Verdict Engine
                </span>
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Deterministic
                </span>
              </div>

              {isCalculating ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <p className="text-sm font-mono text-emerald-300">{calculationStep}</p>
                </div>
              ) : (
                <div className="space-y-4 py-2">
                  <div className="text-xs uppercase tracking-wider text-slate-400">
                    Calculated Festival Status:
                  </div>

                  <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-emerald-400">
                    IT&apos;LL BE GRAND!
                  </div>

                  {/* Grand-O-Meter gauge */}
                  <div className="space-y-1.5 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Grand-O-Meter Pinned At:</span>
                      <span className="text-emerald-400">100.0% (MAXIMUM)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5">
                      <div className="bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-300 h-full rounded-full w-full animate-pulse" />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                      <span>Not Grand (Error 404)</span>
                      <span>100% Absolutely Grand</span>
                    </div>
                  </div>

                  <div className="text-sm text-slate-200 leading-relaxed pt-1">
                    <strong>Algorithmic Rationale:</strong> {getCustomRationale()}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Tested in Stradbally conditions since 2004</span>
              <button
                onClick={() => soundFX.playGrandChime()}
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" /> Chime
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
