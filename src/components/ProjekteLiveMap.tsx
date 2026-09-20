import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  MapPin, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RotateCw,
  Compass,
  Building,
  Home,
  CheckCircle2
} from "lucide-react";

interface ProjekteLiveMapProps {
  className?: string;
}

export default function ProjekteLiveMap({ className = "" }: ProjekteLiveMapProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mapReloadKey, setMapReloadKey] = useState(0);

  const embedUrl = `https://www.google.com/maps/d/embed?mid=1z-n6YWwVYJm4XanpirQBggOPXsE&femb=1&ll=48.79184350179503%2C11.434407199901283&z=14`;
  const externalViewerUrl = `https://www.google.com/maps/d/u/0/viewer?mid=1z-n6YWwVYJm4XanpirQBggOPXsE&femb=1&ll=48.79184350179503%2C11.434407199901283&z=14`;

  const handleReload = () => {
    setMapReloadKey((prev) => prev + 1);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full ${className}`}
    >
      <div className="relative rounded-[28px] md:rounded-[36px] bg-white/90 backdrop-blur-xl border border-stone-200/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] overflow-hidden">
        
        {/* Top Control & Status Header */}
        <div className="p-6 md:p-8 border-b border-stone-200/80 bg-stone-50/70 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-stone-200/80 text-[10px] md:text-[11px] font-mono uppercase tracking-widest text-[#ff8200] font-semibold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#ff8200] animate-pulse" />
              <span>Google My Maps &bull; Live-Standortkarte</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl text-stone-900 font-medium tracking-tight">
              Interaktive Projekt- &amp; Standortkarte
            </h3>
            <p className="text-xs md:text-sm text-stone-600 font-light max-w-2xl leading-relaxed">
              Erkunden Sie alle realisierten sowie aktuellen Bauvorhaben von <strong>Projektentwicklung Wohnraum (Fehlner &amp; Götz)</strong> direkt auf der interaktiven Landkarte. Klicken Sie auf die Marker, um Detailinformationen zu Lage und Bauwerk abzurufen.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleReload}
              title="Kartenansicht neu laden"
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-950 border border-stone-200/80 text-xs font-mono tracking-wider transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <RotateCw className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden sm:inline">Aktualisieren</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-950 border border-stone-200/80 text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              {isExpanded ? (
                <>
                  <Minimize2 className="w-3.5 h-3.5 text-stone-600" />
                  <span>Kompakt</span>
                </>
              ) : (
                <>
                  <Maximize2 className="w-3.5 h-3.5 text-stone-600" />
                  <span>Vergrößern</span>
                </>
              )}
            </button>

            <a
              href={externalViewerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff8200] hover:bg-[#e67500] text-white text-xs font-mono uppercase tracking-widest font-semibold transition-all shadow-[0_6px_20px_-3px_rgba(255,130,0,0.35)] cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <span>In Google Maps öffnen</span>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>
        </div>

        {/* Live Google My Maps iFrame Stage */}
        <div className="relative w-full overflow-hidden bg-stone-100">
          <div 
            className={`w-full transition-all duration-500 ease-in-out ${
              isExpanded ? "h-[680px] md:h-[820px]" : "h-[460px] md:h-[560px]"
            }`}
          >
            <iframe
              key={mapReloadKey}
              src={embedUrl}
              width="100%"
              height="100%"
              className="w-full h-full border-0 select-none"
              title="Live-Karte der Bauprojekte - Fehlner & Götz"
              loading="lazy"
              allowFullScreen
            />
          </div>

          {/* Interactive Navigation Hint Overlay Pill */}
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto pointer-events-none flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-900/85 backdrop-blur-md text-white text-[11px] font-sans shadow-lg border border-white/10 pointer-events-auto">
              <Compass className="w-3.5 h-3.5 text-[#ff8200] animate-spin-slow" />
              <span>Interaktive Karte &bull; Verschieben, Zoomen &amp; Marker anklicken</span>
            </div>
          </div>
        </div>

        {/* Map Legend & Summary Footer */}
        <div className="p-4 sm:p-5 bg-white border-t border-stone-200/80 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-600">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff8200]" />
              <span>Mehrfamilienhäuser</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-800" />
              <span>Einfamilienhäuser &amp; Ensembles</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <span>Referenzen &amp; Neubauten</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-[#ff8200]" />
            <span>Fokus: Ingolstadt &bull; Gaimersheim &bull; Friedrichshofen &bull; Region 10</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
