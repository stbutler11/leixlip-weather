import React, { useState } from 'react';
import { HelpCircle, MessageSquare, Send, Sparkles, Volume2, Award } from 'lucide-react';
import { ASK_WEATHER_QUERIES } from '../data/weatherData';
import { soundFX } from '../utils/audioSynth';
import confetti from 'canvas-confetti';

export const AskLeixlipGuy: React.FC = () => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(0);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [customAnswer, setCustomAnswer] = useState<string | null>(null);

  const handleAskCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    // Generate authentic Leixlip weather guy verdict
    const lower = customQuestion.toLowerCase();
    let verdict = "";

    if (lower.includes('rain') || lower.includes('wet') || lower.includes('umbrella')) {
      verdict = "Look, you might get a soft drizzle or a heavy Atlantic front, but you're not made of sugar! Put on the waterproof jacket, keep your phone in a plastic bag, and it'll be grand.";
    } else if (lower.includes('electric picnic') || lower.includes('ep') || lower.includes('festival') || lower.includes('stradbally')) {
      verdict = "Official Stradbally outlook: Even if there's 50mm of mud and your tent is missing 4 pegs, the vibe will be unmatched. Pack wellies, bring two warm fleeces, and remember: It'll be 100% grand.";
    } else if (lower.includes('drying') || lower.includes('wash') || lower.includes('clothes')) {
      verdict = "Hang them out on the rotary line now! With this southerly breeze, t-shirts will be dry in 90 minutes. Just keep an eye on the sky over Maynooth around tea time.";
    } else if (lower.includes('jacket') || lower.includes('coat') || lower.includes('cold') || lower.includes('warm')) {
      verdict = "It's fierce mild out there. A hoodie or light fleece is plenty. Don't be walking down Leixlip Main Street in an Arctic expedition coat sweating buckets.";
    } else {
      verdict = `Look at it this way: In Ireland, the weather does whatever it wants anyway. As long as you have a good attitude, a warm brew, and reasonable footwear, it'll be grand!`;
    }

    setCustomAnswer(verdict);
    soundFX.playGrandChime();
    soundFX.speakVerdict(`Leixlip Weather Verdict: ${verdict}`);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#10b981', '#f59e0b'],
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wide border border-emerald-500/30">
          <HelpCircle className="w-3.5 h-3.5" /> Direct Line to Kildare Wisdom
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Ask the Leixlip Weather Guy
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          No robotic algorithmic jargon. Just honest, dry, authentic local meteorological verdicts from the Salmon Leap.
        </p>
      </div>

      {/* Interactive Q&A Bento 12-Column Grid */}
      <div className="grid grid-cols-12 gap-5">
        {/* Preset Questions List Bento (Col 6 on LG) */}
        <div className="col-span-12 lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            Frequently Asked Kildare Weather Questions:
          </span>
          <div className="space-y-2.5">
            {ASK_WEATHER_QUERIES.map((q, idx) => {
              const isSelected = selectedQuestion === idx && !customAnswer;
              return (
                <button
                  key={q.question}
                  onClick={() => {
                    setSelectedQuestion(idx);
                    setCustomAnswer(null);
                    soundFX.speakVerdict(q.answer);
                  }}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-950 to-slate-900 border-emerald-400 text-white shadow-md ring-1 ring-emerald-400/40'
                      : 'bg-slate-950/70 border-slate-800/90 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div>
                    <div className="text-xs sm:text-sm font-semibold">{q.question}</div>
                    <span className="text-[10px] text-emerald-400/80 font-mono mt-1 inline-block">Category: {q.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Answer Display & Custom Query Bento (Col 6 on LG) */}
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-between gap-5">
          {/* Active Answer Bento Box */}
          <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border-2 border-emerald-500/50 space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between flex-1">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="font-bold text-white text-sm">Official Leixlip Verdict</span>
                </div>
                <button
                  onClick={() => {
                    const textToSpeak = customAnswer || (selectedQuestion !== null ? ASK_WEATHER_QUERIES[selectedQuestion].answer : "");
                    if (textToSpeak) soundFX.speakVerdict(textToSpeak);
                  }}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 px-3 py-1 bg-slate-800 rounded-xl border border-slate-700 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" /> Listen
                </button>
              </div>

              <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium pt-1">
                &ldquo;{customAnswer || (selectedQuestion !== null ? ASK_WEATHER_QUERIES[selectedQuestion].answer : "Select a question to view the verdict.")}&rdquo;
              </div>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between mt-4">
              <span>Overall Mood: <strong className="text-emerald-400">100% Unstoppable Grandness</strong></span>
              <span>📍 Salmon Leap Post</span>
            </div>
          </div>

          {/* Custom Question Form Bento */}
          <form onSubmit={handleAskCustom} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-xl">
            <div className="text-xs font-semibold text-slate-300">
              Ask your own Leixlip / Electric Picnic Weather Question:
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g. Will I need two pairs of socks on Saturday?"
                className="flex-1 px-4 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-2xl cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" /> Ask Guy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
