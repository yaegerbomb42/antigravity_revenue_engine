"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [scripts, setScripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setScripts(data.scripts || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-6 sm:p-24 overflow-hidden bg-background">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

      {/* Navigation */}
      <nav className="absolute top-0 w-full max-w-7xl flex justify-between items-center p-8 z-10">
        <div className="text-2xl font-bold tracking-tighter text-gradient">GRAVITYCLIP AI</div>
        <div className="flex gap-8 text-sm font-medium text-foreground/60">
          <a href="#" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold tracking-widest uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          New: Viral Hook Engine v2
        </div>

        <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.1]">
          Turn <span className="text-gradient">YouTube</span> into <br />
          Viral Shorts in Seconds.
        </h1>

        <p className="max-w-xl mx-auto text-lg text-foreground/50 leading-relaxed">
          The only AI engine designed to break the algorithm. Paste a link, get 3 viral scripts optimized for TikTok, Reels, and YT Shorts.
        </p>

        {/* Input Card */}
        <div className="glass-card p-2 max-w-2xl mx-auto flex flex-col sm:flex-row gap-2 mt-12 transition-all duration-300 hover:border-white/20">
          <input
            type="text"
            placeholder="Paste YouTube Link (e.g. youtube.com/watch?v=...)"
            className="flex-1 bg-transparent px-6 py-4 outline-none text-foreground placeholder:text-foreground/30 font-medium"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            className="btn-primary px-8 py-4 rounded-[18px] font-bold text-white whitespace-nowrap"
          >
            Generate Viral Scripts
          </button>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="pt-12 animate-pulse text-accent font-bold tracking-widest uppercase text-xs">
            Breaking the algorithm...
          </div>
        )}

        {scripts.length > 0 && (
          <div className="pt-12 grid gap-6 max-w-2xl mx-auto text-left">
            <h2 className="text-xl font-bold text-center mb-4">Your Viral Scripts</h2>
            {scripts.map((script, i) => (
              <div key={i} className="glass-card p-8 space-y-4 hover:border-accent/40 transition-colors">
                <div className="text-xs font-bold text-accent uppercase tracking-widest">Script #{i + 1}</div>
                <div>
                  <span className="text-xs font-bold text-foreground/40 uppercase block mb-1">Hook</span>
                  <p className="font-medium">{script.hook}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground/40 uppercase block mb-1">Story</span>
                  <p className="text-foreground/70">{script.story}</p>
                </div>
                <div className="pt-4 flex justify-between items-center border-t border-white/5">
                  <button className="text-[10px] font-bold uppercase tracking-widest text-accent hover:text-white transition-colors">Copy Script</button>
                  <a href="https://pictory.ai?ref=antigravity" target="_blank" className="btn-primary text-[10px] px-4 py-2 rounded-full font-bold text-white">Create Video with Pictory</a>
                </div>
              </div>
            ))}

            {/* Affiliate Upsell */}
            <div className="glass-card p-6 bg-accent/5 border-accent/20 text-center">
              <p className="text-sm font-medium mb-4 italic text-foreground/70">"Need high-quality avatars for these scripts?"</p>
              <a href="https://www.synthesia.io?ref=antigravity" target="_blank" className="inline-block text-xs font-bold text-accent uppercase tracking-[0.2em] border-b-2 border-accent pb-1 hover:text-white hover:border-white transition-all">Try Synthesia AI Now</a>
            </div>
          </div>
        )}

        {/* Social Proof / Stats */}
        <div className="flex flex-wrap justify-center gap-12 pt-16 opacity-40">
          <div className="text-center">
            <div className="text-xl font-bold italic">1.2M+</div>
            <div className="text-[10px] uppercase tracking-widest font-bold">Views Generated</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold italic">450+</div>
            <div className="text-[10px] uppercase tracking-widest font-bold">Daily Creators</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold italic">24/7</div>
            <div className="text-[10px] uppercase tracking-widest font-bold">AI Processing</div>
          </div>
        </div>
      </div>

      {/* Footer Area with Affiliate Hooks */}
      <footer className="absolute bottom-8 text-[10px] text-foreground/20 font-medium tracking-widest uppercase">
        Built for Revenue Velocity by Antigravity AI
      </footer>
    </main>
  );
}
