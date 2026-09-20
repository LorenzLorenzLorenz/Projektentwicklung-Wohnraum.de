import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import InteractiveBuilding3D from "./InteractiveBuilding3D";
import ArchitekturGalerie from "./ArchitekturGalerie";
import { 
  Building, 
  Check, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Sliders, 
  Send, 
  FileCheck, 
  Coins, 
  ChevronDown, 
  Info,
  ArrowRight,
  Landmark,
  Layers,
  ArrowUpRight,
  Camera,
  FileText
} from "lucide-react";

// Types
export interface Unit {
  id: string;
  name: string;
  floor: "EG" | "1.OG" | "2.OG";
  rooms: string;
  area: number;
  price: number;
  type: string;
  status?: "available" | "reserved" | "sold";
}

// 11 units at MFH (EG, 1.OG and 2.OG Penthouse Dachterrassen)
const UNITS: Unit[] = [
  // Erdgeschoss (EG: 3 Einheiten)
  { id: "WHG01", name: "WHG 01", floor: "EG", rooms: "2 ZKB", area: 67, price: 489100, type: "Terrasse & Privatgarten" },
  { id: "WHG02", name: "WHG 02", floor: "EG", rooms: "2 ZKB", area: 40, price: 296000, type: "Süd-Terrasse" },
  { id: "WHG03", name: "WHG 03", floor: "EG", rooms: "2 ZKB", area: 40, price: 296000, type: "Gartenanteil" },
  
  // 1. Obergeschoss (1.OG: 4 Einheiten)
  { id: "WHG04", name: "WHG 04", floor: "1.OG", rooms: "2 ZKB", area: 61, price: 445300, type: "Balkon Grünblick" },
  { id: "WHG05", name: "WHG 05", floor: "1.OG", rooms: "2 ZKB", area: 67, price: 485750, type: "Sonnenbalkon" },
  { id: "WHG06", name: "WHG 06", floor: "1.OG", rooms: "2 ZKB", area: 40, price: 296000, type: "Süd-Balkon" },
  { id: "WHG07", name: "WHG 07", floor: "1.OG", rooms: "2 ZKB", area: 40, price: 296000, type: "Geschützte Loggia" },
  
  // 2. Obergeschoss (2.OG: 4 Einheiten / Penthouse Dachterrassen)
  { id: "WHG08", name: "WHG 08", floor: "2.OG", rooms: "2 ZKB", area: 62, price: 449500, type: "Panorama-Dachterrasse" },
  { id: "WHG09", name: "WHG 09", floor: "2.OG", rooms: "3 ZKB", area: 87, price: 643800, type: "Luxus-Dachterrasse" },
  { id: "WHG10", name: "WHG 10", floor: "2.OG", rooms: "3 ZKB", area: 88, price: 651200, type: "Panorama-Penthouse" },
  { id: "WHG11", name: "WHG 11", floor: "2.OG", rooms: "2 ZKB", area: 64, price: 448000, type: "West-Dachterrasse" }
];

