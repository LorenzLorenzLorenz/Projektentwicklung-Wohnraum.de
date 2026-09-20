import React from "react";
import { motion } from "motion/react";
import { 
  Users, 
  Target, 
  Layers, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Phone, 
  Mail, 
  Compass, 
  Sparkles, 
  Award,
  ChevronDown,
  Building2,
  TrendingUp,
  Cpu,
  Droplets,
  Zap,
  Clock
} from "lucide-react";

interface UeberUnsProps {
  onOpenContact?: () => void;
  onOpenImpressum?: () => void;
  onOpenDatenschutz?: () => void;
}

export default function UeberUns({ onOpenContact, onOpenImpressum, onOpenDatenschutz }: UeberUnsProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navbar = document.getElementById("navbar");
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 80;
    const rect = el.getBoundingClientRect();
    const currentScrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
    const targetScrollY = rect.top + currentScrollY - navbarHeight - 20;
    window.scrollTo({ top: targetScrollY, behavior: "smooth" });
  };

  return (
    <div className="bg-[#faf9f8] text-stone-900 min-h-screen font-sans selection:bg-[#ff8200]/25 selection:text-stone-900 relative">
      
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
          id="ueber-uns-hero"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-100/90 border border-stone-200/70 text-[11px] font-mono uppercase tracking-widest text-stone-600">
            <span className="w-2 h-2 rounded-full bg-[#ff8200] animate-pulse"></span>
            <span>Fehlner &amp; Götz &bull; Projektentwicklung Wohnraum</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-semibold tracking-tight text-stone-900 leading-[1.05]">
            Über uns. <br />
            <span className="text-[#ff8200]">Persönlich. Verbindlich.</span>
          </h1>

          <p className="text-lg sm:text-2xl text-stone-500 font-light max-w-3xl mx-auto leading-relaxed">
            Zwei Partner. Eine unverrückbare Vision. Wir konzentrieren uns dank flacher Hierarchie mit nur einer Ebene 
            ganz auf Filet-Grundstücke und handverlesene Wohnbauprojekte in Ingolstadt und der Region.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => scrollToSection("gruender-team")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-[#ff8200] text-white text-xs font-mono uppercase tracking-widest transition-all duration-300 shadow-sm cursor-pointer"
            >
              <span>Gründer kennenlernen</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>

            <button
              onClick={() => scrollToSection("philosophie-kalkulation")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-mono uppercase tracking-widest transition-all duration-300 border border-stone-200/70 cursor-pointer"
            >
              <span>Philosophie &amp; Kalkulation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.section>

        {/* =========================================================================
            2. LEITGEDANKE & VERSPRECHEN (APPLE CINEMATIC GLASS CARD)
            ========================================================================= */}
        <motion.section
          id="leitgedanke"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="rounded-[36px] bg-gradient-to-br from-stone-900 via-stone-900 to-stone-950 text-white p-8 sm:p-14 lg:p-16 border border-stone-800 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.25)] relative overflow-hidden">
            {/* Subtle glow orb */}
            <div className="absolute right-0 top-0 w-96 h-96 bg-[#ff8200]/15 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl space-y-8">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-[#ff8200] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Unser Leitsatz &bull; Ohne Umwege</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-white font-light leading-snug tracking-tight">
                „Wir können uns dank flacher Hierarchie mit nur einer Ebene ganz auf Filet-Grundstücke und handverlesene Wohnbauprojekte konzentrieren.“
              </h2>

              <p className="text-stone-300 text-base sm:text-xl font-light leading-relaxed max-w-3xl">
                Sie haben nur uns beide als feste Ansprechpartner. Wir begleiten Sie persönlich vom ersten Planungsstrich 
                über die Rohbauphase bis zur Schlüsselübergabe &ndash; und darüber hinaus.
              </p>

              {/* Stat badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-semibold text-white font-serif">2 Partner</div>
                  <div className="text-xs text-stone-400 font-light">Direkte Chefs als Ansprechpartner, 0 Zwischenebenen</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-semibold text-[#ff8200] font-serif">100% Vor Ort</div>
                  <div className="text-xs text-stone-400 font-light">Eigene tägliche Bauüberwachung auf jeder Baustelle</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-semibold text-white font-serif">Regional</div>
                  <div className="text-xs text-stone-400 font-light">Etablierte Meisterbetriebe aus Ingolstadt &amp; Umland</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* =========================================================================
            3. DIE GRÜNDER & GESCHÄFTSFÜHRER (TEAM SHOWCASE)
            ========================================================================= */}
        <section id="gruender-team" className="space-y-14">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-4"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-[#ff8200] font-bold block">
              Wer wir sind &bull; Die Köpfe dahinter
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 leading-[1.1]">
              Die Gründer &amp; Geschäftsführer.
            </h2>
            <p className="text-base sm:text-xl text-stone-500 font-light leading-relaxed">
              Direkte Verantwortung ohne Umwege. Als inhabergeführtes Bauträgerunternehmen stehen wir persönlich 
              mit unserem Namen für jedes Bauvorhaben und jedes Qualitätsversprechen ein.
            </p>
          </motion.div>

          {/* 2 Apple Founder Cards with Bidirectional Scroll */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* HERBERT GÖTZ */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_50px_-10px_rgba(255,130,0,0.1)] hover:border-[#ff8200]/50 transition-all duration-500 flex flex-col justify-between space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono tracking-widest uppercase font-semibold text-[#ff8200]">
                      Geschäftsführer
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1 tracking-tight">
                      Herbert Götz
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
                      Geb. 1975 &bull; Verheiratet, Söhne Lorenz &amp; Matteo
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#ff8200] font-serif text-xl font-semibold shadow-xs shrink-0">
                    HG
                  </div>
                </div>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
                  Verantwortlich für Projektinitiierung, Baurechtschaffung, Standortanalysen, 
                  Wirtschaftlichkeitsrechnungen und strategische Bauherren-Beratung. 
                  Mit jahrzehntelanger Expertise und fundiertem Netzwerk im Ingolstädter Immobilienmarkt.
                </p>

                {/* Focus areas */}
                <div className="space-y-2 pt-4 border-t border-stone-100">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
                    Schwerpunkte &amp; Kompetenz
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-light">
                      Projektinitiierung &amp; Grundstücke
                    </span>
                    <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-light">
                      Baurecht &amp; Erschließung
                    </span>
                    <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-light">
                      Wirtschaftlichkeitsanalyse
                    </span>
                    <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-light">
                      Käufer- &amp; Investorenberatung
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Contact Bar */}
              <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-end gap-4 text-xs font-mono text-stone-600">
                <a 
                  href="mailto:hg@projektentwicklung-wohnraum.de"
                  className="inline-flex items-center gap-2 text-stone-700 hover:text-[#ff8200] transition-colors font-medium ml-auto"
                >
                  <Mail className="w-3.5 h-3.5 text-[#ff8200]" />
                  <span>hg@projektentwicklung-wohnraum.de</span>
                </a>
              </div>
            </motion.div>

            {/* ANDREAS FEHLNER */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="group rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_50px_-10px_rgba(255,130,0,0.1)] hover:border-[#ff8200]/50 transition-all duration-500 flex flex-col justify-between space-y-8"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs font-mono tracking-widest uppercase font-semibold text-[#ff8200]">
                      Prokura &amp; Projektleitung
                    </span>
                    <h3 className="font-serif text-3xl sm:text-4xl text-stone-900 font-normal mt-1 tracking-tight">
                      Andreas Fehlner
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-500 font-light mt-1">
                      Geb. 1978 &bull; Verheiratet, Sohn Felix &amp; Tochter Sina
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#ff8200] font-serif text-xl font-semibold shadow-xs shrink-0">
                    AF
                  </div>
                </div>

                <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-light">
                  Verantwortlich für technische Konzeption, CAD-Visualisierung, Detail-Grundrissplanung 
                  gemeinsam mit Käufern und tägliche Qualitäts- und Bauüberwachung vor Ort auf der Baustelle.
                  Ihr direkter technischer Experte für die Ausführung.
                </p>

                {/* Focus areas */}
                <div className="space-y-2 pt-4 border-t border-stone-100">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-2">
                    Schwerpunkte &amp; Kompetenz
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-light">
                      CAD &amp; 3D-Architekturplanung
                    </span>
                    <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-light">
                      Individuelle Grundrissoptimierung
                    </span>
                    <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-light">
                      Tägliche Bauüberwachung vor Ort
                    </span>
                    <span className="px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-light">
                      Material- &amp; Ausstattungsberatung
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Contact Bar */}
              <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-stone-600">
                <a 
                  href="tel:01705640417"
                  className="inline-flex items-center gap-2 hover:text-[#ff8200] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#ff8200]" />
                  <span>Mobil: 0170 5640417</span>
                </a>
                <a 
                  href="mailto:af@projektentwicklung-wohnraum.de"
                  className="inline-flex items-center gap-2 hover:text-[#ff8200] transition-colors font-medium"
                >
                  <Mail className="w-3.5 h-3.5 text-[#ff8200]" />
                  <span>af@projektentwicklung-wohnraum.de</span>
                </a>
              </div>
            </motion.div>

          </div>

          {/* General Contact Callout */}
          <div className="p-6 sm:p-7 rounded-[24px] bg-white/75 backdrop-blur-md border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs font-mono text-stone-600 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200/60 flex items-center justify-center text-[#ff8200] shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-widest block text-[10px] font-semibold">Allgemeiner Kontakt</span>
                <span className="font-sans font-medium text-stone-900 text-sm">Zentrales Postfach für allgemeine Anfragen, Exposés &amp; Grundstücke</span>
              </div>
            </div>
            <a 
              href="mailto:info@projektentwicklung-wohnraum.de"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-100 hover:bg-[#ff8200] hover:text-white transition-all duration-300 font-semibold text-stone-800 shrink-0"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>info@projektentwicklung-wohnraum.de</span>
            </a>
          </div>
        </section>

        {/* =========================================================================
            4. PRÄZISE KALKULATION: FRONTDOOR & BACKDOOR (BIDIRECTIONAL SCROLL)
            ========================================================================= */}
        <section id="philosophie-kalkulation" className="space-y-14">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-4"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-[#ff8200] font-bold block">
              Mathematische Sicherheit &bull; Kalkulation
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 leading-[1.1]">
              Frontdoor- &amp; Backdoor-Approach.
            </h2>
            <p className="text-base sm:text-xl text-stone-500 font-light leading-relaxed">
              In der Projektinitiierung legen wir das Fundament für den nachhaltigen Erfolg eines Vorhabens. 
              Dabei wenden wir zwei kompromisslose mathematische Ansätze an:
            </p>
          </motion.div>

          {/* 2 Apple Calculation Method Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Frontdoor */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-8"
            >
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                    Methode 01 &bull; Bottom-Up
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                    Frontdoor-Approach <br />
                    <span className="text-stone-500 font-light text-xl">(Kosten &rarr; Miete)</span>
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                  Wir überschlagen die Gesamtkosten anhand fundierter Kennzahlen aus Material, Handwerkerleistungen 
                  und Baunebenkosten. Im Anschluss kalkulieren wir eine marktgerechte Mindestmiete bzw. 
                  den nachhaltigen Quadratmeterwert für die Kapitalanlage.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50/90 border border-stone-200/70 text-xs font-mono text-stone-600 space-y-1.5">
                <div className="text-[10px] uppercase tracking-wider text-[#ff8200] font-bold">Kalkulationspfad</div>
                <div>Baukosten + Grundstück + Reserven &rarr; Min.-Mietertrag</div>
              </div>
            </motion.div>

            {/* Backdoor */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-8"
            >
              <div className="space-y-5">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block mb-1">
                    Methode 02 &bull; Top-Down &bull; Rote Linie
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                    Backdoor-Approach <br />
                    <span className="text-stone-500 font-light text-xl">(Miete &rarr; Kostenobergrenze)</span>
                  </h3>
                </div>
                <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
                  Wir ermitteln die erzielbare, marktgerechte Miete für die Mikrolage und errechnen daraus die maximal 
                  zulässigen Gesamtkosten. <strong>Das ist die unverhandelbare rote Linie, die wir niemals überschreiten.</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/60 text-xs font-mono text-[#ff8200] space-y-1.5">
                <div className="text-[10px] uppercase tracking-wider font-bold">Unverhandelbare Obergrenze</div>
                <div className="text-stone-800 font-sans font-medium">Sicherheitsgrenze vor jedem Baubeginn verbindlich fixiert</div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* =========================================================================
            5. DIE 4 PHASEN UNSERER PROJEKTENTWICKLUNG (BIDIRECTIONAL SCROLL)
            ========================================================================= */}
        <section id="phasen-prozess" className="space-y-14">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-4"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-[#ff8200] font-bold block">
              Strukturierter Ablauf &bull; Von A bis Z
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 leading-[1.1]">
              Die 4 Phasen der Entstehung.
            </h2>
            <p className="text-base sm:text-xl text-stone-500 font-light leading-relaxed">
              Jedes Projekt durchläuft einen streng definierten, vierstufigen Entwicklungszyklus mit lückenloser 
              Qualitätsprüfung in jeder Phase.
            </p>
          </motion.div>

          {/* 4 Apple Phase Cards with Staggered Animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Phase 01 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.7, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[30px] p-7 sm:p-8 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-6 group hover:border-[#ff8200]/40 transition-colors duration-300"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 text-[#ff8200] font-mono font-bold text-sm flex items-center justify-center">
                  01
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-stone-900">
                  Projektinitiierung
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
                  Grundstücksakquise, städtebauliche Machbarkeitsstudie, Projektentwicklungsrechnung sowie fundierte Frontdoor- &amp; Backdoor-Kalkulation.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] font-mono text-stone-400">
                Phase 1 &bull; Fundament
              </div>
            </motion.div>

            {/* Phase 02 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[30px] p-7 sm:p-8 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-6 group hover:border-[#ff8200]/40 transition-colors duration-300"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 text-[#ff8200] font-mono font-bold text-sm flex items-center justify-center">
                  02
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-stone-900">
                  Projektkonzeption
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
                  Markt-, Standort- und Nutzungsanalyse, Risikoabwägung, detaillierter CAD-Architekturentwurf und Vorbereitung des Baurechts.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] font-mono text-stone-400">
                Phase 2 &bull; Planung
              </div>
            </motion.div>

            {/* Phase 03 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.7, delay: 0.19, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[30px] p-7 sm:p-8 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-6 group hover:border-[#ff8200]/40 transition-colors duration-300"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 text-[#ff8200] font-mono font-bold text-sm flex items-center justify-center">
                  03
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-stone-900">
                  Projektmanagement
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
                  Eigene tägliche Bauüberwachung vor Ort, Steuerung der einheimischen Meister-Handwerker und permanente Budget- sowie Terminkontrolle.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] font-mono text-stone-400">
                Phase 3 &bull; Realisierung
              </div>
            </motion.div>

            {/* Phase 04 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.15 }}
              transition={{ duration: 0.7, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[30px] p-7 sm:p-8 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-6 group hover:border-[#ff8200]/40 transition-colors duration-300"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200/60 text-[#ff8200] font-mono font-bold text-sm flex items-center justify-center">
                  04
                </div>
                <h3 className="text-xl font-semibold tracking-tight text-stone-900">
                  Projektvermarktung
                </h3>
                <p className="text-xs sm:text-sm text-stone-500 font-light leading-relaxed">
                  Persönliche Beratung, individuelle Sonderwunsch-Umsetzung am CAD-System und persönliche schlüsselfertige Übergabe an den Bauherrn.
                </p>
              </div>
              <div className="pt-3 border-t border-stone-100 text-[11px] font-mono text-stone-400">
                Phase 4 &bull; Übergabe
              </div>
            </motion.div>

          </div>
        </section>

        {/* =========================================================================
            6. GARANTIERTE BAU- & WOHNQUALITÄT (APPLE QUALITY PILLARS)
            ========================================================================= */}
        <section id="qualitaet-standards" className="space-y-14">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl space-y-4"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-[#ff8200] font-bold block">
              Geprüfte Substanz &bull; Ohne Kompromisse
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-stone-900 leading-[1.1]">
              Garantierte Bau- &amp; Wohnqualität.
            </h2>
            <p className="text-base sm:text-xl text-stone-500 font-light leading-relaxed">
              Vier feste Säulen sichern den langfristigen Wert und die Freude an Ihrer Immobilie.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Pillar 1 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] space-y-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                  Material &bull; Design
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                  Hochwertige Markenprodukte als Standard
                </h3>
                <p className="text-sm sm:text-base text-stone-500 font-light leading-relaxed">
                  Keine Standard-Baumarktware. Jede Wohnung wird serienmäßig mit exklusiven Designlinien wie 
                  GESSI Unterputz-Armaturen, echtem JURA Marmor, Echtholzparkett und GIRA Schaltersystemen ausgestattet.
                </p>
              </div>
            </motion.div>

            {/* Pillar 2 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] space-y-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                  Handwerk &bull; Verlässlichkeit
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                  Langjähriger, regionaler Meisterhandwerker-Stamm
                </h3>
                <p className="text-sm sm:text-base text-stone-500 font-light leading-relaxed">
                  Wir arbeiten ausschließlich mit eingespielten, einheimischen Meisterbetrieben aus der Region Ingolstadt. 
                  Keine wechselnden Subunternehmen &ndash; jeder Handwerker kennt unsere hohen Standards.
                </p>
              </div>
            </motion.div>

            {/* Pillar 3 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.19, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] space-y-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                  Ingenieurwesen &bull; Fachplanung
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                  Intensive Zusammenarbeit mit Fachplanern
                </h3>
                <p className="text-sm sm:text-base text-stone-500 font-light leading-relaxed">
                  Engste Abstimmung mit renommierten regionalen Tragwerksplanern, Akustik- &amp; Schallschutzgutachtern 
                  sowie zertifizierten Energieberatern &ndash; für nachweisbare Ruhe und maximale Bauphysik.
                </p>
              </div>
            </motion.div>

            {/* Pillar 4 */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.75, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[32px] p-8 sm:p-10 bg-white/80 backdrop-blur-xl border border-stone-200/80 shadow-[0_12px_36px_-15px_rgba(0,0,0,0.03)] space-y-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/60 text-[#ff8200] flex items-center justify-center">
                <Zap className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                  Nachhaltigkeit &bull; Zukunftsfähigkeit
                </span>
                <h3 className="text-2xl font-semibold tracking-tight text-stone-900">
                  Wartungsarme Energiekonzepte &bull; KEIN WDVS
                </h3>
                <p className="text-sm sm:text-base text-stone-500 font-light leading-relaxed">
                  Moderne Luft-Wasser-Wärmepumpen in Kombination mit Photovoltaik und Batteriespeichern. 
                  Wir bauen monolithisch mit porosierten Ziegeln &ndash; ganz ohne wartungsintensives WDVS.
                </p>
              </div>
            </motion.div>

          </div>
        </section>

        {/* =========================================================================
            7. PERSÖNLICHES GESPRÄCH VEREINBAREN (APPLE ACTION BANNER)
            ========================================================================= */}
        <motion.section
          id="ueber-uns-kontakt-cta"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[36px] bg-white/85 backdrop-blur-2xl border border-stone-200/90 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.04)] p-8 sm:p-14 lg:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
        >
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#ff8200] font-bold block">
              Direkter Draht
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
              Sprechen Sie direkt mit den Gründern.
            </h2>
            <p className="text-sm sm:text-base text-stone-500 font-light leading-relaxed">
              Ob Detailfragen zu einem unserer aktuellen Bauprojekte, individueller Grundriss-Wunsch 
              oder Grundstücksangebot &ndash; wir nehmen uns Zeit für Sie.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full sm:w-auto">
            {onOpenContact && (
              <button
                onClick={onOpenContact}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-stone-900 hover:bg-[#ff8200] text-white text-xs font-mono uppercase tracking-widest transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Gespräch vereinbaren</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <a
              href="mailto:info@projektentwicklung-wohnraum.de"
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-stone-100 hover:bg-[#ff8200] hover:text-white text-stone-800 text-xs font-mono uppercase tracking-widest transition-all duration-300 border border-stone-200/80 flex items-center justify-center gap-2"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>info@projektentwicklung-wohnraum.de</span>
            </a>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
