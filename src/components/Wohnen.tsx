import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import InteractiveBuilding3D from "./InteractiveBuilding3D";
import { 
  Building2, 
  Check, 
  Trees, 
  Sparkles, 
  ShieldCheck,
  Wind,
  Droplets,
  Layers,
  ArrowRight,
  Maximize2,
  ChevronDown,
  FileText,
  BookmarkCheck,
  Camera
} from "lucide-react";
import WohnenKontakt from "./WohnenKontakt";
import WohnenReservierenModal from "./WohnenReservierenModal";
import ArchitekturGalerie from "./ArchitekturGalerie";

// Types
export interface Unit {
  id: string;
  name: string;
  floor: "EG" | "1.OG" | "2.OG";
  rooms: string;
  area: number;
  price: number;
  type: string;
  status: "available" | "reserved" | "sold";
  bathrooms: number;
  gardenArea?: string;
  highlights: string[];
}

// 11 units at MFH (EG, 1.OG and 2.OG Penthouse Dachterrassen) - ALL AVAILABLE
const UNITS: Unit[] = [
  // Erdgeschoss (EG: 3 Einheiten)
  { 
    id: "WHG01", 
    name: "WHG 01", 
    floor: "EG", 
    rooms: "2 ZKB", 
    area: 67, 
    price: 489100, 
    type: "Terrasse & Privatgarten", 
    status: "available",
    bathrooms: 2,
    gardenArea: "265,81 m²",
    // STRICT SPEC: Wohnung 1 has EXCLUSIVELY this single highlight
    highlights: [
      "Riesige Gartenfläche mit 265,81 m²"
    ]
  },
  { 
    id: "WHG02", 
    name: "WHG 02", 
    floor: "EG", 
    rooms: "2 ZKB", 
    area: 40, 
    price: 296000, 
    type: "Sonnige Süd-Terrasse", 
    status: "available",
    bathrooms: 1,
    highlights: [
      "Sonnige Süd-Terrasse mit Privatsphäre"
    ]
  },
  { 
    id: "WHG03", 
    name: "WHG 03", 
    floor: "EG", 
    rooms: "2 ZKB", 
    area: 40, 
    price: 296000, 
    type: "Gartenanteil in Ruhelage", 
    status: "available",
    bathrooms: 1,
    gardenArea: "ca. 85 m²",
    highlights: [
      "Idyllischer privater Gartenanteil in Ruhelage"
    ]
  },
  
  // 1. Obergeschoss (1.OG: 4 Einheiten)
  { 
    id: "WHG04", 
    name: "WHG 04", 
    floor: "1.OG", 
    rooms: "2 ZKB", 
    area: 61, 
    price: 445300, 
    type: "Balkon mit Grünblick", 
    status: "available",
    bathrooms: 1,
    highlights: [
      "Großzügiger Balkon mit Blick ins Grüne"
    ]
  },
  { 
    id: "WHG05", 
    name: "WHG 05", 
    floor: "1.OG", 
    rooms: "2 ZKB", 
    area: 67, 
    price: 485750, 
    type: "Großer Sonnenbalkon", 
    status: "available",
    bathrooms: 1,
    highlights: [
      "Weitläufiger Sonnenbalkon in bester Südausrichtung"
    ]
  },
  { 
    id: "WHG06", 
    name: "WHG 06", 
    floor: "1.OG", 
    rooms: "2 ZKB", 
    area: 40, 
    price: 296000, 
    type: "Süd-Balkon", 
    status: "available",
    bathrooms: 1,
    highlights: [
      "Attraktiver Sonnenbalkon in ruhiger Südlage"
    ]
  },
  { 
    id: "WHG07", 
    name: "WHG 07", 
    floor: "1.OG", 
    rooms: "2 ZKB", 
    area: 40, 
    price: 296000, 
    type: "Geschützte Loggia", 
    status: "available",
    bathrooms: 1,
    highlights: [
      "Geschützte Loggia mit hervorragender Privatsphäre"
    ]
  },
  
  // 2. Obergeschoss (Penthouse Dachterrassen: 4 Einheiten)
  { 
    id: "WHG08", 
    name: "WHG 08", 
    floor: "2.OG", 
    rooms: "2 ZKB", 
    area: 62, 
    price: 449500, 
    type: "Panorama-Dachterrasse", 
    status: "available",
    bathrooms: 1,
    highlights: [
      "Panorama-Dachterrasse mit weitem Fernblick"
    ]
  },
  { 
    id: "WHG09", 
    name: "WHG 09", 
    floor: "2.OG", 
    rooms: "3 ZKB", 
    area: 87, 
    price: 643800, 
    type: "Luxus-Dachterrasse", 
    status: "available",
    bathrooms: 2,
    highlights: [
      "Großflächige Luxus-Dachterrasse nach Süden"
    ]
  },
  { 
    id: "WHG10", 
    name: "WHG 10", 
    floor: "2.OG", 
    rooms: "3 ZKB", 
    area: 88, 
    price: 651200, 
    type: "Panorama Penthouse", 
    status: "available",
    bathrooms: 2,
    highlights: [
      "Panorama-Penthouse mit Rundum-Dachterrasse"
    ]
  },
  { 
    id: "WHG11", 
    name: "WHG 11", 
    floor: "2.OG", 
    rooms: "2 ZKB", 
    area: 64, 
    price: 448000, 
    type: "Penthouse mit Westterrasse", 
    status: "available",
    bathrooms: 1,
    highlights: [
      "Private Sonnendachterrasse in Westausrichtung"
    ]
  }
];

