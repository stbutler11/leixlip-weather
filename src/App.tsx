import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { Navbar } from './components/Navbar';
import { ElectricPicnicOutlook } from './components/ElectricPicnicOutlook';
import { LeixlipLocal } from './components/LeixlipLocal';
import { GrandOMeterSimulator } from './components/GrandOMeterSimulator';
import { DryingIndex } from './components/DryingIndex';
import { IrishGlossary } from './components/IrishGlossary';
import { AskLeixlipGuy } from './components/AskLeixlipGuy';
import { Footer } from './components/Footer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('electric-picnic');

  // Scroll to top on tab change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-bento-grid text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans antialiased">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'electric-picnic' && <ElectricPicnicOutlook />}
        {activeTab === 'leixlip-local' && <LeixlipLocal />}
        {activeTab === 'grand-o-meter' && <GrandOMeterSimulator />}
        {activeTab === 'drying-index' && <DryingIndex />}
        {activeTab === 'glossary' && <IrishGlossary />}
        {activeTab === 'ask-guy' && <AskLeixlipGuy />}
      </main>

      <Footer />
    </div>
  );
}
