import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink, 
  ChevronRight, 
  Home, 
  Layers, 
  Calendar,
  Award,
  Zap,
  Eye,
  SlidersHorizontal,
  X,
  Map
} from "lucide-react";
import ProjekteLiveMap from "./ProjekteLiveMap";

interface ProjectItem {
  id: string;
  title: string;
  location: string;
  address: string;
  type: string;
  units: string;
  period: string;
  status: "available" | "sold" | "completed";
  statusText: string;
  highlights: string[];
  imageUrl: string;
  vrLink?: string;
  specs?: {
    livingArea?: string;
    energyStandard?: string;
    technology?: string;
  };
}

const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "kothau",
    title: "10-Familienhaus Kothau",
    location: "Ingolstadt Kothau",
    address: "Holznerstraße 13, 85053 Ingolstadt",
    type: "Luxus-Mehrfamilienhaus",
    units: "10 Wohneinheiten (1v10 verfügbar: WHG 09)",
    period: "Baubeginn Herbst 2025 &bull; Fertigstellung Mitte 2027",
    status: "available",
    statusText: "1 von 10 verfügbar (WHG 09)",
    imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=940x10000:format=jpg/path/s28ba7b3ad83a3aa1/image/i6080d0ca1f2b02fd/version/1750718373/image.jpg",
    highlights: [
      "Degressive AfA 7b 5% unbegrenzt & Sonder-AfA QNG+ 5% für 4 Jahre",
      "KfW 298/297 EH40 QNG+ & KfW 300 Familienkredit ab 0,01%",
      "Aufzug von TG bis DG & 100% schwellenlos",
      "GESSI Unterputz-Armaturen, JURA Marmor & Echtholzparkett",
      "Wärmepumpe, Photovoltaik + Speicher, Starkstrom an allen TG-Plätzen"
    ],
    specs: {
      livingArea: "40 m² bis 88 m² (WHG 09: 87 m², 643.800 €)",
      energyStandard: "KfW 40 QNG+ (Klimafreundlicher Neubau)",
      technology: "Luft-Wärmepumpe, PV + Speicher, Raffstores, kein WDVS"
    }
  },
  {
    id: "haunwoehr",
    title: "2x 5-Familienhaus Haunwöhr",
    location: "Ingolstadt Haunwöhr",
    address: "Aldringenstraße 7, 85051 Ingolstadt",
    type: "Ensemble aus 2 Mehrfamilienhäusern",
    units: "10 Wohneinheiten in Haus 01 & Haus 02",
    period: "Baubeginn Herbst 2024 &bull; Fertigstellung Ende 2026",
    status: "sold",
    statusText: "100% vermarktet",
    imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=940x10000:format=jpg/path/s28ba7b3ad83a3aa1/image/iea6fcf11f0af2905/version/1750717462/image.jpg",
    highlights: [
      "Ruhige Lage im beliebten Ingolstädter Südwesten",
      "Penthouse mit direktem Aufzug-Zugang",
      "Q-railing Ganzglasgeländer in blickdichtem Parsolgrau",
      "Elektrische Raffstores & Hebe-Schiebetüren in allen Einheiten",
      "Starkstrom-Vorbereitung mit dynamischem Lastmanagement in TG"
    ],
    specs: {
      livingArea: "50 m² bis 110 m²",
      energyStandard: "KfW 40 QNG+",
      technology: "Luft-Wärmepumpe, PV-Anlage, dezentrale Lüftung"
    }
  },
  {
    id: "etting-klingensberger",
    title: "5x Einfamilienhaus Etting",
    location: "Ingolstadt Etting",
    address: "Klingensbergerstraße 3, 85055 Ingolstadt",
    type: "Exklusive Einfamilienhaus-Siedlung",
    units: "5 freistehende Einfamilienhäuser (EFH 01 &ndash; 05)",
    period: "Fertiggestellt & übergeben",
    status: "sold",
    statusText: "100% verkauft",
    imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=940x10000:format=jpg/path/s28ba7b3ad83a3aa1/image/ice844413e6e936f6/version/1679007040/image.jpg",
    highlights: [
      "KfW 40 QNG+ Massivbauweise mit Ziegel & Süd-West-Ausrichtung",
      "Wohnflächen von 174 m² bis 210 m² mit großzügigen Privatgärten",
      "Gemauerte Doppelgaragen mit Kellerersatzraum (keine Fertiggaragen)",
      "Gründach auf Hauptdach, Garage und Nebengebäuden",
      "Innenliegende Entwässerung mit unsichtbaren Fallrohren"
    ],
    specs: {
      livingArea: "ca. 174 m² bis 210 m² (Grundstücke 324 &ndash; 449 m²)",
      energyStandard: "KfW 40 QNG+",
      technology: "Monovalente Luft-Wärmepumpe, Lüftung im Raffstorekasten"
    }
  },
  {
    id: "etting-ostenbrunnen",
    title: "2x 10-Familienhaus Etting",
    location: "Ingolstadt Etting",
    address: "Ostenbrunnenstraße 14, 85055 Ingolstadt",
    type: "Mehrfamilienhaus-Ensemble",
    units: "20 Eigentumswohnungen & Penthouses",
    period: "Fertiggestellt & bezogen",
    status: "completed",
    statusText: "Erfolgreich realisiert & bezogen",
    imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=940x10000:format=jpg/path/s28ba7b3ad83a3aa1/image/ieaee9d19ccc2e7e5/version/1596023066/image.jpg",
    vrLink: "https://www.johannacascelli.com/vr/eigentumswohnungen-in-etting/",
    highlights: [
      "Nur 1 km zur Audi-TE in ruhiger Anliegerstraße",
      "Virtueller 3D-VR-Rundgang durch Innen- und Außenarchitektur",
      "Hochwertige Silikatfarben statt Dispersionsfarben",
      "Bivalentes Energiekonzept mit Wärmepumpe & Brennwerttechnik",
      "Wasserenthärtungsanlage & barrierefreie Zugänge von TG bis DG"
    ],
    specs: {
      livingArea: "2- bis 3-Zimmer-Wohnungen & Dachterrassen-Penthouses",
      energyStandard: "KfW-55-Effizienzhaus",
      technology: "Wärmepumpe, Aufzug, elektrische Raffstores"
    }
  },
  {
    id: "loensstrasse",
    title: "3x Reihenhaus Ingolstadt",
    location: "Ingolstadt Nord-Ost",
    address: "Lönsstraße 15, 15a, 15b, 85055 Ingolstadt",
    type: "Architekten-Reihenhäuser",
    units: "3 Einheiten (REH 01, RMH 02, REH 03)",
    period: "Fertiggestellt & übergeben",
    status: "sold",
    statusText: "100% verkauft",
    imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=940x10000:format=jpg/path/s28ba7b3ad83a3aa1/image/ib5459506fa87685a/version/1679004630/image.jpg",
    highlights: [
      "Ruhige Lage nahe AUDI, Donau-City-Center und Autobahn A9",
      "Luft-Wärmepumpe mit Innenaufstellung ohne sichtbare Außeneinheit",
      "Dachterrasse mit unverbautem Weitblick & Privatgarten",
      "Fußbodenheizung vom Erdgeschoss bis ins 2. Obergeschoss",
      "DSL-Ausbau bis zu 1.000 MBit/s für anspruchsvolles Homeoffice"
    ],
    specs: {
      livingArea: "ca. 168 m² bis 171 m² zzgl. 68 m² Nutzfläche",
      energyStandard: "KfW-55-Effizienzhaus",
      technology: "Integrierte Innen-Wärmepumpe, Ziegelbauweise"
    }
  },
  {
    id: "zuchering",
    title: "Doppelhaus & Einfamilienhaus Zuchering",
    location: "Ingolstadt Zuchering",
    address: "Siedlungsstraße 15 & 15b, 85051 Ingolstadt",
    type: "Exklusives Doppelhaus & Einfamilienhaus",
    units: "2 Doppelhaushälften + 1 Einfamilienhaus",
    period: "Fertiggestellt",
    status: "sold",
    statusText: "100% verkauft",
    imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=294x10000:format=jpg/path/s28ba7b3ad83a3aa1/image/i0353d1d56f19936c/version/1552607387/image.jpg",
    highlights: [
      "Gemauerte XL-Doppelgarage mit elektrischer Vollausstattung",
      "Wohnraumhöhen von ca. 2,60 m und gerade Treppen mit Glasbrüstung",
      "T-Bad mit bodengleicher Walk-In-Dusche und Designer-Badewanne",
      "Wohnraumlüftung mit effizienter Wärmerückgewinnung",
      "Komplett ausgebautes Untergeschoss mit Wohnraumqualität"
    ],
    specs: {
      livingArea: "DH: je 129 m² Wfl. + 58 m² Nfl. | EFH: 177 m² Wfl.",
      energyStandard: "KfW 55 Ziegel-Massivbauweise",
      technology: "Monovalente Wärmepumpe, Wasserenthärtung"
    }
  },
  {
    id: "wirffelstrasse",
    title: "6-Familienhaus Wirffelstraße",
    location: "Ingolstadt Süd",
    address: "Wirffelstraße 20, 85053 Ingolstadt",
    type: "Kompaktes Mehrfamilienhaus",
    units: "6 Wohneinheiten (53 m² &ndash; 78 m²)",
    period: "Fertiggestellt",
    status: "completed",
    statusText: "Voll vermietet & verwaltet",
    imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=455x10000:format=jpg/path/s28ba7b3ad83a3aa1/image/i3ae42882ba924041/version/1532334485/image.jpg",
    highlights: [
      "Nur 2,5 Fahrrad-Kilometer zum modernen IN-Campus",
      "Jede Wohnung mit praktischem Abstellraum & Tageslichtbad",
      "Extrem geringe Betriebs- und Verwaltungskosten",
      "Bivalentes Energiekonzept mit Wärmepumpe & Gastherme",
      "Langlebige Ziegelmassivbauweise"
    ],
    specs: {
      livingArea: "53 m² bis 78 m²",
      energyStandard: "KfW 55",
      technology: "Bivalente Wärmepumpe, Fenster in allen Bädern"
    }
  },
  {
    id: "wettstetten",
    title: "3 Reihenhäuser Wettstetten",
    location: "Wettstetten b. Ingolstadt",
    address: "Goethering 11a-c, 85139 Wettstetten",
    type: "Reihenhausanlage in Hang-/Südlage",
    units: "3 Reihenhäuser",
    period: "Fertiggestellt",
    status: "sold",
    statusText: "100% verkauft",
    imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=294x10000:format=jpg/path/s28ba7b3ad83a3aa1/image/ia6cbdd6b28e8ee6c/version/1545042402/image.jpg",
    highlights: [
      "Optimale 200° Süd-Süd-West-Ausrichtung für ganztägige Sonne",
      "Terrasse mit blickdichtem Ganzglasgeländer von Q-railing",
      "Tonziegeldach & Ziegelmassivwände",
      "Komplett ausgebautes Dachgeschoss & E-Auto-Anschluss in Garage",
      "Wohnraumhöhen 2,60 m & T-Bad"
    ],
    specs: {
      livingArea: "ca. 164 m² Wfl. + 79 m² Nfl. (Grundstück ca. 297 m²)",
      energyStandard: "KfW 55",
      technology: "Luft-Wärmepumpe, kontrollierte Wohnraumlüftung"
    }
  },
  {
    id: "unterbrunnenreuth-efh",
    title: "Einfamilienhaus Unterbrunnenreuth",
    location: "Ingolstadt Unterbrunnenreuth",
    address: "Unterbrunnenreuth, 85051 Ingolstadt",
    type: "Architekten-Einfamilienhaus",
    units: "1 freistehendes Einfamilienhaus",
    period: "Fertiggestellt",
    status: "sold",
    statusText: "100% verkauft",
    imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=294x10000:format=jpg/path/s28ba7b3ad83a3aa1/image/i9cf75c585493f499/version/1533851593/image.jpg",
    highlights: [
      "Repräsentative Architektur mit riesigen Fensterfronten",
      "Schwellenlose Barrierefreiheit von der Einfahrt bis zur Terrasse",
      "Doppelgarage mit integriertem Wallbox-Anschluss",
      "Tonziegeldach und mineralische Wandbeschichtung",
      "Höchste Energieeffizienz mit minimalem Verbrauch"
    ],
    specs: {
      livingArea: "ca. 195 m² Wfl.",
      energyStandard: "KfW 55",
      technology: "Luft-Wärmepumpe, Wohnraumlüftung"
    }
  },
  {
    id: "wrangelstrasse",
    title: "Stadtvilla Wrangelstraße",
    location: "Ingolstadt Südwest",
    address: "Wrangelstraße 38, 85053 Ingolstadt",
    type: "Moderne Architektenvilla",
    units: "1 Stadtvilla mit Doppel- & Einzelgarage",
    period: "Fertiggestellt",
    status: "sold",
    statusText: "100% verkauft",
    imageUrl: "https://image.jimcdn.com/app/cms/image/transf/dimension=294x10000:format=jpg/path/s28ba7b3ad83a3aa1/image/i424a36b4d92a28e8/version/1631826407/image.jpg",
    highlights: [
      "Edles Fischgrät-Echtholzparkett in allen Wohn- und Schlafräumen",
      "XXL-Doppelgarage plus zusätzliche separate Einzelgarage",
      "T-Bad-Konzept mit maßgefertigter Walk-In Regendusche",
      "Deckenhöhe 2,60 m für herrschaftliches Raumgefühl",
      "Ziegelbauweise mit höchstem Schallschutz"
    ],
    specs: {
      livingArea: "ca. 215 m² Wfl.",
      energyStandard: "KfW 55",
      technology: "Luft-Wärmepumpe, Wohnraumlüftung"
    }
  }
];