export default function Wohnen() {
  // Multi-selection state
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null);
  // Floor filter for the selection grid
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<"ALL" | "EG" | "1.OG" | "2.OG">("ALL");

  // Reservation & Exposé Modal State
  const [isReservierenModalOpen, setIsReservierenModalOpen] = useState(false);
  const [reservierenModalMode, setReservierenModalMode] = useState<"reserve" | "expose">("reserve");

  // Multi-unit toggle (without automatic scrolling)
  const handleToggleSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedUnitIds.includes(id) && hoveredUnitId === id) {
      setHoveredUnitId(null);
    }
    setSelectedUnitIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((uId) => uId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleDeselectAll = () => {
    setSelectedUnitIds([]);
    setHoveredUnitId(null);
  };

  // Scroll to 3D model and center it in viewport
  const scrollTo3DModel = () => {
    const stageEl = document.getElementById("building-3d-container") || document.getElementById("building-stage");
    if (!stageEl) return;

    const navbar = document.getElementById("navbar");
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80;

    const rect = stageEl.getBoundingClientRect();
    const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const elementTop = rect.top + currentScrollY;
    const elementHeight = rect.height;

    const windowHeight = window.innerHeight;
    const availableHeight = windowHeight - navbarHeight;

    let targetScrollY: number;
    if (elementHeight >= availableHeight) {
      // If the element is tall, align top with a clean margin below navbar
      targetScrollY = elementTop - navbarHeight - 16;
    } else {
      // Center the element in the available space between navbar bottom and window bottom
      const offset = (availableHeight - elementHeight) / 2;
      targetScrollY = elementTop - navbarHeight - offset;
    }

    window.scrollTo({
      top: Math.max(0, targetScrollY),
      behavior: "smooth"
    });
  };

  // Filtered units according to selected floor filter
  const filteredUnits = selectedFloorFilter === "ALL" 
    ? UNITS 
    : UNITS.filter(u => u.floor === selectedFloorFilter);

  // Selected units metrics
  const selectedUnits = UNITS.filter((u) => selectedUnitIds.includes(u.id));
  const totalSelectedArea = selectedUnits.reduce((sum, u) => sum + u.area, 0);
  const totalSelectedPrice = selectedUnits.reduce((sum, u) => sum + u.price, 0);

  return (
    <div className="bg-[#fbfbfd] text-stone-900 min-h-screen font-sans selection:bg-[#ff8200]/25 selection:text-stone-900 relative">
      
      {/* Ambient Apple light backdrop */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] left-[25%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-amber-200/15 via-[#ff8200]/8 to-transparent blur-[140px]"></div>
        <div className="absolute top-[45%] -right-[15%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-bl from-orange-200/10 via-amber-100/15 to-transparent blur-[160px]"></div>
        <div className="absolute bottom-[5%] left-[5%] w-[45vw] h-[45vw] rounded-full bg-stone-200/20 blur-[130px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-32 sm:pt-40 pb-36 space-y-36 sm:space-y-48">
        
        {/* =========================================================================
            1. HERO SECTION (APPLE MINIMALISM & BIDIRECTIONAL SCROLL)
            ========================================================================= */}
        <motion.section 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100/90 border border-stone-200/70 text-[11px] font-mono uppercase tracking-widest text-stone-600">
            <span className="w-2 h-2 rounded-full bg-[#ff8200]"></span>
            <span>Neubau 2026 &bull; Fehlner &amp; Götz</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-stone-900 leading-[1.05]">
            Wohnen. <br />
            <span className="text-[#ff8200]">Formvollendet.</span>
          </h1>

          <div className="space-y-3 max-w-3xl mx-auto">
            <p className="text-xl sm:text-2xl md:text-3xl text-stone-800 font-normal tracking-tight leading-snug">
              11 exklusive Eigentumswohnungen &bull; Neubauprojekt Ingolstadt Etting &bull; Konrad-Strobl-Straße 6
            </p>
            <p className="text-sm sm:text-base text-stone-500 font-light max-w-2xl mx-auto leading-relaxed">
              Provisionsfrei direkt vom Bauträger Fehlner &amp; Götz. Höchste KfW-40-QNG Energieeffizienz, 
              barrierefreie Zugänge und exklusive Freibereiche in idyllischer Ruhelage.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={scrollTo3DModel}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-stone-900 hover:bg-[#ff8200] text-white text-xs font-mono uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer"
            >
              <span>3D-Modell entdecken</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById("architektur-impressionen");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-stone-950 border border-stone-200/80 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-xs font-mono uppercase tracking-widest transition-all cursor-pointer hover:border-stone-400 active:scale-[0.98]"
            >
              <Camera className="w-4 h-4 text-[#ff8200]" />
              <span>Visualisierungen (18 Bilder)</span>
            </button>

            <button
              onClick={() => {
                setReservierenModalMode("expose");
                setIsReservierenModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#ff8200] hover:bg-[#e67500] text-white shadow-[0_10px_25px_-5px_rgba(255,130,0,0.4)] text-xs font-mono uppercase tracking-widest font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText className="w-4 h-4 stroke-[2.5]" />
              <span>Exposé anfordern</span>
            </button>
          </div>
        </motion.section>

        {/* =========================================================================
            2. INTERACTIVE 3D ARCHITECTURAL MODEL (BIDIRECTIONAL SCROLL)
            ========================================================================= */}
        <motion.section 
          id="building-stage"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2 border-b border-stone-200/60">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#ff8200] font-bold block mb-1">
                Perspektive
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                360° Gebäude-Modell
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md">
              Klicken Sie auf eine beliebige Wohnung im Modell, um sie auszuwählen und hervorzuheben.
            </p>
          </div>

          {/* 3D Stage Container */}
          <div 
            id="building-3d-container"
            className="relative rounded-[36px] bg-white/70 backdrop-blur-2xl border border-stone-200/60 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden p-3 sm:p-6"
          >
            <InteractiveBuilding3D
              units={UNITS}
              selectedUnitIds={selectedUnitIds}
              hoveredUnitId={hoveredUnitId}
              soldUnitIds={[]}
              onUnitClick={(unitId) => handleToggleSelect(unitId)}
              onUnitHover={(unitId) => setHoveredUnitId(unitId)}
              mode="wohnen"
              heightClass="h-[520px] sm:h-[640px]"
            />
          </div>
        </motion.section>

        {/* =========================================================================
            3. UNSERE AUSSTATTUNG / WAS UNS AUSMACHT (BIDIRECTIONAL SCROLL)
            Minimalistischer Apple-Stil mit viel Whitespace & prägnanten Qualitätsmerkmalen
            ========================================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-14"
        >
          {/* Section Header */}
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#ff8200] font-bold block">
              Qualität &bull; Was uns ausmacht
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 leading-[1.1]">
              Ausstattung ohne Kompromisse.
            </h2>
            <p className="text-base sm:text-xl text-stone-500 font-light leading-relaxed">
              Jedes bauliche und technische Detail ist auf dauerhaften Wohnkomfort, 
              minimale Energiekosten und höchste Wertbeständigkeit ausgelegt.
            </p>
          </div>

          {/* 5 Distinct Apple Feature Blocks with Staggered Bidirectional Animations */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            
            {/* 1. KfW-40 Niedrigenergiebauweise */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                  Bauphysik &bull; Effizienz
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                  KfW-40 Niedrigenergiebauweise
                </h3>
                <p className="text-sm sm:text-base text-stone-500 font-light leading-relaxed">
                  Zukunftssichere Gebäudehülle für minimale Heiz- und Betriebskosten. 
                  Erfüllt die strengsten Förderstandards und sichert attraktive Zinsvorteile.
                </p>
              </div>
            </motion.div>

            {/* 2. Luft-Wasser-Wärmepumpe */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                  Ökologie &bull; Wärme
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                  Luft-Wasser-Wärmepumpe
                </h3>
                <p className="text-sm sm:text-base text-stone-500 font-light leading-relaxed">
                  100 % fossilfreie, hocheffiziente Wärmeerzeugung kombiniert mit 
                  behaglicher Fußbodenheizung und individueller Einzelraumregulierung.
                </p>
              </div>
            </motion.div>

            {/* 3. Dezentrale Wohnraumlüftung */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                <Wind className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                  Raumluft &bull; Wohlbefinden
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                  Lüftung mit Wärmerückgewinnung
                </h3>
                <p className="text-sm sm:text-base text-stone-500 font-light leading-relaxed">
                  Dezentrale Wohnraumlüftung für kontinuierlich frische, pollengefilterte Raumluft 
                  bei optimaler Geräuschdämmung und ohne Wärmeverluste.
                </p>
              </div>
            </motion.div>

            {/* 4. Schwellenlose Zugänge zu Terrassen & Balkonen */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-8"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                <Maximize2 className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                  Komfort &bull; Freiraum
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                  Schwellenlose Austritte
                </h3>
                <p className="text-sm sm:text-base text-stone-500 font-light leading-relaxed">
                  Fließende, barrierearme Übergänge vom Wohnraum direkt auf 
                  Terrassen, Loggien und Dachterrassen für ein grenzenloses Raumgefühl.
                </p>
              </div>
            </motion.div>

            {/* 5. Hochwertige Sanitär- und Elektroausstattung */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-8 md:col-span-2 lg:col-span-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="space-y-3 max-w-xl">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                  Design &bull; Zukunftsfähigkeit
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                  Hochwertige Sanitär- &amp; Elektroausstattung
                </h3>
                <p className="text-sm sm:text-base text-stone-500 font-light leading-relaxed">
                  Formschöne Marken-Sanitärobjekte, bodengleiche Walk-in-Duschen, 
                  großformatiges Feinsteinzeug sowie zukunftssichere Smart-Home-Infrastruktur 
                  und vorbereitete Wallbox-Ladeanschlüsse für jedes Fahrzeug.
                </p>
              </div>
            </motion.div>

          </div>
        </motion.section>

        {/* =========================================================================
            3.5 ARCHITEKTUR & IMPRESSIONEN (APPLE-STYLE STICKY-SCROLL GALERIE)
            Alle 18 High-End Visualisierungs-Bilder direkt unter Ausstattung ohne Kompromisse
            ========================================================================= */}
        <ArchitekturGalerie />

        {/* =========================================================================
            4. MEHRFACHAUSWAHL & HARMONISIERTE EINHEITEN-ANSICHT (BIDIRECTIONAL SCROLL)
            Kein Pop-up mehr! Flächen-Angaben harmonisch integriert (nicht oversized)
            ========================================================================= */}
        <motion.section 
          id="apartments-overview"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-stone-200/70">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#ff8200] font-bold block mb-1">
                Wohnungsübersicht
              </span>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900">
                Alle Einheiten im Detail.
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2 p-1.5 rounded-full bg-stone-100/90 border border-stone-200/60 self-start md:self-auto">
              {[
                { label: "Alle (11)", value: "ALL" },
                { label: "Erdgeschoss (3)", value: "EG" },
                { label: "1. OG (4)", value: "1.OG" },
                { label: "Penthouse (4)", value: "2.OG" }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedFloorFilter(tab.value as any)}
                  className={`px-4 py-2 rounded-full text-xs font-mono transition-all cursor-pointer ${
                    selectedFloorFilter === tab.value
                      ? "bg-stone-900 text-white shadow-sm font-semibold"
                      : "text-stone-600 hover:text-stone-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Selection Summary Banner (when units are chosen) */}
          <AnimatePresence>
            {selectedUnits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-r from-orange-50/90 via-amber-50/70 to-stone-50/80 border border-orange-200/80 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff8200] animate-pulse"></span>
                    <span className="font-mono text-xs uppercase tracking-widest text-[#ff8200] font-bold">
                      Aktuelle Mehrfachauswahl
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
                    {selectedUnits.length} {selectedUnits.length === 1 ? "Einheit gewählt" : "Einheiten gewählt"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {selectedUnits.map((u) => (
                      <span
                        key={u.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-stone-200/80 rounded-xl text-xs font-mono font-medium text-stone-800 shadow-2xs"
                      >
                        {u.name} &bull; {u.area} m²
                        <button
                          type="button"
                          onClick={(e) => handleToggleSelect(u.id, e)}
                          className="hover:text-red-500 font-bold ml-0.5 text-stone-400"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 self-stretch md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-stone-200/60">
                  <div>
                    <span className="text-xs font-mono uppercase text-stone-500 block">
                      Gesamtkaufpreis
                    </span>
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-stone-900">
                      € {totalSelectedPrice.toLocaleString("de-DE")}
                    </span>
                    <span className="text-xs text-stone-500 block">
                      {totalSelectedArea} m² Wohnfläche kombiniert
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 self-stretch sm:self-auto">
                    <button
                      type="button"
                      onClick={() => {
                        setReservierenModalMode("reserve");
                        setIsReservierenModalOpen(true);
                      }}
                      className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-[#ff8200] hover:bg-[#e67500] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-[0_8px_20px_-4px_rgba(255,130,0,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <BookmarkCheck className="w-4 h-4 stroke-[2.5]" />
                      <span>{selectedUnits.length === 1 ? "Wohnung reservieren" : "Auswahl reservieren"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="px-4 py-3.5 rounded-2xl bg-white hover:bg-stone-100 border border-stone-200 text-xs font-mono uppercase tracking-wider text-stone-600 transition-all cursor-pointer font-medium shadow-2xs text-center"
                    >
                      Aufheben
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* HARMONIZED APARTMENT CARDS GRID (BIDIRECTIONAL SCROLL ANIMATION) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredUnits.map((unit, index) => {
              const isSelected = selectedUnitIds.includes(unit.id);
              const isHovered = hoveredUnitId === unit.id;
              const isWohnung1 = unit.id === "WHG01";

              return (
                <motion.div
                  id={`unit-card-${unit.id}`}
                  key={unit.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ 
                    duration: 0.75, 
                    delay: (index % 3) * 0.08, 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  onClick={() => handleToggleSelect(unit.id)}
                  onMouseEnter={() => setHoveredUnitId(unit.id)}
                  onMouseLeave={() => setHoveredUnitId(null)}
                  className={`group relative rounded-[32px] p-8 sm:p-9 transition-all duration-500 cursor-pointer flex flex-col justify-between space-y-7 scroll-mt-36 ${
                    isSelected
                      ? "bg-white border-2 border-[#ff8200] shadow-[0_24px_50px_-10px_rgba(255,130,0,0.18)] ring-4 ring-[#ff8200]/10"
                      : isHovered
                      ? "bg-white border-2 border-[#ff8200]/60 shadow-[0_20px_45px_-12px_rgba(255,130,0,0.12)] -translate-y-1"
                      : "bg-white/85 backdrop-blur-xl border border-stone-200/80 hover:border-stone-300 shadow-[0_14px_36px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.07)] hover:-translate-y-1"
                  }`}
                >
                  {/* Top Bar: Floor Badge & Selection Action */}
                  <div className="flex justify-between items-center">
                    <span className="px-3.5 py-1 rounded-full bg-stone-100 text-stone-700 font-mono text-xs font-bold uppercase tracking-wider">
                      {unit.floor === "2.OG" ? "Penthouse" : unit.floor}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => handleToggleSelect(unit.id, e)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#ff8200] text-white shadow-sm"
                          : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Gewählt</span>
                        </>
                      ) : (
                        <span>Auswählen</span>
                      )}
                    </button>
                  </div>

                  {/* Header: Name & Type */}
                  <div className="space-y-1.5">
                    <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 group-hover:text-[#ff8200] transition-colors">
                      {unit.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 font-light">
                      {unit.type}
                    </p>
                  </div>

                  {/* HARMONIZED SPECS ROW (Dezent, harmonisch & hochwertig integriert, nicht oversized) */}
                  <div className="flex items-center justify-between py-3 border-y border-stone-100/90 text-stone-600 text-xs sm:text-sm font-mono">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-900">{unit.area} m²</span>
                      <span className="text-stone-300">&bull;</span>
                      <span>{unit.rooms}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-bold uppercase tracking-wider">
                      <span>KfW 40 QNG</span>
                    </div>
                  </div>

                  {/* SPECIFIC HIGHLIGHT BADGE */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400 block">
                      Besonderes Merkmal:
                    </span>
                    <div className={`p-4 rounded-2xl flex items-start gap-3 transition-colors ${
                      isWohnung1
                        ? "bg-emerald-500/10 border border-emerald-500/25 text-emerald-950"
                        : "bg-stone-50 border border-stone-100/90 text-stone-800"
                    }`}>
                      {isWohnung1 ? (
                        <Trees className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-[#ff8200] shrink-0 mt-0.5" />
                      )}
                      <div className="min-w-0">
                        <span className={`text-sm leading-snug ${isWohnung1 ? "font-semibold text-emerald-950" : "font-medium"}`}>
                          {unit.highlights[0]}
                        </span>
                        {isWohnung1 && (
                          <span className="text-[11px] text-emerald-700 block mt-0.5 font-sans">
                            Exklusive private Alleinnutzung
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer: Price & Subtle Action Indicator */}
                  <div className="flex justify-between items-end pt-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 block">
                        Kaufpreis schlüsselfertig
                      </span>
                      <span className="text-xl sm:text-2xl font-mono font-bold text-stone-900">
                        € {unit.price.toLocaleString("de-DE")}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isSelected ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setReservierenModalMode("reserve");
                            setIsReservierenModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#ff8200] hover:bg-[#e67500] text-white text-xs font-mono uppercase tracking-wider font-semibold shadow-xs transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.02]"
                        >
                          <BookmarkCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Reservieren</span>
                        </button>
                      ) : (
                        <div className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-stone-400 group-hover:text-[#ff8200] transition-colors">
                          <span>Markieren</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* =========================================================================
            6. KONTAKT- & SALES-BEREICH (PROVISIONSFREIER DIREKTVERTRIEB & RESERVIERUNG)
            ========================================================================= */}
        <WohnenKontakt
          selectedUnits={selectedUnits}
          allUnits={UNITS}
          onToggleUnit={(id) => handleToggleSelect(id)}
          onClearSelection={handleDeselectAll}
          intentMode={reservierenModalMode}
        />

      </div>

      {/* =========================================================================
          5. STICKY FLOATING APPLE STATUS BAR (WHEN UNITS ARE SELECTED)
          ========================================================================= */}
      <AnimatePresence>
        {selectedUnits.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 inset-x-0 z-40 px-4 sm:px-6 pointer-events-none"
          >
            <div className="max-w-3xl mx-auto rounded-full bg-stone-900/90 backdrop-blur-2xl text-white px-6 sm:px-8 py-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 flex items-center justify-between gap-4 pointer-events-auto">
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff8200] shrink-0 animate-pulse"></span>
                <div className="truncate">
                  <span className="font-mono text-xs sm:text-sm font-semibold block truncate">
                    {selectedUnits.length} {selectedUnits.length === 1 ? "Einheit gewählt" : "Einheiten gewählt"} ({selectedUnits.map(u => u.name).join(", ")})
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
                    {totalSelectedArea} m² Gesamtfläche
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                <span className="font-mono text-sm sm:text-base font-bold text-[#ff8200]">
                  € {totalSelectedPrice.toLocaleString("de-DE")}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setReservierenModalMode("reserve");
                    setIsReservierenModalOpen(true);
                  }}
                  className="px-4 sm:px-5 py-2 rounded-full bg-[#ff8200] hover:bg-[#e67500] text-white text-[11px] font-mono uppercase tracking-wider font-semibold shadow-sm transition-all cursor-pointer flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <BookmarkCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Reservieren</span>
                </button>
                
                <button
                  type="button"
                  onClick={handleDeselectAll}
                  className="text-[11px] font-mono uppercase tracking-wider text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Aufheben
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Apple Reservation & Exposé Modal */}
      <WohnenReservierenModal
        isOpen={isReservierenModalOpen}
        onClose={() => setIsReservierenModalOpen(false)}
        selectedUnits={selectedUnits}
        allUnits={UNITS}
        initialMode={reservierenModalMode}
        onToggleUnit={(id) => handleToggleSelect(id)}
        onClearSelection={handleDeselectAll}
      />

    </div>
  );
}
