// Web Audio API synthesizer for interactive Irish weather audio cues

class SoundFX {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Celebratory "Grand Fanfare" Chime
  playGrandChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Cheerful Celtic major pentatonic arpeggio (C5, D5, E5, G5, A5, C6)
      const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + index * 0.09);

        gain.gain.setValueAtTime(0, now + index * 0.09);
        gain.gain.linearRampToValueAtTime(0.18, now + index * 0.09 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.09 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.09);
        osc.stop(now + index * 0.09 + 0.85);
      });
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  // Soft rain ambient burst
  playSoftRain(durationSeconds = 2.5) {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const bufferSize = this.ctx.sampleRate * durationSeconds;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Pink noise generation
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
        b6 = white * 0.115926;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1200;

      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.5);
      gain.gain.linearRampToValueAtTime(0.001, now + durationSeconds);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + durationSeconds);
    } catch {
      // ignore
    }
  }

  // Irish Weather Guy voice proclamation
  speakVerdict(text = "Official Leixlip Weather verdict for Electric Picnic 2026: It will be grand!") {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.05;
      utterance.rate = 0.95;

      const voices = window.speechSynthesis.getVoices();
      // Try to find Irish or UK English voice
      const irishVoice = voices.find(v => v.lang === 'en-IE') || 
                         voices.find(v => v.lang === 'en-GB') || 
                         voices.find(v => v.lang.startsWith('en'));
      if (irishVoice) {
        utterance.voice = irishVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  }
}

export const soundFX = new SoundFX();
