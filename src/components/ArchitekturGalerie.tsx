import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Camera, 
  Maximize2, 
  Sparkles, 
  Compass, 
  Check, 
  Copy, 
  X, 
  Layers, 
  Eye, 
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export interface GalleryItem {
  id: number;
  filename: string;
  category: "Garten & Terrassen" | "Fassaden & Kubatur" | "Luftaufnahmen & Gründach" | "Innenräume & Living";
  title: string;
  motif: string;
  orientation: string;
  features: string[];
  aspectRatio: "16:9";
}

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 1,
    filename: "WHG2-WHG03-SUED-AUSSEN-GARTEN-AUFHECKE.jpg",
    category: "Garten & Terrassen",
    title: "Erdgeschoss-Terrasse & Süd-Garten",
    motif: "Nahaufnahme der Erdgeschoss-Terrasse und des Süd-Gartens. Bodentiefe Schiebetüren mit einer Person im Vordergrund, dunkle Balkonbrüstungen aus Glas, grüne Hecke und Rasenfläche.",
    orientation: "Südausrichtung • Erdgeschoss",
    features: ["Bodentiefe Schiebetüren", "Dunkle Glas-Balkonbrüstungen", "Privater Süd-Gartenanteil", "Sonnenschutz & Bepflanzung"],
    aspectRatio: "16:9"
  },
  {
    id: 2,
    filename: "WHG03-SUED-WEST-AUSSEN-GARTEN-AUFHECKE.png.jpg",
    category: "Garten & Terrassen",
    title: "Süd-West-Garten auf Hecke",
    motif: "Perspektive aus der Froschperspektive durch die dichte grüne Gartenhecke auf die Süd-West-Fassade mit den darüberliegenden Balkonen und der Terrassenseite.",
    orientation: "Süd-West • Bodenperspektive",
    features: ["Dichte Hainbuchenhecke", "Dynamische Froschperspektive", "Großzügige Balkonebenen", "Nachhaltige Holz- & Glaselemente"],
    aspectRatio: "16:9"
  },
  {
    id: 3,
    filename: "NORD-OST-FASSADE.jpg",
    category: "Fassaden & Kubatur",
    title: "Nord-Ost-Fassade Gesamtkubatur",
    motif: "Totale Außenansicht der Nord-Ost-Fassade. Reines weißes Gebäude mit kubischer Architektur, umgeben von grünem Rasen und blühenden violetten Bäumen.",
    orientation: "Nord-Ost • Gebäude-Totale",
    features: ["Kubische Architektur", "Reinweiße Putzfassade", "Blühende Begleitvegetation", "Diskrete Fenster-Gliederung"],
    aspectRatio: "16:9"
  },
  {
    id: 4,
    filename: "NORD-OST-FASSADE-EINGANG-TG-PFLASTER.png",
    category: "Fassaden & Kubatur",
    title: "Tiefgaragenzufahrt & Pflasterbereich",
    motif: "Tiefgarage und Zufahrtsbereich an der Nord-Ost-Kante. Dynamische Perspektive auf die gepflasterte Einfahrt mit schwarzem Garagentor und moderner Pflasterung.",
    orientation: "Nord-Ost • Zufahrt & Entrée",
    features: ["Exklusives schwarzes Sektionaltor", "Hochwertiges Betonsteinpflaster", "Barrierearme Erschließung", "Unterirdische Stellplätze"],
    aspectRatio: "16:9"
  },
  {
    id: 5,
    filename: "NORD-OST-FASSADE-VOGELPERSPEKTIVE.jpg",
    category: "Luftaufnahmen & Gründach",
    title: "Vogelperspektive Nord-Ost & Gründach",
    motif: "Vogelperspektive/Luftaufnahme von Nord-Osten. Zeigt das intensive Gründach des Hauptgebäudes und der Garage sowie die Gesamtkubatur des 11-Familienhauses.",
    orientation: "Nord-Ost • Drohnenflug 45°",
    features: ["Extensives & intensives Gründach", "PV-Vorrüstung & Regenwasserrückhalt", "Harmonische Einfügung in Etting", "KfW 40 QNG+ Standard"],
    aspectRatio: "16:9"
  },
  {
    id: 6,
    filename: "NORD-OST-FASSADE-VOGELPERSPEKTIVE-MIT-RAFFSTORS.jpg",
    category: "Luftaufnahmen & Gründach",
    title: "Vogelperspektive West mit Raffstores",
    motif: "Hohe Perspektive von West/Nord-West mit geschlossenen/teilgeschlossenen dunklen Raffstores an den Fenstern, privatem Loungebereich im Garten und Spielplatz.",
    orientation: "West / Nord-West • Erhöhte Perspektive",
    features: ["Elektrische Raffstore-Verschattung", "Privater Outdoor-Loungebereich", "Garten-Spielbereich", "Optimierter sommerlicher Wärmeschutz"],
    aspectRatio: "16:9"
  },
  {
    id: 7,
    filename: "NORD-OST-SPIELPLATZ-WEITWINKEL.jpg",
    category: "Garten & Terrassen",
    title: "Gartenanlage & Kinderspielplatz",
    motif: "Weitwinkel-Aufnahme des gemeinschaftlichen Garten- und Spielbereichs mit Sandkasten, Holzbank, blühenden Bäumen und Familien im Grünbereich.",
    orientation: "Nord-Ost • Gemeinschaftsfläche",
    features: ["Naturholz-Sandkasten & Sitzbänke", "Schattenspendende Laubbäume", "Sicher eingefriedetes Areal", "Hohe Aufenthaltsqualität für Familien"],
    aspectRatio: "16:9"
  },
  {
    id: 8,
    filename: "SUED-FASSADE-PERSONENPERSPEKTIVE.jpg",
    category: "Fassaden & Kubatur",
    title: "Süd-Fassade Frontalperspektive",
    motif: "Frontale Ansicht der Süd-Fassade auf Augenhöhe. Zeigt alle 3 Geschosse symmetrisch mit den getönten Glasbalkonen, der Gartenhecke und dem vorgelagerten Rasen.",
    orientation: "Südfassade • Augenhöhe (1,70 m)",
    features: ["Symmetrische 3-Geschossigkeit", "Getönte Verbund-Sicherheitsglasbrüstungen", "Vorgelagerte Grünzone", "Maximale solare Energiegewinne"],
    aspectRatio: "16:9"
  },
  {
    id: 9,
    filename: "SUED-WEST-FASSADE-VOGELPERSPEKTIVE.jpg",
    category: "Luftaufnahmen & Gründach",
    title: "Süd-West-Luftaufnahme & Terrassen",
    motif: "Luftaufnahme der Süd-West-Ecke. Hebt die großzügigen Balkone, Terrassenbereiche, das Gründach und die Outdoor-Lounge-Möbel im Garten hervor.",
    orientation: "Süd-West • Luftbildaufnahme",
    features: ["Panorama-Dachterrassen im 2.OG", "Großzügige Garten-Loungezonen", "Westliche Abendsonne", "Höchste Privatsphäre"],
    aspectRatio: "16:9"
  },
  {
    id: 10,
    filename: "WHG01-NORD-OST-FASSADE-NAH-AUF-HECKE-OHNE-RAFFSTORS.jpg",
    category: "Fassaden & Kubatur",
    title: "Nord-Ost-Fassade nah auf Hecke (ohne Raffstores)",
    motif: "Nahaufnahme der Nord-Ost-Fassade dicht über der grünen Gartenhecke. Zeigt den blühenden violetten Baum und die offene Fensterfront ohne Sonnenschutz.",
    orientation: "Nord-Ost • Heckenperspektive nah",
    features: ["Transparente Fensterarchitektur", "Dichte Immergrün-Hecke", "Blühende Ziergehölze", "Lichtdurchflutetes Erdgeschoss"],
    aspectRatio: "16:9"
  },
  {
    id: 11,
    filename: "WHG01-SUED-AUSSEN-GARTEN.jpg",
    category: "Garten & Terrassen",
    title: "WHG 01 Privater Süd-Garten & Terrasse",
    motif: "Perspektive auf den privaten Süd-Gartenbereich der Erdgeschosswohnung WHG 01. Große Rasenfläche, Terrasse mit bodentiefen Glaselementen und Loungebereich unter dem Sonnenschirm.",
    orientation: "Südausrichtung • WHG 01 Garten",
    features: ["Exklusives Sondernutzungsrecht Garten", "Bodentiefe Schiebefenster", "Outdoor-Lounge & Sonnenschirm", "Privatsphäre & Wohlfühlatmosphäre"],
    aspectRatio: "16:9"
  },
  {
    id: 12,
    filename: "SPIELPLATZN-KLEINER-AUSSNITT.png",
    category: "Garten & Terrassen",
    title: "Gemeinschaftsspielplatz Detailausschnitt",
    motif: "Detailaufnahme des privaten Gemeinschaftsspielplatzes im Garten mit Holz-Sandkasten, blauer Feder-Wippe, Fußball, Sitzbank und spielenden Familien.",
    orientation: "Gartenanlage • Spielplatz",
    features: ["Holz-Sandkasten mit Abdeckung", "Blaue Feder-Wippe", "Sitzbänke für Eltern", "Sicherer Spielraum im Innenhof"],
    aspectRatio: "16:9"
  },
  {
    id: 13,
    filename: "SUED-OST-FASSADE-ECKVOGELPERSPEKTIVE.jpg",
    category: "Luftaufnahmen & Gründach",
    title: "Süd-Ost-Fassade Eck-Vogelperspektive",
    motif: "Hohe Eck-Vogelperspektive auf die Süd-Ost-Seite des Gebäudes mit sichtbaren Balkonbereichen, Terrassen, Rasenflächen und den umgebenden Hecken.",
    orientation: "Süd-Ost • Eck-Vogelperspektive",
    features: ["Dynamischer Eckwinkel", "Balkonstaffelung & Terrassen", "Umlaufende Begrünung", "Kompakte Baukörperstruktur"],
    aspectRatio: "16:9"
  },
  {
    id: 14,
    filename: "WHG01-BAD-JURAMAMOR- RAFFSTORS-GESCHLOSSEN.png",
    category: "Innenräume & Living",
    title: "WHG 01 Masterbad Juramarmor (Raffstores geschlossen)",
    motif: "Innenaufnahme des High-End-Badezimmers in WHG 01 mit Juramarmor-Verkleidung, freistehender Wanne, rundem LED-Spiegel, Regendusche und geschlossenen Raffstors.",
    orientation: "Innenraum • Masterbad WHG 01",
    features: ["Echter Naturstein Juramarmor", "Freistehende Design-Badewanne", "Runder hinterleuchteter LED-Spiegel", "Regendusche & Sichtschutz"],
    aspectRatio: "16:9"
  },
  {
    id: 15,
    filename: "WHG01-BAD-JURAMAMOR- RAFFSTORS-OFFEN.png",
    category: "Innenräume & Living",
    title: "WHG 01 Masterbad Juramarmor (Raffstores offen)",
    motif: "Das Juramarmor-Badezimmer mit leicht geöffneten Raffstors, durch die warmes Tageslicht und das Grün des Gartens sanft in den Raum fallen.",
    orientation: "Innenraum • Masterbad WHG 01",
    features: ["Lichtspiel durch geöffnete Lamellen", "Blick ins private Garten-Grün", "Edle Sanitärausstattung", "Fußbodenheizung mit Einzelraumregelung"],
    aspectRatio: "16:9"
  },
  {
    id: 16,
    filename: "WHG01-BAD-JURAMAMOR-KEINE-RAFFSTORS.png",
    category: "Innenräume & Living",
    title: "WHG 01 Masterbad Juramarmor (Freier Blick)",
    motif: "Das Juramarmor-Badezimmer ohne Raffstors mit komplett freiem Blick durch die bodentiefe Glasfront auf den Garten und den blauen Himmel.",
    orientation: "Innenraum • Masterbad WHG 01",
    features: ["Panoramablick in den Garten", "Maximale Tageslichtausbeute", "Elegante Armaturen in Schwarz matt", "Wellness-Oase auf Neubau-Niveau"],
    aspectRatio: "16:9"
  },
  {
    id: 17,
    filename: "WHG01-KUECHE.jpg",
    category: "Innenräume & Living",
    title: "WHG 01 Offene Luxus-Einbauküche",
    motif: "Moderne offene Luxus-Einbauküche in WHG 01 mit dunkler Kochinsel in Steinoptik, Deckenspots und Blick auf den Essbereich und die Terrasse.",
    orientation: "Innenraum • Küche & Living WHG 01",
    features: ["Dunkle Kochinsel in Steinoptik", "Integrierte Decken-Spotlights", "Offenes Raumkonzept mit Essbereich", "Direkter Zugang zur Sonnenterrasse"],
    aspectRatio: "16:9"
  },
  {
    id: 18,
    filename: "WHG01-NORD-OST-FASSADE-NAH-AUF-HECKE-MIT-RAFFSTORS.jpg",
    category: "Fassaden & Kubatur",
    title: "Nord-Ost-Fassade nah auf Hecke (mit Raffstores)",
    motif: "Nord-Ost-Fassade aus niedriger Heckenperspektive mit heruntergelassenen dunklen Raffstors an allen Fensterfronten für optimalen Blendschutz.",
    orientation: "Nord-Ost • Heckenperspektive nah",
    features: ["Dunkle Design-Raffstores geschlossen", "Perfekter sommerlicher Wärmeschutz", "Architektonischer Kontrast Weiß-Anthrazit", "Immergrüne Heckenabgrenzung"],
    aspectRatio: "16:9"
  }
];

