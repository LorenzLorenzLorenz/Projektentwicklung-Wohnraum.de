import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Users, 
  Compass, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  PenTool, 
  Layers, 
  Building2, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Target,
  HeartHandshake,
  Phone,
  Mail
} from "lucide-react";

interface UeberUnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact?: () => void;
}

export default function UeberUnsModal({ isOpen, onClose, onOpenContact }: UeberUnsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0a0a0a]/80 backdrop-blur-md transition-all duration-300"
        />

        {/* Modal Window */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl bg-[#faf9f8] text-[#1c1917] rounded-[28px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)] border border-stone-200/80 overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-stone-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase font-mono font-semibold text-[#ff8200] block">
                  Das macht uns aus &bull; Fehlner &amp; Götz
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-900 tracking-tight">
                  Über uns &amp; Philosophie
                </h2>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 transition-colors duration-200 cursor-pointer"
              title="Schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 font-sans text-stone-700 text-sm leading-relaxed">
            
            {/* Hero Quote */}
            <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white p-6 sm:p-10 rounded-[28px] shadow-lg border border-stone-800 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-80 h-80 bg-[#ff8200]/15 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 space-y-4 max-w-3xl">
                <span className="text-[11px] uppercase tracking-[0.25em] font-mono text-[#ff8200] font-semibold">
                  Persönlich. Verbindlich. Kompromisslos in Qualität.
                </span>
                <h3 className="font-serif text-2xl md:text-3xl text-white font-light leading-snug">
                  „Wir können uns dank flacher Hierarchie mit nur einer Ebene ganz auf Filet-Grundstücke und handverlesene Wohnbauprojekte konzentrieren.“
                </h3>
                <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
                  Sie haben nur uns beide als feste Ansprechpartner. Wir begleiten Sie persönlich vom ersten Planungsstrich über die Rohbauphase bis zur Schlüsselübergabe &ndash; und darüber hinaus.
                </p>
              </div>
            </div>

            {/* Team Profiles: Herbert Götz & Andreas Fehlner */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-200/80 pb-3">
                <Users className="w-4 h-4 text-[#ff8200]" />
                <h4 className="font-serif text-lg text-stone-900 font-medium">
                  Wer wir sind &bull; Die Gründer &amp; Geschäftsführer
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Herbert Götz */}
                <div className="bg-white/90 p-7 rounded-[24px] border border-stone-200/90 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.03)] space-y-4 relative overflow-hidden group hover:border-[#ff8200]/50 transition-colors duration-300 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] tracking-widest uppercase font-mono font-semibold text-[#ff8200]">Geschäftsführer</span>
                        <h5 className="font-serif text-2xl text-stone-900 font-normal mt-0.5">Herbert Götz</h5>
                        <p className="text-xs text-stone-500 font-light mt-1">Geb. 1975 &bull; Verheiratet, Söhne Lorenz &amp; Matteo</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#ff8200] font-serif text-lg font-semibold">
                        HG
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                      Verantwortlich für Projektinitiierung, Baurechtschaffung, Standortanalysen, Wirtschaftlichkeitsrechnungen und strategische Bauherren-Beratung. Mit jahrzehntelanger Expertise im Ingolstädter Immobilienmarkt.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-end gap-4 text-xs font-mono text-stone-600">
                    <a href="mailto:hg@projektentwicklung-wohnraum.de" className="text-stone-700 hover:text-[#ff8200] transition-colors flex items-center gap-1.5 font-medium ml-auto">
                      <Mail className="w-3.5 h-3.5 text-[#ff8200]" />
                      <span>hg@projektentwicklung-wohnraum.de</span>
                    </a>
                  </div>
                </div>

                {/* Andreas Fehlner */}
                <div className="bg-white/90 p-7 rounded-[24px] border border-stone-200/90 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.03)] space-y-4 relative overflow-hidden group hover:border-[#ff8200]/50 transition-colors duration-300 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] tracking-widest uppercase font-mono font-semibold text-[#ff8200]">Prokura &amp; Projektleitung</span>
                        <h5 className="font-serif text-2xl text-stone-900 font-normal mt-0.5">Andreas Fehlner</h5>
                        <p className="text-xs text-stone-500 font-light mt-1">Geb. 1978 &bull; Verheiratet, Sohn Felix &amp; Tochter Sina</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#ff8200] font-serif text-lg font-semibold">
                        AF
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                      Verantwortlich für technische Konzeption, CAD-Visualisierung, Detail-Grundrissplanung gemeinsam mit Käufern und tägliche Qualitäts- und Bauüberwachung vor Ort auf der Baustelle.
                    </p>
                  </div>
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-stone-600">
                    <a href="tel:01705640417" className="text-stone-700 hover:text-[#ff8200] transition-colors flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#ff8200]" />
                      <span>Mobil: 0170 5640417</span>
                    </a>
                    <a href="mailto:af@projektentwicklung-wohnraum.de" className="text-stone-700 hover:text-[#ff8200] transition-colors flex items-center gap-1.5 font-medium ml-auto sm:ml-0">
                      <Mail className="w-3.5 h-3.5 text-[#ff8200]" />
                      <span>af@projektentwicklung-wohnraum.de</span>
                    </a>
                  </div>
                </div>

              </div>

              {/* General Contact Callout */}
              <div className="p-4 rounded-xl bg-stone-100/80 border border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Mail className="w-4 h-4 text-[#ff8200] shrink-0" />
                  <span>Allgemeiner Kontakt &amp; Zentrale:</span>
                </div>
                <a 
                  href="mailto:info@projektentwicklung-wohnraum.de" 
                  className="font-mono text-stone-900 font-semibold hover:text-[#ff8200] transition-colors"
                >
                  info@projektentwicklung-wohnraum.de
                </a>
              </div>
            </div>

            {/* Our Calculation Methods: Frontdoor & Backdoor Approach */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-200/80 pb-3">
                <TrendingUp className="w-4 h-4 text-[#ff8200]" />
                <h4 className="font-serif text-lg text-stone-900 font-medium">
                  Präzise Kalkulation &bull; Frontdoor- &amp; Backdoor-Approach
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                In der Projektinitiierung legen wir das Fundament für den nachhaltigen Erfolg eines Vorhabens. Dabei wenden wir zwei kompromisslose mathematische Ansätze an:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 rounded-[22px] bg-white/90 border border-stone-200/80 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.02)] space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs tracking-wider uppercase font-mono">
                    <Target className="w-4 h-4 text-[#ff8200]" />
                    1. Frontdoor-Approach (Kosten &rarr; Miete)
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                    Wir überschlagen die Gesamtkosten anhand fundierter Kennzahlen aus Material, Handwerkerleistungen und Baunebenkosten. Im Anschluss kalkulieren wir eine marktgerechte Mindestmiete bzw. den nachhaltigen Quadratmeterwert.
                  </p>
                </div>

                <div className="p-6 rounded-[22px] bg-white/90 border border-stone-200/80 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.02)] space-y-2">
                  <div className="flex items-center gap-2 text-stone-900 font-semibold text-xs tracking-wider uppercase font-mono">
                    <Target className="w-4 h-4 text-[#ff8200]" />
                    2. Backdoor-Approach (Miete &rarr; Kostenobergrenze)
                  </div>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                    Wir ermitteln die erzielbare, marktgerechte Miete für die Mikrolage und errechnen daraus die maximal zulässigen Gesamtkosten. <strong>Das ist die unverhandelbare rote Linie, die wir niemals überschreiten.</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* 4 Phases of Development */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-200/80 pb-3">
                <Layers className="w-4 h-4 text-[#ff8200]" />
                <h4 className="font-serif text-lg text-stone-900 font-medium">
                  Die 4 Phasen unserer Projektentwicklung
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-5 bg-white/90 rounded-[20px] border border-stone-200/80 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.02)] space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#ff8200] font-mono font-bold text-xs">
                    01
                  </div>
                  <div className="font-medium text-stone-900 text-xs sm:text-sm">Projektinitiierung</div>
                  <p className="text-xs text-stone-500 font-light leading-relaxed">
                    Grundstücksakquise, Projektentwicklungsrechnung, Frontdoor- &amp; Backdoor-Kalkulation.
                  </p>
                </div>

                <div className="p-5 bg-white/90 rounded-[20px] border border-stone-200/80 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.02)] space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#ff8200] font-mono font-bold text-xs">
                    02
                  </div>
                  <div className="font-medium text-stone-900 text-xs sm:text-sm">Projektkonzeption</div>
                  <p className="text-xs text-stone-500 font-light leading-relaxed">
                    Markt-, Standort- und Nutzungsanalyse, Risikoabwägung und CAD-Architekturentwurf.
                  </p>
                </div>

                <div className="p-5 bg-white/90 rounded-[20px] border border-stone-200/80 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.02)] space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#ff8200] font-mono font-bold text-xs">
                    03
                  </div>
                  <div className="font-medium text-stone-900 text-xs sm:text-sm">Projektmanagement</div>
                  <p className="text-xs text-stone-500 font-light leading-relaxed">
                    Eigene tägliche Bauüberwachung vor Ort mit einheimischen Meister-Handwerkern.
                  </p>
                </div>

                <div className="p-5 bg-white/90 rounded-[20px] border border-stone-200/80 shadow-[0_4px_16px_-6px_rgba(0,0,0,0.02)] space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#ff8200] font-mono font-bold text-xs">
                    04
                  </div>
                  <div className="font-medium text-stone-900 text-xs sm:text-sm">Projektvermarktung</div>
                  <p className="text-xs text-stone-500 font-light leading-relaxed">
                    Persönliche Beratung, Sonderwunsch-Umsetzung am Zeichenprogramm und schlüsselfertige Übergabe.
                  </p>
                </div>
              </div>
            </div>

            {/* Quality Pillars */}
            <div className="bg-white/80 p-6 sm:p-8 rounded-[24px] border border-stone-200/80 shadow-[0_8px_24px_-10px_rgba(0,0,0,0.03)] space-y-4">
              <div className="font-mono text-stone-900 text-xs uppercase tracking-wider font-semibold">
                Garantierte Bau- &amp; Wohnqualität
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-stone-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff8200] shrink-0" />
                  <span>Hochwertige Markenprodukte als Grundausstattung (GESSI, JURA Marmor, GIRA)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff8200] shrink-0" />
                  <span>Langjähriger, fester und einheimischer Handwerkerstamm</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff8200] shrink-0" />
                  <span>Intensive Zusammenarbeit mit regionalen Fachplanern &amp; Ingenieuren</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#ff8200] shrink-0" />
                  <span>Wartungsarme Energiekonzepte: Luft-Wärme-Pumpe, Photovoltaik, KEIN WDVS</span>
                </div>
              </div>
            </div>

          </div>

          {/* Footer actions */}
          <div className="px-6 sm:px-8 py-5 border-t border-stone-200/80 bg-white/90 backdrop-blur-md flex items-center justify-between">
            {onOpenContact ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenContact();
                }}
                className="text-xs font-mono uppercase tracking-wider text-[#ff8200] hover:underline font-medium cursor-pointer flex items-center gap-1.5"
              >
                <span>Persönliches Gespräch vereinbaren</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : <div />}

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-[#ff8200] text-white text-xs font-mono uppercase tracking-widest transition-all duration-300 cursor-pointer shadow-sm"
            >
              Schließen
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
