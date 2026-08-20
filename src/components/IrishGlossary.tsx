import React, { useState } from 'react';
import { BookOpen, Volume2, Search, Sparkles } from 'lucide-react';
import { IRISH_GLOSSARY } from '../data/weatherData';
import { soundFX } from '../utils/audioSynth';

export const IrishGlossary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Rain', 'Temperature', 'General Vibe', 'Laundry'];

  const filteredTerms = IRISH_GLOSSARY.filter((item) => {
    const matchesSearch = 
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.actualIrishMeaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.exampleUsage.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.meteorologicalCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const speakTerm = (term: string, example: string) => {
    soundFX.speakVerdict(`${term}. For example: ${example}`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase tracking-wide border border-emerald-500/30">
          <BookOpen className="w-3.5 h-3.5" /> Irish Meteorological Lexicon
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          The Irish Weather Slang &amp; Lore Dictionary
        </h1>
        <p className="text-slate-300 text-sm sm:text-base">
          Decoding the nuanced, poetic, and stoic language used across Leixlip, Kildare, and the fields of Stradbally.
        </p>
      </div>

      {/* Filter and Search Bar Bento Tile */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/90 p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search terms (e.g., grand, mild, soft)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-2xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bento Grid of Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerms.map((item) => (
          <div
            key={item.term}
            className="p-6 rounded-3xl bg-slate-900/85 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4 group shadow-lg"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-white group-hover:text-emerald-300 transition-colors">
                      &ldquo;{item.term}&rdquo;
                    </h2>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {item.meteorologicalCategory}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 block mt-0.5">{item.phonetic}</span>
                </div>

                <button
                  onClick={() => speakTerm(item.term, item.exampleUsage)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white cursor-pointer transition-colors"
                  title="Pronounce & Hear Example"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              {/* Meanings */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Literal Translation:</span>{' '}
                  <span className="text-slate-300 italic">{item.literalMeaning}</span>
                </div>
                <div>
                  <span className="text-emerald-400 font-semibold">Actual Irish Meaning:</span>{' '}
                  <p className="text-slate-100 text-sm mt-0.5 font-medium leading-relaxed">
                    {item.actualIrishMeaning}
                  </p>
                </div>
              </div>

              {/* Example */}
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs text-amber-300/90 italic">
                💬 {item.exampleUsage}
              </div>
            </div>

            {/* Leixlip Context */}
            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800/60 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span><strong>Leixlip Observation:</strong> {item.leixlipContext}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