export default function ProjekteChronik() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const filteredProjects = PROJECTS_DATA.filter((p) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "available") return p.status === "available";
    if (selectedFilter === "mfh") return p.type.includes("Mehrfamilienhaus") || p.type.includes("Ensemble");
    if (selectedFilter === "efh") return p.type.includes("Einfamilienhaus") || p.type.includes("Villa") || p.type.includes("Reihenhaus");
    return true;
  });

  return (
    <motion.section 
      id="projekte-chronik" 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.08 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="relative py-28 md:py-36 px-6 md:px-12 bg-transparent text-luxury-charcoal border-t border-stone-200/60"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header with Filter Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/80 pb-8"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100/90 border border-stone-200/70 text-[10px] md:text-[11px] font-mono uppercase tracking-widest text-[#ff8200] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff8200] animate-pulse"></span>
              <span>Portfolio &bull; Gebaute Realität im Raum Ingolstadt</span>
            </div>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-stone-900 leading-tight">
              Referenz-Chronik &amp; Bauprojekte
            </h2>
            <p className="font-sans text-stone-600 text-sm md:text-base font-light leading-relaxed">
              Vom schwellenlosen 10-Familienhaus bis zur exklusiven Stadtvilla &ndash; jedes unserer Vorhaben besticht durch kompromisslose Markenqualität und regionale Meisterhandwerker.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 font-sans text-xs">
            <button
              onClick={() => {
                const el = document.getElementById("projekte-live-karte");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-stone-900 hover:bg-[#ff8200] text-white shadow-sm transition-all duration-300 cursor-pointer font-medium text-xs tracking-wide"
            >
              <Map className="w-3.5 h-3.5 text-[#ff8200]" />
              <span>Live-Karte</span>
            </button>
            <button
              onClick={() => setSelectedFilter("all")}
              className={`px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer font-medium text-xs tracking-wide ${
                selectedFilter === "all"
                  ? "bg-stone-900 text-white shadow-sm scale-102"
                  : "bg-white/80 backdrop-blur-md border border-stone-200/80 text-stone-600 hover:bg-white hover:text-stone-900"
              }`}
            >
              Alle Projekte ({PROJECTS_DATA.length})
            </button>
            <button
              onClick={() => setSelectedFilter("available")}
              className={`px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer font-medium text-xs tracking-wide ${
                selectedFilter === "available"
                  ? "bg-[#ff8200] text-white shadow-sm scale-102"
                  : "bg-white/80 backdrop-blur-md border border-stone-200/80 text-stone-600 hover:bg-white hover:text-stone-900"
              }`}
            >
              Aktuell verfügbar
            </button>
            <button
              onClick={() => setSelectedFilter("mfh")}
              className={`px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer font-medium text-xs tracking-wide ${
                selectedFilter === "mfh"
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-white/80 backdrop-blur-md border border-stone-200/80 text-stone-600 hover:bg-white hover:text-stone-900"
              }`}
            >
              Mehrfamilienhäuser
            </button>
            <button
              onClick={() => setSelectedFilter("efh")}
              className={`px-5 py-2.5 rounded-full transition-all duration-300 cursor-pointer font-medium text-xs tracking-wide ${
                selectedFilter === "efh"
                  ? "bg-stone-900 text-white shadow-sm"
                  : "bg-white/80 backdrop-blur-md border border-stone-200/80 text-stone-600 hover:bg-white hover:text-stone-900"
              }`}
            >
              Villen &amp; Häuser
            </button>
          </div>
        </motion.div>

        {/* Live Google My Maps Interactive Map */}
        <div id="projekte-live-karte" className="scroll-mt-28">
          <ProjekteLiveMap />
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => {
            const isAvailable = project.status === "available";
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.08 }}
                className="group rounded-[28px] bg-white/85 backdrop-blur-xl border border-stone-200/80 overflow-hidden shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_50px_-10px_rgba(255,130,0,0.12)] hover:border-[#ff8200]/50 hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      onError={(e) => {
                        // Fallback image if Jimdo token is stale
                        (e.target as HTMLImageElement).src = "/src/assets/images/luxury_architecture_fallback_1783640400177.jpg";
                      }}
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold backdrop-blur-md shadow-sm ${
                        isAvailable 
                          ? "bg-[#ff8200] text-white border border-[#ff8200]" 
                          : "bg-stone-900/80 text-stone-200 border border-white/10"
                      }`}>
                        {project.statusText}
                      </span>
                    </div>

                    {/* Location Badge */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/75 backdrop-blur-md text-white text-[11px] font-sans">
                      <MapPin className="w-3 h-3 text-[#ff8200]" />
                      <span>{project.location}</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-7 space-y-4">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase font-semibold text-[#ff8200] block">
                        {project.type}
                      </span>
                      <h3 className="font-serif text-xl font-normal text-stone-900 mt-1">
                        {project.title}
                      </h3>
                      <p className="text-xs text-stone-500 font-light mt-0.5">
                        {project.address}
                      </p>
                    </div>

                    {/* Highlights List */}
                    <div className="space-y-2 pt-3 border-t border-stone-100">
                      {project.highlights.slice(0, 3).map((hl, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-stone-600 font-light">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#ff8200] shrink-0 mt-0.5" />
                          <span className="leading-snug">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer actions */}
                <div className="p-7 pt-0 border-t border-stone-100/80 flex items-center justify-between gap-3 mt-4">
                  {project.vrLink ? (
                    <a
                      href={project.vrLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#ff8200] hover:underline font-medium"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>3D-VR Rundgang</span>
                    </a>
                  ) : (
                    <div className="text-[11px] text-stone-400 font-mono">
                      {project.units}
                    </div>
                  )}

                  <button
                    onClick={() => setActiveModalProject(project)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-900 hover:text-white text-stone-700 text-xs font-sans transition-all duration-200 cursor-pointer"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </motion.div>
            );
          })}
        </div>

        {/* Historical predecessor section note */}
        <motion.div 
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[28px] bg-white/85 backdrop-blur-xl p-8 md:p-10 border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-[10px] font-mono tracking-widest uppercase font-semibold text-stone-500">
            <span>Historische Referenzen &bull; Kontinuität seit über einem Jahrzehnt</span>
          </div>
          <h4 className="font-serif text-xl text-stone-900 font-normal">
            Erfolgreich realisierte Vorhaben in Manching, Gaimersheim &amp; Ingolstadt
          </h4>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Inklusive der Großprojekte <strong>Manching Fischerlohe</strong> (6 Reihenhäuser, 1 MFH mit 9 WE, 2 Zweifamilienhäuser, 1 EFH, Tiefgarage), <strong>Gaimersheim Römerstraße</strong> (2 Mehrfamilienhäuser mit 18 WE und Tiefgarage), <strong>Ingolstadt Probierlweg</strong> sowie der erfolgreichen Vermittlung <strong>Unterbrunnenreuth Georg-Heiß-Straße</strong>.
          </p>
        </motion.div>

      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalProject(null)}
              className="fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-md"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="relative w-full max-w-3xl bg-[#faf9f8] rounded-[32px] shadow-2xl border border-stone-200/80 overflow-hidden z-10 max-h-[90vh] flex flex-col"
            >
              <div className="relative aspect-video max-h-72 w-full overflow-hidden bg-stone-900">
                <img 
                  src={activeModalProject.imageUrl} 
                  alt={activeModalProject.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-4 right-4 text-white drop-shadow-md">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#ff8200] font-semibold block">
                    {activeModalProject.type} &bull; {activeModalProject.location}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-medium">
                    {activeModalProject.title}
                  </h3>
                </div>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-sm text-stone-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <div>
                    <span className="text-stone-400 font-mono text-[10px] uppercase tracking-wider font-semibold block">Adresse</span>
                    <strong className="text-stone-900 text-sm font-medium">{activeModalProject.address}</strong>
                  </div>
                  <div>
                    <span className="text-stone-400 font-mono text-[10px] uppercase tracking-wider font-semibold block">Projektstatus</span>
                    <strong className="text-[#ff8200] text-sm font-medium">{activeModalProject.statusText}</strong>
                  </div>
                  {activeModalProject.specs?.energyStandard && (
                    <div>
                      <span className="text-stone-400 font-mono text-[10px] uppercase tracking-wider font-semibold block">Energiestandard</span>
                      <strong className="text-stone-900">{activeModalProject.specs.energyStandard}</strong>
                    </div>
                  )}
                  {activeModalProject.specs?.livingArea && (
                    <div>
                      <span className="text-stone-400 font-mono text-[10px] uppercase tracking-wider font-semibold block">Wohnflächen</span>
                      <strong className="text-stone-900">{activeModalProject.specs.livingArea}</strong>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-serif text-base text-stone-900 font-medium">Spezifikationen &amp; Besonderheiten</h4>
                  <div className="space-y-2">
                    {activeModalProject.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-stone-600">
                        <CheckCircle2 className="w-4 h-4 text-[#ff8200] shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {activeModalProject.vrLink && (
                  <a
                    href={activeModalProject.vrLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-[#ff8200] text-white text-xs font-sans tracking-wide transition-all duration-300"
                  >
                    <span>3D-Visualisierung &amp; VR-Rundgang starten</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              <div className="p-4 px-6 border-t border-stone-200 bg-white flex justify-end">
                <button
                  onClick={() => setActiveModalProject(null)}
                  className="px-6 py-2.5 rounded-full bg-stone-900 text-white text-xs tracking-wide font-sans hover:bg-[#ff8200] transition-colors cursor-pointer"
                >
                  Schließen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