export default function ArchitekturGalerie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [activeModalItem, setActiveModalItem] = useState<GalleryItem | null>(null);
  const [copiedFilename, setCopiedFilename] = useState<string | null>(null);

  // Smooth Scroll Translation & Focus-Scale Calculation for all 18 items
  const updateHorizontalPosition = useCallback(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const rect = container.getBoundingClientRect();
    const maxScroll = container.offsetHeight - window.innerHeight;
    if (maxScroll <= 0) return;

    // Calculate normalized progress between 0 and 1
    const rawProgress = -rect.top / maxScroll;
    const clampedProgress = Math.min(Math.max(rawProgress, 0), 1);
    setScrollProgress(clampedProgress);

    const card0 = cardsRef.current[0];
    const cardLast = cardsRef.current[cardsRef.current.length - 1];

    if (card0 && cardLast) {
      const card0Center = card0.offsetLeft + card0.offsetWidth / 2;
      const cardLastCenter = cardLast.offsetLeft + cardLast.offsetWidth / 2;
      const totalDistance = cardLastCenter - card0Center;

      const viewportCenter = window.innerWidth / 2;
      // Target track translation: Card 1 centered at progress 0, Card 18 centered at progress 1
      const targetTrackX = viewportCenter - card0Center - (clampedProgress * totalDistance);

      track.style.transform = `translate3d(${targetTrackX}px, 0, 0)`;

      let closestIdx = 0;
      let minDiff = Infinity;

      // Apply focus scale (1.0 in center, 0.92 on sides) & fade (1.0 in center, 0.35 on sides)
      cardsRef.current.forEach((card, idx) => {
        if (!card) return;
        const cardCenterInViewport = targetTrackX + card.offsetLeft + card.offsetWidth / 2;
        const diffFromCenter = Math.abs(cardCenterInViewport - viewportCenter);

        if (diffFromCenter < minDiff) {
          minDiff = diffFromCenter;
          closestIdx = idx;
        }

        const maxDistance = card.offsetWidth * 0.95;
        const ratio = Math.min(diffFromCenter / maxDistance, 1);
        
        // Exact requirements:
        // Focused card: scale: 1.0, opacity: 1.0
        // Incoming/outgoing cards: scale: 0.92, opacity: 0.35
        const scale = 1.0 - ratio * 0.08;
        const opacity = 1.0 - ratio * 0.65;

        card.style.transform = `scale(${scale.toFixed(4)})`;
        card.style.opacity = `${opacity.toFixed(4)}`;
      });

      setActiveIndex(closestIdx);
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const onScroll = () => {
      animationFrameId = requestAnimationFrame(updateHorizontalPosition);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    
    // Initial call to set positions immediately
    updateHorizontalPosition();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, [updateHorizontalPosition]);

  // Jump smoothly to a specific slide
  const scrollToSlide = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const maxScroll = container.offsetHeight - window.innerHeight;
    const targetProgress = index / (GALLERY_ITEMS.length - 1);
    const containerTop = window.pageYOffset + container.getBoundingClientRect().top;
    const targetScrollY = containerTop + targetProgress * maxScroll;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth"
    });
  };

  // Keyboard navigation when gallery is in view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalItem) {
        if (e.key === "Escape") setActiveModalItem(null);
        if (e.key === "ArrowRight") {
          const next = (activeModalItem.id % GALLERY_ITEMS.length) + 1;
          const found = GALLERY_ITEMS.find(i => i.id === next);
          if (found) setActiveModalItem(found);
        }
        if (e.key === "ArrowLeft") {
          const prev = activeModalItem.id === 1 ? GALLERY_ITEMS.length : activeModalItem.id - 1;
          const found = GALLERY_ITEMS.find(i => i.id === prev);
          if (found) setActiveModalItem(found);
        }
        return;
      }

      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const inView = rect.top <= 120 && rect.bottom >= window.innerHeight - 120;

      if (inView) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          scrollToSlide(Math.min(activeIndex + 1, GALLERY_ITEMS.length - 1));
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          scrollToSlide(Math.max(activeIndex - 1, 0));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, activeModalItem]);

  const handleCopy = (filename: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(filename);
    setCopiedFilename(filename);
    setTimeout(() => setCopiedFilename(null), 2000);
  };

  const totalCount = GALLERY_ITEMS.length;
  const currentFormatted = String(activeIndex + 1).padStart(2, "0");
  const totalFormatted = String(totalCount).padStart(2, "0");

  return (
    <section 
      id="architektur-impressionen" 
      ref={containerRef}
      className="relative h-[850vh] scroll-mt-20"
      style={{
        marginLeft: "calc(-50vw + 50%)",
        marginRight: "calc(-50vw + 50%)",
        width: "100vw",
        maxWidth: "100vw"
      }}
    >
      {/* =========================================================================
          1. STICKY VIEWPORT CONTAINER (FIXIERT BEIM SCROLLEN)
          ========================================================================= */}
      <div 
        className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden bg-[#faf9f8] pt-20 sm:pt-24 pb-6 sm:pb-8 z-30"
      >
        
        {/* Subtle Apple Ambient Light backdrop */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-[10%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-br from-amber-200/10 via-[#ff8200]/5 to-transparent blur-[120px]" />
          <div className="absolute bottom-[10%] right-[15%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-tl from-stone-200/25 to-transparent blur-[100px]" />
        </div>

        {/* =========================================================================
            TOP SECTION: APPLE-STYLE HEADER & DYNAMISCHER ZÄHLER (01 / 18)
            ========================================================================= */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="flex flex-row items-end justify-between gap-6 pb-4 border-b border-stone-200/70">
            
            {/* Header Left */}
            <div className="max-w-2xl space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 border border-stone-200/80 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#ff8200] font-semibold shadow-2xs">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Neubauprojekt &bull; Konrad-Strobel-Straße 6 &bull; Ingolstadt</span>
              </div>

              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-stone-900 leading-[1.1]">
                Architektur &amp; Impressionen
              </h2>

              <p className="text-xs sm:text-base text-stone-500 font-light hidden sm:block">
                Formvollendete Ästhetik trifft auf nachhaltige Bauweise in Ingolstadt-Etting.
              </p>
            </div>

            {/* Header Right: Dynamischer Apple-Zähler & Slide-Preview */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="flex items-baseline gap-1.5 font-mono">
                <span className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight transition-all duration-300">
                  {currentFormatted}
                </span>
                <span className="text-sm sm:text-lg text-stone-400 font-normal">
                  / {totalFormatted}
                </span>
              </div>

              <span className="text-[11px] sm:text-xs font-mono text-[#ff8200] font-medium max-w-[200px] sm:max-w-[280px] truncate text-right">
                {GALLERY_ITEMS[activeIndex]?.title}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CENTER SECTION: HORIZONTALER STICKY TRACK (TRANSFORMIERT PER TRANSLATE-X)
            ========================================================================= */}
        <div className="relative z-10 w-full overflow-visible my-auto py-2 sm:py-4">
          <div 
            ref={trackRef}
            className="flex flex-nowrap items-center gap-6 sm:gap-10 will-change-transform select-none"
            style={{
              transform: "translate3d(0, 0, 0)"
            }}
          >
            {GALLERY_ITEMS.map((item, index) => {
              const formattedId = String(item.id).padStart(2, "0");
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                  onClick={() => setActiveModalItem(item)}
                  className="apple-horizontal-card group relative shrink-0 w-[86vw] sm:w-[74vw] md:w-[66vw] lg:w-[60vw] xl:w-[840px] max-w-[880px] rounded-[24px] sm:rounded-[28px] bg-white border border-stone-200/80 p-3.5 sm:p-5 lg:p-6 shadow-[0_12px_40px_-15px_rgba(0,0,0,0.06)] hover:border-stone-300 transition-shadow duration-500 cursor-pointer flex flex-col justify-between"
                  style={{
                    transform: index === 0 ? "scale(1.0)" : "scale(0.92)",
                    opacity: index === 0 ? "1.0" : "0.35"
                  }}
                >
                  {/* PLATZHALTER-CONTAINER mit festem 16:9 Seitenverhältnis */}
                  <div className="relative w-full aspect-[16/9] max-h-[46vh] sm:max-h-[50vh] rounded-[18px] sm:rounded-[22px] bg-[#F5F5F7] border border-stone-200/60 overflow-hidden flex flex-col justify-between p-3.5 sm:p-6 transition-colors duration-500 group-hover:bg-[#EFEFF2]">
                    
                    {/* Feiner architektonischer Blueprint / Raster-Hintergrund */}
                    <div 
                      className="absolute inset-0 opacity-[0.035] pointer-events-none group-hover:opacity-[0.055] transition-opacity duration-700" 
                      style={{
                        backgroundImage: `radial-gradient(#1c1917 1px, transparent 1px), linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                        backgroundSize: `24px 24px, 48px 48px, 48px 48px`
                      }}
                    />

                    {/* Subtile architektonische Achsenkreuze im Apple CAD-Stil */}
                    <div className="absolute top-4 right-4 pointer-events-none opacity-40 font-mono text-[9px] text-stone-400 select-none hidden sm:block">
                      POS: ETG-{formattedId} &bull; CAM-16:9
                    </div>

                    {/* TOP ROW: Exakter DATEINAME im sichtbaren Badge/Tag oben links + Meta-Badge rechts */}
                    <div className="relative z-10 flex items-start justify-between gap-3">
                      {/* PFLICHT 1: Exakter Dateiname in sichtbarem Badge */}
                      <span 
                        title="Klicken zum Kopieren des Dateinamens"
                        onClick={(e) => handleCopy(item.filename, e)}
                        className="image-badge inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-stone-200/90 text-stone-800 shadow-2xs group-hover:border-[#ff8200]/40 group-hover:text-stone-900 transition-colors"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#ff8200] shrink-0"></span>
                        <span className="truncate max-w-[190px] sm:max-w-xs">{item.filename}</span>
                        <span className="ml-1 text-stone-400 group-hover:text-stone-600 shrink-0">
                          {copiedFilename === item.filename ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </span>
                      </span>

                      {/* Orientierungs-Chip */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-200/70 text-stone-600 font-mono text-[10px] tracking-wider uppercase shrink-0">
                        <Compass className="w-3 h-3 text-stone-500" />
                        <span className="hidden sm:inline">{item.orientation.split("•")[0].trim()}</span>
                      </span>
                    </div>

                    {/* CENTER: Platzhalter-Grafik mit Kamera & Architektur-Fokus */}
                    <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-4 py-2">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-2xl bg-white/80 border border-stone-200/70 shadow-2xs flex items-center justify-center text-stone-600 mb-2 sm:mb-3 group-hover:scale-105 group-hover:text-[#ff8200] group-hover:border-orange-200 transition-all duration-500">
                        <Camera className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5]" />
                      </div>

                      <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#ff8200] font-semibold block mb-0.5 sm:mb-1">
                        Visualisierung #{formattedId} &bull; 16:9 Render
                      </span>

                      {/* PFLICHT 2: Kurze Beschreibung des Motivs als Platzhalter-Text */}
                      <p className="text-xs sm:text-sm text-stone-700 font-light max-w-lg leading-relaxed line-clamp-2 sm:line-clamp-3">
                        {item.motif}
                      </p>
                    </div>

                    {/* BOTTOM ROW: Detail-Trigger & Format-Hinweis */}
                    <div className="relative z-10 flex items-center justify-between pt-2 border-t border-stone-200/40 text-[10px] sm:text-[11px] font-mono text-stone-500">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>16:9 Master-Slot</span>
                      </span>

                      <div className="inline-flex items-center gap-1 text-stone-700 group-hover:text-[#ff8200] font-medium transition-colors">
                        <span>Großansicht</span>
                        <Maximize2 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      </div>
                    </div>

                    {/* Eventuelles Echtes Bild (falls nachträglich in public/images/ oder assets hinterlegt) */}
                    <img
                      src={`/images/${item.filename}`}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover z-20 opacity-0 transition-opacity duration-700 pointer-events-none"
                      onLoad={(e) => {
                        (e.currentTarget as HTMLImageElement).classList.remove("opacity-0");
                        (e.currentTarget as HTMLImageElement).classList.add("opacity-100");
                      }}
                      onError={(e) => {
                        // Bleibt unsichtbar, damit der edle Platzhalter absolut sauber sichtbar bleibt
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>

                  {/* CARD FOOTER: Titel & Technische Projektmerkmale */}
                  <div className="pt-3 sm:pt-4 px-1 space-y-1.5 sm:space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold tracking-tight text-stone-900 group-hover:text-[#ff8200] transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[11px] sm:text-xs text-stone-500 font-mono mt-0.5">
                          {item.orientation}
                        </p>
                      </div>

                      <span className="text-xs font-mono font-semibold text-stone-400 group-hover:text-stone-900 transition-colors shrink-0 pt-0.5">
                        {formattedId} / {totalFormatted}
                      </span>
                    </div>

                    {/* Feature Tags im Apple Chip-Stil */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                      {item.features.map((feat, fIdx) => (
                        <span
                          key={fIdx}
                          className="px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-600 text-[10px] sm:text-[11px] font-light border border-stone-200/50"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            BOTTOM SECTION: APPLE PROGRESS INDICATOR & QUICK JUMP CONTROLS
            ========================================================================= */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-2">
          <div className="flex items-center justify-between gap-4">
            
            {/* Left: Interactive Navigation Dots for all 18 cards */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto max-w-[40%] sm:max-w-none py-1">
              {GALLERY_ITEMS.map((_, idx) => {
                const isCurrent = activeIndex === idx;
                const dotFormatted = String(idx + 1).padStart(2, "0");
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => scrollToSlide(idx)}
                    title={`Zu Bild ${dotFormatted} springen`}
                    className={`transition-all duration-300 rounded-full cursor-pointer shrink-0 ${
                      isCurrent 
                        ? "w-6 sm:w-7 h-2 bg-[#ff8200]" 
                        : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-stone-300 hover:bg-stone-400"
                    }`}
                  />
                );
              })}
            </div>

            {/* Center: Thin Apple Scrubber Bar */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-[11px] font-mono text-stone-400">01</span>
              <div className="w-44 lg:w-64 h-1 bg-stone-200/80 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#ff8200] transition-all duration-150"
                  style={{ width: `${Math.max(scrollProgress * 100, 3)}%` }}
                />
              </div>
              <span className="text-[11px] font-mono text-stone-400">{totalFormatted}</span>
            </div>

            {/* Right: Step Arrow Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollToSlide(Math.max(activeIndex - 1, 0))}
                disabled={activeIndex === 0}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-stone-200/80 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-white text-stone-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Vorheriges Bild"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSlide(Math.min(activeIndex + 1, GALLERY_ITEMS.length - 1))}
                disabled={activeIndex === GALLERY_ITEMS.length - 1}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-stone-200/80 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-white text-stone-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                title="Nächstes Bild"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* =========================================================================
          DETAIL-MODAL / LIGHTBOX
          ========================================================================= */}
      {activeModalItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-stone-950/70 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setActiveModalItem(null)}
        >
          <div 
            className="relative w-full max-w-4xl bg-white rounded-[28px] border border-stone-200/80 shadow-[0_25px_70px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff8200]"></span>
                <span className="font-mono text-xs uppercase tracking-widest text-stone-500 font-medium">
                  Visualisierungs-Detail &bull; Slot #{String(activeModalItem.id).padStart(2, "0")} von {totalFormatted}
                </span>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
                title="Schließen (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              
              {/* Großformatiger 16:9 Platzhalter-Bühnen-Rahmen */}
              <div className="relative w-full aspect-[16/9] rounded-[20px] bg-[#F5F5F7] border border-stone-200/80 overflow-hidden flex flex-col justify-between p-6">
                
                {/* Blueprint Raster */}
                <div 
                  className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                  style={{
                    backgroundImage: `radial-gradient(#1c1917 1px, transparent 1px), linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)`,
                    backgroundSize: `24px 24px, 48px 48px, 48px 48px`
                  }}
                />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="image-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 shadow-2xs text-stone-900 font-mono text-xs font-semibold">
                    <Camera className="w-3.5 h-3.5 text-[#ff8200]" />
                    {activeModalItem.filename}
                  </span>

                  <span className="px-3 py-1 rounded-full bg-stone-200/80 font-mono text-[11px] text-stone-600 uppercase">
                    16:9 High-Res Render Slot
                  </span>
                </div>

                <div className="relative z-10 text-center my-auto px-4 max-w-xl mx-auto space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-stone-200 shadow-sm mx-auto flex items-center justify-center text-[#ff8200]">
                    <Eye className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <h4 className="text-xl font-semibold text-stone-900">
                    {activeModalItem.title}
                  </h4>
                  <p className="text-stone-600 font-light text-sm leading-relaxed">
                    {activeModalItem.motif}
                  </p>
                </div>

                <div className="relative z-10 flex justify-between items-center text-xs font-mono text-stone-400 pt-2 border-t border-stone-200/50">
                  <span>Projekt: Konrad-Strobel-Straße 6 &bull; Ingolstadt-Etting</span>
                  <span>KfW 40 QNG+ Standard</span>
                </div>

                {/* Render image fallback */}
                <img
                  src={`/images/${activeModalItem.filename}`}
                  alt={activeModalItem.title}
                  className="absolute inset-0 w-full h-full object-cover z-20 opacity-0 transition-opacity duration-500"
                  onLoad={(e) => {
                    (e.currentTarget as HTMLImageElement).classList.remove("opacity-0");
                    (e.currentTarget as HTMLImageElement).classList.add("opacity-100");
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>

              {/* Detaillierte Motiv- & Architektur-Analyse */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-3 p-5 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                    Detaillierte Motiv-Beschreibung:
                  </span>
                  <p className="text-sm text-stone-700 leading-relaxed font-light">
                    {activeModalItem.motif}
                  </p>
                </div>

                <div className="space-y-3 p-5 rounded-2xl bg-stone-50 border border-stone-200/70">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold block">
                    Architektonische Spezifikationen:
                  </span>
                  <ul className="space-y-2 text-sm text-stone-700">
                    <li className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#ff8200] shrink-0" />
                      <span><strong>Blickwinkel:</strong> {activeModalItem.orientation}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#ff8200] shrink-0" />
                      <span><strong>Kategorie:</strong> {activeModalItem.category}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#ff8200] shrink-0" />
                      <span><strong>Standard:</strong> Nachhaltiges 11-Familienhaus &bull; KfW 40 QNG+</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Copy & Direct Action strip */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-stone-100/70 border border-stone-200/70">
                <div className="flex items-center gap-2 text-xs font-mono text-stone-600 truncate max-w-full">
                  <span className="text-stone-400">Dateiname:</span>
                  <code className="px-2 py-1 rounded bg-white border border-stone-200 text-stone-900 font-bold truncate">
                    {activeModalItem.filename}
                  </code>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleCopy(activeModalItem.filename, e)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-stone-50 text-stone-800 text-xs font-mono font-medium border border-stone-200 shadow-2xs transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  {copiedFilename === activeModalItem.filename ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Dateiname kopiert</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-stone-500" />
                      <span>Dateiname kopieren</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}