export default function Investieren() {
  // --- States ---
  const [taxBurden, setTaxBurden] = useState<number>(65000); // Default €65.000 annual income tax burden
  const [conversionProgress, setConversionProgress] = useState<number>(0); // Default 0%
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null);
  const [selectedFloorFilter, setSelectedFloorFilter] = useState<"ALL" | "EG" | "1.OG" | "2.OG">("ALL");

  // Real-time availability: all units are available
  const [soldUnitIds] = useState<string[]>([]);

  // Lead form states
  const [investorName, setInvestorName] = useState<string>("");
  const [investorEmail, setInvestorEmail] = useState<string>("");
  const [investorPhone, setInvestorPhone] = useState<string>("");
  const [selectedInvestmentVolume, setSelectedInvestmentVolume] = useState<string>("500k-1m");
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  // --- Unit Classification Helpers ---
  const isSmallUnit = (u: Unit) => u.area === 40;
  const isPenthouseUnit = (u: Unit) => u.floor === "2.OG";
  const isLargeUnit = (u: Unit) => u.area >= 60 && u.floor !== "2.OG";

  // --- Real-time Availability Pools ---
  const availableUnits = UNITS.filter((u) => !soldUnitIds.includes(u.id));
  const availableSmallUnits = availableUnits.filter(isSmallUnit);
  const availablePenthouseUnits = availableUnits.filter(isPenthouseUnit);
  const availableLargeUnits = availableUnits.filter(isLargeUnit);

  // --- Dynamic Preset Availability Flags ---
  const isBasisAvailable = availableSmallUnits.length >= 1;
  const isOptimiertAvailable = availableSmallUnits.length >= 2 || availablePenthouseUnits.length >= 1;
  const isVollAvailable = (availableSmallUnits.length >= 2 && availableLargeUnits.length >= 1) || availablePenthouseUnits.length >= 2;

  // --- Helper to calculate preset progress dynamically from manual selection ---
  const getPresetProgress = (ids: string[]) => {
    if (ids.length === 0) return 0;
    
    const selected = UNITS.filter((u) => ids.includes(u.id));
    const smalls = selected.filter(isSmallUnit).length;
    const penthouses = selected.filter(isPenthouseUnit).length;
    const larges = selected.filter(isLargeUnit).length;
    
    // Check if it matches VOLL preset
    if ((smalls === 2 && larges === 1 && selected.length === 3) || (penthouses === 2 && selected.length === 2)) {
      return 100;
    }
    // Check if it matches OPTIMIERT preset
    if ((smalls === 2 && selected.length === 2) || (penthouses === 1 && selected.length === 1)) {
      return 65;
    }
    // Check if it matches BASIS preset
    if (smalls === 1 && selected.length === 1) {
      return 30;
    }
    
    // Fallback calculation: proportional percentage of reference investment (~€1.3M)
    const investment = selected.reduce((acc, u) => acc + u.price, 0);
    if (investment === 0) return 0;
    const maxReferencePrice = 1300000;
    const fraction = Math.min(1, investment / maxReferencePrice);
    return Math.round(15 + fraction * 85);
  };

  // --- Preset Handlers ---
  const handleBasisClick = () => {
    if (isBasisAvailable) {
      const selected = [availableSmallUnits[0].id];
      setSelectedUnitIds(selected);
      setConversionProgress(30);
    }
  };

  const handleOptimiertClick = () => {
    let selected: string[] = [];
    if (availableSmallUnits.length >= 2) {
      selected = availableSmallUnits.slice(0, 2).map((u) => u.id);
    } else if (availablePenthouseUnits.length >= 1) {
      selected = [availablePenthouseUnits[0].id];
    }
    if (selected.length > 0) {
      setSelectedUnitIds(selected);
      setConversionProgress(65);
    }
  };

  const handleVollClick = () => {
    let selected: string[] = [];
    if (availableSmallUnits.length >= 2 && availableLargeUnits.length >= 1) {
      selected = [
        ...availableSmallUnits.slice(0, 2).map((u) => u.id),
        availableLargeUnits[0].id
      ];
    } else if (availablePenthouseUnits.length >= 2) {
      selected = availablePenthouseUnits.slice(0, 2).map((u) => u.id);
    }
    if (selected.length > 0) {
      setSelectedUnitIds(selected);
      setConversionProgress(100);
    }
  };

  // --- Burst Animation for interactive click feedback ---
  interface Burst {
    id: number;
    unitId: string;
    x: number;
    y: number;
    particles: {
      id: number;
      angle: number;
      speed: number;
      color: string;
      size: number;
    }[];
  }
  const [activeBursts, setActiveBursts] = useState<Burst[]>([]);

  const triggerBurst = (unitId: string, event?: React.MouseEvent) => {
    let clickX = 50;
    let clickY = 50;
    
    if (event) {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      clickX = ((event.clientX - rect.left) / rect.width) * 100;
      clickY = ((event.clientY - rect.top) / rect.height) * 100;
    }

    const colors = ["#ff8200", "#fb923c", "#fcd34d", "#10b981", "#34d399", "#ffffff"];
    const particles = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      angle: Math.random() * Math.PI * 2,
      speed: 35 + Math.random() * 95,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 5,
    }));

    const newBurst: Burst = {
      id: Date.now() + Math.random(),
      unitId,
      x: clickX,
      y: clickY,
      particles
    };

    setActiveBursts((prev) => [...prev, newBurst]);
    setTimeout(() => {
      setActiveBursts((prev) => prev.filter((b) => b.id !== newBurst.id));
    }, 900);
  };

  // Toggle unit selection
  const toggleUnit = (id: string, event?: React.MouseEvent) => {
    if (soldUnitIds.includes(id)) return;
    const isCurrentlySelected = selectedUnitIds.includes(id);
    if (!isCurrentlySelected) {
      triggerBurst(id, event);
    }
    // If deselecting, immediately clear hover state so 3D model turns off highlight with zero delay
    if (isCurrentlySelected && hoveredUnitId === id) {
      setHoveredUnitId(null);
    }
    setSelectedUnitIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((uid) => uid !== id)
        : [...prev, id];
      
      const nextProgress = getPresetProgress(next);
      setConversionProgress(nextProgress);
      return next;
    });
  };

  const handleDeselectAll = () => {
    setSelectedUnitIds([]);
    setConversionProgress(0);
    setHoveredUnitId(null);
  };

  // Scroll to 3D model and center it in viewport
  const scrollTo3DModel = () => {
    const stageEl = document.getElementById("invest-3d-container") || document.getElementById("building-stage");
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

  // --- Financial Calculations (10-Year Horizon) ---
  const selectedUnits = UNITS.filter((u) => selectedUnitIds.includes(u.id));
  const totalInvestment = selectedUnits.reduce((acc, u) => acc + u.price, 0);
  const totalArea = selectedUnits.reduce((acc, u) => acc + u.area, 0);

  // 1. Tenant pays model: 3.5% rental yield p.a. over 10 years = 35%
  const tenantContribution = totalInvestment * 0.35;

  // 2. Tax office pays model: Degressive AfA (5% p.a. §7 (5a)) + Sonder-AfA (§7b) for QNG+ Neubau.
  // 51.68% write-off over 10 years on building cost (approx 80%) at 45% marginal tax rate
  const maxTaxReturnPotential = (totalInvestment * 0.8) * 0.5168 * 0.45;
  const totalTaxBurden10Years = taxBurden * 10;
  
  const effectiveProgress = conversionProgress > 0 ? conversionProgress : (selectedUnits.length > 0 ? 30 : 0);
  const actualTaxSavings = Math.min(
    maxTaxReturnPotential,
    totalTaxBurden10Years
  ) * (effectiveProgress / 100);

  // 3. Self-Contribution (geschützter Eigenanteil)
  const selfContribution = Math.max(0, totalInvestment - tenantContribution - actualTaxSavings);

  // Percentages of total investment
  const tenantPercent = totalInvestment > 0 ? (tenantContribution / totalInvestment) * 100 : 0;
  const taxPercent = totalInvestment > 0 ? (actualTaxSavings / totalInvestment) * 100 : 0;
  const selfPercent = totalInvestment > 0 ? (selfContribution / totalInvestment) * 100 : 0;
  const refinancePercent = Math.round(taxPercent);

  // Annual figures
  const convertedTaxSavingsAnnual = actualTaxSavings / 10;
  const remainingTaxAnnual = Math.max(0, taxBurden - convertedTaxSavingsAnnual);

  // Filtered units for floor tabs
  const filteredUnits = selectedFloorFilter === "ALL" 
    ? UNITS 
    : UNITS.filter(u => u.floor === selectedFloorFilter);

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
            <span className="w-2 h-2 rounded-full bg-[#ff8200] animate-pulse"></span>
            <span>Strategischer Vermögensaufbau &bull; Sonder-AfA &sect; 7b</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-stone-900 leading-[1.05]">
            Investieren. <br />
            <span className="text-[#ff8200]">Steuern in Sachwert.</span>
          </h1>

          <div className="space-y-3 max-w-3xl mx-auto">
            <p className="text-xl sm:text-2xl md:text-3xl text-stone-800 font-normal tracking-tight leading-snug">
              11 exklusive Eigentumswohnungen &bull; Neubauprojekt Ingolstadt Etting &bull; Konrad-Strobl-Straße 6
            </p>
            <p className="text-sm sm:text-base text-stone-500 font-light max-w-2xl mx-auto leading-relaxed">
              Wandeln Sie Ihre anfallende Einkommensteuerlast durch staatlich geförderte Sonder-AfA 
              legal und hochprofitabel in erstklassige, inflationsgeschützte Sachwerte um.
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
                const el = document.getElementById("precheck");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#ff8200] hover:bg-[#e67500] text-white shadow-[0_10px_25px_-5px_rgba(255,130,0,0.4)] text-xs font-mono uppercase tracking-widest font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <FileText className="w-4 h-4 stroke-[2.5]" />
              <span>Exposé anfordern</span>
            </button>
          </div>
        </motion.section>

        {/* =========================================================================
            2. INTERACTIVE 3D ARCHITECTURAL MODEL & SACHWERT-ILLUMINATION (BIDIRECTIONAL SCROLL)
            ========================================================================= */}
        <motion.section 
          id="building-stage"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pb-2 border-b border-stone-200/60">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#ff8200] font-bold block mb-1">
                Perspektive &bull; Sachwert-Illumination
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900">
                360° Gebäude-Simulation
              </h2>
            </div>
            
            <p className="text-xs sm:text-sm text-stone-500 font-light max-w-md">
              Klicken Sie auf eine beliebige Wohnung im 3D-Modell, um sie zu sichern und ihren Steuerhebel in Echtzeit zu berechnen.
            </p>
          </div>

          {/* 3D Stage Container in Apple-Glass-Stil */}
          <div 
            id="invest-3d-container"
            className="relative rounded-[36px] bg-white/70 backdrop-blur-2xl border border-stone-200/60 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden p-3 sm:p-6"
          >
            <InteractiveBuilding3D
              units={UNITS}
              selectedUnitIds={selectedUnitIds}
              hoveredUnitId={hoveredUnitId}
              soldUnitIds={soldUnitIds}
              onUnitClick={(unitId, e) => toggleUnit(unitId, e)}
              onUnitHover={(unitId) => setHoveredUnitId(unitId)}
              mode="invest"
              heightClass="h-[460px] sm:h-[580px]"
            />
          </div>

          {/* Apple Status Strip unter dem 3D-Modell */}
          <div className="p-6 sm:p-8 rounded-[28px] bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-xs uppercase tracking-widest text-emerald-700 font-semibold">
                  Steuer-Transformationsquote
                </span>
              </div>
              <div className="text-xl sm:text-2xl font-semibold text-stone-900 tracking-tight">
                <span className="font-mono text-3xl font-bold text-[#ff8200]">{refinancePercent}%</span>
                {" "}der Investition werden direkt durch Steuerersparnis refinanziert.
              </div>
              <p className="text-xs text-stone-500 font-mono">
                0% Steuerabfluss verloren &bull; 100% in inflationsgeschützten Sachwert überführt.
              </p>
            </div>

            {/* 2 Apple Mini-Pills for live metrics */}
            <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
              <div className="p-4 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-red-500 block mb-1">
                  Verbleibende Steuer
                </span>
                <span className="text-lg sm:text-xl font-mono font-bold text-red-600 block">
                  € {remainingTaxAnnual.toLocaleString("de-DE", { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-stone-400 font-light block">
                  Jährlicher Abfluss
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-2xs">
                <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 block mb-1">
                  In Sachwert gewandelt
                </span>
                <span className="text-lg sm:text-xl font-mono font-bold text-emerald-700 block">
                  € {convertedTaxSavingsAnnual.toLocaleString("de-DE", { maximumFractionDigits: 0 })}
                </span>
                <span className="text-[10px] text-stone-400 font-light block">
                  Arbeitet als Vermögen
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* =========================================================================
            3. DER INTERAKTIVE STEUER-KONVERTER (APPLE COCKPIT & BIDIRECTIONAL SCROLL)
            „Wenig Inhalt auf viel Fläche“ mit großzügigen Abständen
            ========================================================================= */}
        <motion.section
          id="simulator"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          {/* Section Header */}
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#ff8200] font-bold block">
              Echtzeit-Simulation &bull; Der Steuer-Konverter
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 leading-[1.1]">
              Kalkulation &amp; Asset-Auswahl.
            </h2>
            <p className="text-base sm:text-xl text-stone-500 font-light leading-relaxed">
              Passen Sie Ihre Einkommensteuerlast an und wählen Sie Wohneinheiten aus. 
              Unser Algorithmus kalkuliert den maximalen Abschreibungseffekt sofort.
            </p>
          </div>

          {/* Zwei großzügige Apple-Karten */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* SPALTE 1: Steuerregler, Presets & Kernschmelze */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] space-y-8"
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                    <Sliders className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-stone-900">
                      1. Einkommensteuer einstellen
                    </h3>
                    <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
                      Jährliche persönliche Steuerlast
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-600 font-mono text-xs font-semibold">
                  EStG
                </span>
              </div>

              {/* Slider Display & Control */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-stone-500 font-light text-sm">
                    Jährliche Einkommensteuer:
                  </span>
                  <span className="text-3xl sm:text-4xl font-mono font-bold text-stone-900">
                    € {taxBurden.toLocaleString("de-DE")}
                  </span>
                </div>

                <input 
                  type="range" 
                  min={20000} 
                  max={250000} 
                  step={5000}
                  value={taxBurden} 
                  onChange={(e) => setTaxBurden(Number(e.target.value))}
                  className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-[#ff8200]"
                />

                <div className="flex justify-between text-xs text-stone-400 font-mono">
                  <span>€ 20.000</span>
                  <span>€ 135.000</span>
                  <span>€ 250.000+</span>
                </div>
              </div>

              {/* Apple-Style Presets */}
              <div className="space-y-3 pt-4 border-t border-stone-100">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                  Konvertierungs-Presets:
                </span>
                
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button 
                    disabled={!isBasisAvailable}
                    onClick={handleBasisClick}
                    className={`py-3 px-2 text-xs font-mono uppercase tracking-wider rounded-2xl font-bold transition-all duration-300 border cursor-pointer ${
                      !isBasisAvailable
                        ? "bg-stone-100 border-stone-200 text-stone-400 opacity-60 cursor-not-allowed"
                        : conversionProgress === 30 
                          ? "bg-[#ff8200] text-white border-[#ff8200] shadow-sm" 
                          : "bg-stone-50 hover:bg-stone-100 border-stone-200/80 text-stone-700"
                    }`}
                  >
                    Basis (30%)
                  </button>

                  <button 
                    disabled={!isOptimiertAvailable}
                    onClick={handleOptimiertClick}
                    className={`py-3 px-2 text-xs font-mono uppercase tracking-wider rounded-2xl font-bold transition-all duration-300 border cursor-pointer ${
                      !isOptimiertAvailable
                        ? "bg-stone-100 border-stone-200 text-stone-400 opacity-60 cursor-not-allowed"
                        : conversionProgress === 65 
                          ? "bg-[#ff8200] text-white border-[#ff8200] shadow-sm" 
                          : "bg-stone-50 hover:bg-stone-100 border-stone-200/80 text-stone-700"
                    }`}
                  >
                    Optimiert (65%)
                  </button>

                  <button 
                    disabled={!isVollAvailable}
                    onClick={handleVollClick}
                    className={`py-3 px-2 text-xs font-mono uppercase tracking-wider rounded-2xl font-bold transition-all duration-300 border cursor-pointer ${
                      !isVollAvailable
                        ? "bg-stone-100 border-stone-200 text-stone-400 opacity-60 cursor-not-allowed"
                        : conversionProgress === 100 
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm" 
                          : "bg-stone-50 hover:bg-stone-100 border-stone-200/80 text-stone-700"
                    }`}
                  >
                    Voll (100%)
                  </button>
                </div>
              </div>

              {/* Steuer-Metamorphose Flow Bar */}
              <div className="p-5 rounded-2xl bg-stone-50/80 border border-stone-200/70 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-500 uppercase tracking-wider">Metamorphose-Fortschritt</span>
                  <span className="font-bold text-emerald-700">{conversionProgress}% Transformiert</span>
                </div>

                {/* 8 illuminated capsules */}
                <div className="grid grid-cols-8 gap-1.5 h-6">
                  {Array.from({ length: 8 }).map((_, idx) => {
                    const threshold = ((idx + 1) / 8) * 100;
                    const isTransformed = conversionProgress >= threshold - 5;
                    return (
                      <div
                        key={idx}
                        className={`rounded-lg transition-all duration-500 ${
                          isTransformed
                            ? "bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-sm"
                            : "bg-stone-200/70"
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="flex justify-between text-[11px] text-stone-500 font-mono pt-1">
                  <span>Fiskus &bull; Abfluss</span>
                  <span className="text-emerald-700 font-semibold">Sachwert &bull; Vermögenserhalt</span>
                </div>
              </div>
            </motion.div>

            {/* SPALTE 2: Objekt-Auswahlliste & Einheiten im Apple-Stil */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight text-stone-900">
                      2. Einheiten sichern
                    </h3>
                    <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
                      {selectedUnits.length} von 11 Einheiten gewählt
                    </span>
                  </div>
                </div>

                {/* Floor filter tabs in Apple pill style */}
                <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-full border border-stone-200/60">
                  {[
                    { label: "Alle", value: "ALL" },
                    { label: "EG", value: "EG" },
                    { label: "1.OG", value: "1.OG" },
                    { label: "2.OG", value: "2.OG" }
                  ].map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setSelectedFloorFilter(tab.value as any)}
                      className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                        selectedFloorFilter === tab.value
                          ? "bg-stone-900 text-white font-semibold shadow-2xs"
                          : "text-stone-600 hover:text-stone-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scrollable, generous unit list matching Apple design language */}
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {filteredUnits.map((unit) => {
                  const isSel = selectedUnitIds.includes(unit.id);
                  const isHov = hoveredUnitId === unit.id;
                  const isSold = soldUnitIds.includes(unit.id);

                  return (
                    <div
                      key={unit.id}
                      onClick={(e) => !isSold && toggleUnit(unit.id, e)}
                      onMouseEnter={() => !isSold && setHoveredUnitId(unit.id)}
                      onMouseLeave={() => !isSold && setHoveredUnitId(null)}
                      className={`relative p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 ${
                        isSold
                          ? "bg-stone-100 border-stone-200 opacity-60 cursor-not-allowed"
                          : isSel 
                            ? "bg-emerald-50/90 border-emerald-500 shadow-sm ring-2 ring-emerald-500/20" 
                            : isHov
                              ? "bg-orange-50/60 border-[#ff8200] shadow-sm"
                              : "bg-stone-50/70 hover:bg-stone-50 border-stone-200/70 hover:border-stone-300"
                      }`}
                    >
                      {/* Particle burst container */}
                      {!isSold && activeBursts.filter((b) => b.unitId === unit.id).map((burst) => (
                        <div 
                          key={burst.id} 
                          className="absolute pointer-events-none inset-0 overflow-visible z-50"
                        >
                          {burst.particles.map((p) => (
                            <motion.div
                              key={p.id}
                              initial={{ x: `${burst.x}%`, y: `${burst.y}%`, scale: 1, opacity: 1 }}
                              animate={{
                                x: `calc(${burst.x}% + ${Math.cos(p.angle) * p.speed}px)`,
                                y: `calc(${burst.y}% + ${Math.sin(p.angle) * p.speed}px)`,
                                scale: 0,
                                opacity: 0,
                              }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              style={{
                                position: "absolute",
                                width: p.size,
                                height: p.size,
                                backgroundColor: p.color,
                                borderRadius: "50%",
                                boxShadow: `0 0 8px ${p.color}`,
                              }}
                            />
                          ))}
                        </div>
                      ))}

                      {/* Left: Info */}
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-sm font-bold ${
                            isSel ? "text-emerald-900" : isHov ? "text-[#ff8200]" : "text-stone-900"
                          }`}>
                            {unit.name}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-stone-200/70 text-stone-600 font-mono text-[10px] font-semibold uppercase">
                            {unit.floor}
                          </span>
                          <span className="text-xs text-stone-400 font-mono">&bull; {unit.rooms}</span>
                        </div>
                        <p className="text-xs text-stone-500 truncate font-light">
                          {unit.type} &bull; {unit.area} m² Wohnfläche
                        </p>
                      </div>

                      {/* Right: Price & Button */}
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider block">
                            Kaufpreis
                          </span>
                          <span className="font-mono text-sm sm:text-base font-bold text-stone-900">
                            € {unit.price.toLocaleString("de-DE")}
                          </span>
                        </div>

                        <button
                          type="button"
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            isSel
                              ? "bg-emerald-600 text-white shadow-2xs"
                              : "bg-white border border-stone-200 text-stone-600 hover:text-stone-900"
                          }`}
                        >
                          {isSel ? (
                            <Check className="w-4 h-4 stroke-[2.5]" />
                          ) : (
                            <ArrowRight className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Detaillierte Warenkorb-Zusammenfassung */}
              {selectedUnits.length > 0 && (
                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-xs font-mono text-stone-500">
                    <span className="font-semibold text-stone-900">{selectedUnits.length} gewählt</span>
                    {" "}&bull; {totalArea} m² &bull; € {totalInvestment.toLocaleString("de-DE")}
                  </div>
                  <button
                    type="button"
                    onClick={handleDeselectAll}
                    className="text-xs font-mono uppercase tracking-wider text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
                  >
                    Auswahl zurücksetzen
                  </button>
                </div>
              )}
            </motion.div>

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
                      Aktuelle Portfolio-Konfiguration
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900">
                    {selectedUnits.length} {selectedUnits.length === 1 ? "Einheit gesichert" : "Einheiten gesichert"}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleUnit(u.id);
                          }}
                          className="hover:text-red-500 font-bold ml-0.5 text-stone-400 cursor-pointer"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 self-stretch md:self-auto border-t md:border-t-0 pt-4 md:pt-0 border-stone-200/60">
                  <div>
                    <span className="text-xs font-mono uppercase text-stone-500 block">
                      Gesamtes Sachwertvolumen
                    </span>
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-stone-900">
                      € {totalInvestment.toLocaleString("de-DE")}
                    </span>
                    <span className="text-xs text-stone-500 block">
                      {totalArea} m² &bull; Refinanziert zu {refinancePercent}%
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById("precheck");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="px-6 py-3.5 rounded-2xl bg-[#ff8200] hover:bg-[#e67500] text-white text-xs font-mono uppercase tracking-wider transition-all duration-300 cursor-pointer font-semibold shadow-[0_10px_25px_-5px_rgba(255,130,0,0.3)] self-stretch sm:self-auto text-center"
                  >
                    Exposé anfordern
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* =========================================================================
            3.5 ARCHITEKTUR & IMPRESSIONEN (APPLE-DESIGN VISUALISIERUNGEN)
            18 High-End Visualisierungs-Slots für Konrad-Strobel-Straße 6
            ========================================================================= */}
        <ArchitekturGalerie />

        {/* =========================================================================
            4. MATHEMATISCHE & STEUERLICHE HEBELWIRKUNG (BIDIRECTIONAL SCROLL)
            Die 3 Finanzierungs-Säulen in großzügigen Apple-Karten
            ========================================================================= */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-12"
        >
          {/* Section Header */}
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#ff8200] font-bold block">
              Mathematische Analyse &bull; 10-Jahres-Horizont
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 leading-[1.1]">
              Die Hebelwirkung der degressiven AfA.
            </h2>
            <p className="text-base sm:text-xl text-stone-500 font-light leading-relaxed">
              Die mathematische Hebelwirkung beruht auf der Kombination aus der neuen degressiven AfA (5% p.a.) 
              und der Sonder-AfA (&sect; 7b EStG). Dadurch ziehen Sie in den ersten 10 Jahren erhebliche Summen 
              direkt vom zu versteuernden Einkommen ab.
            </p>
          </div>

          {/* 3-Balken-Chart Karte */}
          <div className="rounded-[32px] p-8 sm:p-12 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_14px_36px_-15px_rgba(0,0,0,0.03)] space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                  <Coins className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                    Finanzierungs-Aufteilung
                  </h3>
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-wider">
                    10-Jahres-Haltedauer-Simulation
                  </span>
                </div>
              </div>

              <div className="font-mono text-xs text-stone-500">
                Investitions-Volumen: <span className="font-bold text-stone-900">€ {totalInvestment.toLocaleString("de-DE")}</span>
              </div>
            </div>

            {/* Die 3 animierten Fortschrittsbalken */}
            <div className="space-y-6">
              
              {/* Säule 1: Vom Mieter bezahlt */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-mono">
                  <span className="text-stone-600 font-medium">
                    1. Vom Mieter bezahlt (3,5% kalkulierte Mietrendite p.a.)
                  </span>
                  <span className="font-bold text-stone-900">
                    {tenantPercent.toFixed(1)}% &bull; € {tenantContribution.toLocaleString("de-DE", { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${tenantPercent}%` }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-stone-400 rounded-full"
                  />
                </div>
              </div>

              {/* Säule 2: Vom Finanzamt bezahlt */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-mono">
                  <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    2. Vom Finanzamt bezahlt (AfA Subvention &amp; Sonder-AfA)
                  </span>
                  <span className="font-bold text-emerald-700">
                    {taxPercent.toFixed(1)}% &bull; € {actualTaxSavings.toLocaleString("de-DE", { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-emerald-200/60 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${taxPercent}%` }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full shadow-xs"
                  />
                </div>
              </div>

              {/* Säule 3: Geschützter Eigenanteil */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs sm:text-sm font-mono">
                  <span className="text-stone-600 font-medium">
                    3. Ihr geschützter Eigenanteil (Investoren-Kapital)
                  </span>
                  <span className="font-bold text-stone-900">
                    {selfPercent.toFixed(1)}% &bull; € {selfContribution.toLocaleString("de-DE", { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="w-full h-3.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200/60">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${selfPercent}%` }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-stone-300 rounded-full"
                  />
                </div>
              </div>

            </div>

            {/* Total balance info strip */}
            <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row justify-between items-center text-xs font-mono text-stone-500 gap-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 font-semibold">
                  Gesamthebel: {(tenantPercent + taxPercent).toFixed(0)}%
                </span>
                <span>Mieter ({tenantPercent.toFixed(0)}%) + Fiskus ({taxPercent.toFixed(0)}%)</span>
              </div>
              <div className="text-emerald-700 font-semibold">
                Ihr Eigenaufwand sinkt auf nur {selfPercent.toFixed(0)}% des Sachwertpreises
              </div>
            </div>
          </div>

          {/* 2 Apple-Style Subventions- & Exit-Karten */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* 1. KfW-Förderkredit */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                  Finanzierungs-Booster &bull; KfW 298
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                  KfW-Förderkredit EH40 QNG+
                </h3>
                <p className="text-sm sm:text-base text-stone-500 font-light leading-relaxed">
                  Sichern Sie sich den extrem zinsgünstigen staatlichen Förderkredit ab <strong className="text-stone-900 font-semibold">2,31 % Sollzins</strong> für bis zu <strong className="text-stone-900 font-semibold">150.000 € pro Wohneinheit</strong>. 
                  Perfekt integrierbar zur weiteren Steigerung Ihrer Eigenkapitalrendite.
                </p>
              </div>
            </motion.div>

            {/* 2. Exit-Strategie */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200/60 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                  Steuerfreier Verkauf &bull; &sect; 23 EStG
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                  Exit-Strategie nach 10 Jahren
                </h3>
                <p className="text-sm sm:text-base text-stone-500 font-light leading-relaxed">
                  Maximale Sicherheit beim Verkauf: Nach Ablauf der 10-jährigen gesetzlichen Spekulationsfrist nach <strong className="text-stone-900 font-semibold">&sect; 23 EStG</strong> veräußern Sie das Eigentum <strong className="text-emerald-700 font-semibold">100 % steuerfrei</strong> inklusive sämtlicher erwirtschafteter Wertzuwächse.
                </p>
              </div>
            </motion.div>

          </div>
        </motion.section>

        {/* =========================================================================
            5. STEUER-PRE-CHECK ANFORDERUNG (LEAD-GENERIERUNG, BIDIRECTIONAL SCROLL)
            Minimalistisches Apple Formular mit großzügigen Feldern
            ========================================================================= */}
        <motion.section 
          id="precheck"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto space-y-8 scroll-mt-36"
        >
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100/90 border border-stone-200/70 text-[11px] font-mono uppercase tracking-widest text-stone-600">
              <span className="w-2 h-2 rounded-full bg-[#ff8200]"></span>
              <span>Vertrauliche Vorqualifikation</span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900">
              Exposé & Steuer-Pre-Check anfordern.
            </h2>
            <p className="text-sm sm:text-base text-stone-500 font-light max-w-xl mx-auto leading-relaxed">
              Fordern Sie Ihr vertrauliches Investoren-Exposé inklusive exakter Berechnung 
              Ihrer steuerlichen Vorteile durch Sonder-AfA und KfW-Förderkontingente an.
            </p>
          </div>

          {/* Form Container in Apple Glass */}
          <div className="rounded-[36px] p-8 sm:p-12 bg-white/85 backdrop-blur-2xl border border-stone-200/80 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05)]">
            {!formSubmitted ? (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setFormSubmitted(true);
                }} 
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs uppercase tracking-wider text-stone-500 block">
                      Name des Investors *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={investorName}
                      onChange={(e) => setInvestorName(e.target.value)}
                      placeholder="Vorname Nachname"
                      className="w-full px-5 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:border-[#ff8200] focus:bg-white focus:outline-none text-stone-900 placeholder-stone-400 font-sans text-sm transition-all duration-300"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs uppercase tracking-wider text-stone-500 block">
                      Vertrauliche E-Mail *
                    </label>
                    <input 
                      type="email" 
                      required
                      value={investorEmail}
                      onChange={(e) => setInvestorEmail(e.target.value)}
                      placeholder="mail@investor.de"
                      className="w-full px-5 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:border-[#ff8200] focus:bg-white focus:outline-none text-stone-900 placeholder-stone-400 font-sans text-sm transition-all duration-300"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs uppercase tracking-wider text-stone-500 block">
                      Rückrufnummer (Optional)
                    </label>
                    <input 
                      type="tel" 
                      value={investorPhone}
                      onChange={(e) => setInvestorPhone(e.target.value)}
                      placeholder="+49 (0) 171 1234567"
                      className="w-full px-5 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:border-[#ff8200] focus:bg-white focus:outline-none text-stone-900 placeholder-stone-400 font-sans text-sm transition-all duration-300"
                    />
                  </div>

                  {/* Volume */}
                  <div className="space-y-2">
                    <label className="font-mono text-xs uppercase tracking-wider text-stone-500 block">
                      Geplantes Volumen / Eigenkapital
                    </label>
                    <select 
                      value={selectedInvestmentVolume}
                      onChange={(e) => setSelectedInvestmentVolume(e.target.value)}
                      className="w-full px-5 py-4 rounded-2xl bg-stone-50 border border-stone-200 focus:border-[#ff8200] focus:bg-white focus:outline-none text-stone-800 font-sans text-sm transition-all duration-300 cursor-pointer"
                    >
                      <option value="100k-250k">€ 100.000 &ndash; € 250.000</option>
                      <option value="250k-500k">€ 250.000 &ndash; € 500.000</option>
                      <option value="500k-1m">€ 500.000 &ndash; € 1.000.000</option>
                      <option value="1m+">Über € 1.000.000 (Family Office)</option>
                    </select>
                  </div>

                </div>

                {/* Consent checkbox */}
                <div className="flex items-start gap-3 pt-2 text-xs text-stone-500 font-light leading-relaxed">
                  <input 
                    type="checkbox" 
                    required 
                    className="accent-[#ff8200] mt-1 cursor-pointer w-4 h-4 rounded" 
                  />
                  <span>
                    Ich stimme zu, dass meine Angaben zur diskreten Vorqualifikation und Zusendung des Exposés verarbeitet werden. 
                    Die Daten dienen ausschließlich der vertraulichen internen Vorbereitung für das Gespräch mit unserem Spezialisten-Team.
                  </span>
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  className="w-full py-4 rounded-2xl bg-[#ff8200] hover:bg-[#e67500] text-white text-xs font-mono uppercase tracking-widest font-semibold transition-all duration-300 cursor-pointer shadow-[0_10px_25px_-5px_rgba(255,130,0,0.4)] flex items-center justify-center gap-3 active:scale-[0.99]"
                >
                  <FileText className="w-4 h-4" />
                  <span>Exposé kostenfrei anfordern</span>
                </button>
                
                <p className="text-center text-[11px] text-stone-400 font-mono">
                  * Begrenzte Förderkontingente exklusiv für Neubauprojekte im Raum Ingolstadt.
                </p>
              </form>
            ) : (
              <div className="p-8 sm:p-12 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <FileCheck className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-semibold text-stone-900 tracking-tight">
                    Anfrage diskret übermittelt.
                  </h3>
                  <p className="text-stone-500 text-sm sm:text-base leading-relaxed max-w-lg mx-auto font-light">
                    Vielen Dank, Herr/Frau <strong className="text-stone-900 font-semibold">{investorName}</strong>. 
                    Ein persönlicher Portfoliomanager von Fehlner &amp; Götz wird sich unter absolutem Diskretionsvorbehalt 
                    über Ihre Adresse <span className="text-emerald-700 font-semibold">{investorEmail}</span> mit Ihnen in Verbindung setzen.
                  </p>
                </div>
                <div className="text-xs tracking-widest text-emerald-700 uppercase font-mono pt-4 border-t border-emerald-100">
                  Private Placement Division &bull; Fehlner &amp; Götz Ingolstadt
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex items-start gap-2.5 text-[11px] text-stone-400 font-sans leading-relaxed">
              <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>
                <strong>Rechtlicher Disclaimer:</strong> Alle Berechnungen dieses Simulators dienen als unverbindliche Orientierung und Modellrechnung zur Vorqualifizierung. Sie stellen keine steuerliche oder rechtliche Beratung dar und ersetzen keinesfalls das individuelle Gespräch mit Ihrem Steuerberater.
              </span>
            </div>
          </div>
        </motion.section>

      </div>

      {/* =========================================================================
          6. STICKY FLOATING APPLE STATUS BAR (WHEN UNITS ARE SELECTED)
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
                    {selectedUnits.length} {selectedUnits.length === 1 ? "Einheit gesichert" : "Einheiten gesichert"} ({selectedUnits.map(u => u.name).join(", ")})
                  </span>
                  <span className="text-[11px] text-stone-400 font-mono hidden sm:inline">
                    {totalArea} m² &bull; Refinanziert zu {refinancePercent}%
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span className="font-mono text-sm sm:text-base font-bold text-[#ff8200]">
                  € {totalInvestment.toLocaleString("de-DE")}
                </span>
                
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

    </div>
  );
}
